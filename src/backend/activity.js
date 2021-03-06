import initIdMaker from '../helpers/idMaker';
import merge from '../helpers/merge';
import db from '../db/dbInterface';
import {convertMsToH, deepCloneDataObject, objHasDeepProp} from '../helpers/helpers';

var activityIdMaker = null;

const DBCOLLECTION = 'activity';

const defaultProps = {
    id: 0,
    name: 'new activity',
    client: {},
    parentActivity: {},
    hourlyRate: 0,
    subactivities: [],
    timeEntries: []
};

var Activity = {
    create: function(props) {
        Object.assign(this, deepCloneDataObject(defaultProps));        
        merge(this, props);

        if (!props.hasOwnProperty('id')) {
            this.id = activityIdMaker.next().value;
        }

        //client and parentActivity has no properties in defatulProps, so merge doesn't merge anything, we need to copy them separately
        if (props && props.client) {
            this.client = props.client;
        }
        if (props && props.parentActivity) {
            this.parentActivity = props.parentActivity;
        }

        db.create(DBCOLLECTION, this.exportForDb());
        
        return this;
    },
    load: function(props) {
        merge(this, props);

        if (props && props.client) {
            this.client = props.client;
        }
        if (props && props.parentActivity) {
            this.parentActivity = props.parentActivity;
        }
        
        return this;
    },
    update: function(newProps) {
        merge(this, newProps);
        
        db.update(DBCOLLECTION, this.exportForDb());
        
        return this;
    },
    delete: function(deleteSubactivities = false, deletedIds = []) {
        if (deleteSubactivities) {
            this.subactivities.forEach((subactivity) => subactivity.delete(true, deletedIds));
        }

        if (this.client.removeActivity) {
            this.client.removeActivity(this.id);
        }

        if (objHasDeepProp(this, 'parentActivity.id')) {
            this.parentActivity.removeSubactivity(this.id);
        }

        deletedIds.push(this.id);

        db.delete(DBCOLLECTION, this.id);

        return deletedIds
    },
    getTotalTime: function(sinceTime = 0) {
        var subactivitiesTotalTime = this.subactivities
            .reduce((totalTime, subactivity) => subactivity && subactivity.getTotalTime ? 
                totalTime + subactivity.getTotalTime(sinceTime)
                : 0
            , 0);
        var timeEntriesTotalTime = this.timeEntries
            .filter(timeEntry => timeEntry.endTime > sinceTime)
            .reduce((totalTime, timeEntry) => totalTime + timeEntry.duration, 0)
        ;
        
        return subactivitiesTotalTime + timeEntriesTotalTime;
    },
    getTotalCost: function(sinceTime = 0) {
        var subactivitiesTotalCost = this.subactivities
            .reduce((totalCost, subactivity) => subactivity && subactivity.getTotalCost ? 
                totalCost + subactivity.getTotalCost(sinceTime)
                : 0
            , 0);
            
        var timeEntriesTotalTime = this.timeEntries
            .filter(timeEntry => timeEntry.endTime > sinceTime)
            .reduce((totalTime, timeEntry) => totalTime + timeEntry.duration, 0)
        ;
        
        return subactivitiesTotalCost + convertMsToH(timeEntriesTotalTime) * this.hourlyRate;
    },
    addSubactivity: function(props = {}) {
        var newActivity;

        if (!props.hourlyRate) {
            props.hourlyRate = this.hourlyRate;
        }
        props.parentActivity = this;
        props.client = this.client;
        
        newActivity = createActivity(props);
        this.subactivities.push(newActivity);
        
        db.update(DBCOLLECTION, this.exportForDb());
        
        return this;
    },
    removeSubactivity: function(id, deleteSubactivity = false) {
        const removedSubactivity = this.subactivities.filter(subactivity => subactivity.id === id)[0];

        if (!removedSubactivity) {
            throw new Error(`Activity ID ${this.id} has no subactivity with ID ${id}`);
        }
        
        this.subactivities = this.subactivities.filter(subactivity => subactivity.id !== id);

        if (deleteSubactivity) {
            removedSubactivity.delete(true);
        }

        db.update(DBCOLLECTION, this.exportForDb());
        
        return this;
    },
    start: function() {
        const newTimeEntry = {
            id: this.timeEntries.length,
            startTime: Date.now(),
            endTime: 0,
            duration: 0
        };
        
        this.timeEntries.push(deepCloneDataObject(newTimeEntry));
        
        db.update(DBCOLLECTION, this.exportForDb());
        
        return this;
    },
    stop: function() {
        const lastTimeEntry = this.timeEntries[this.timeEntries.length - 1];

        if (!lastTimeEntry) {
            throw new Error(`It appears this activity ID ${this.id} never started`);
        }

        lastTimeEntry.endTime = Date.now();
        lastTimeEntry.duration = lastTimeEntry.endTime - lastTimeEntry.startTime;
        
        db.update(DBCOLLECTION, this.exportForDb());
        
        return this;
    },
    deleteTimeEntry: function(timeEntryId) {
        this.timeEntries = this.timeEntries
            .filter(timeEntry => timeEntry.id !== timeEntryId);

        //TODO: update DB only if something changes
        db.update(DBCOLLECTION, this.exportForDb());

        return this;
    },
    addTimeEntry: function(timeEntry) {
        this.timeEntries.push(deepCloneDataObject(timeEntry));
        
        db.update(DBCOLLECTION, this.exportForDb());
        
        return this;
    },
    updateTimeEntry: function(props) {
        if (!props.hasOwnProperty('id')) {
            throw new Error('Activity ID missing, cannot update activity');
        }

        this.timeEntries = this.timeEntries
            .map(timeEntry => {
                if (timeEntry.id !== props.id) {
                    return timeEntry;
                }

                merge(timeEntry, props);
                timeEntry.duration = timeEntry.endTime - timeEntry.startTime;
                return timeEntry;
            });

        db.update(DBCOLLECTION, this.exportForDb());

        return this;
    },
    exportForDb: function() {
        var objToSave = Object.assign({},this);
        objToSave.parentActivity = objHasDeepProp(objToSave, 'parentActivity.id') ? {id: objToSave.parentActivity.id} : {};
        objToSave.client = objToSave.client.hasOwnProperty('id') ? {id: objToSave.client.id} : {};
        objToSave.subactivities = objToSave.subactivities.map((subactivity) => ({id: subactivity.id}));

        return objToSave;
    },
    exportForClient: function() {
        var lastBilledDate = this.client.lastBilledDate || 0;
        var objToExport = Object.assign({}, this, {
            totalCost: this.getTotalCost(),
            totalTimeToBill: this.getTotalTime(lastBilledDate),
            totalCostToBill: this.getTotalCost(lastBilledDate),
            totalTime: this.getTotalTime(),
            timeEntries: this.timeEntries.map((timeEntry) => Object.assign({}, timeEntry, {cost: this.hourlyRate * convertMsToH(timeEntry.duration)})),
            
            subactivities: this.subactivities.map((activity) => activity.exportForClient ? activity.exportForClient() : Object.assign({}, activity)),            
            client: Object.assign({}, this.client),
            parentActivity: this.parentActivity ? this.parentActivity : {}         
        });
  
        return objToExport;
    },
    resolveDependencies: function(clients, activities) {
        if (this.client.hasOwnProperty('id')) {
            const client = clients.filter((client) => client.id === this.client.id)[0];
            if (client) {
                this.client = client;
            }
        }
        this.parentActivity = activities.filter((activity) => activity.id === this.parentActivity.id)[0];
        this.subactivities = this.subactivities
            .map((subActivity) => activities
                .filter((storedActivity) => storedActivity.id === subActivity.id)[0]
            )

        return this;
    }
}

const createActivity = (props) => Object.create(Activity).create(props);

const loadActivity = (props) => Object.assign(Object.create(Activity), deepCloneDataObject(defaultProps)).load(props);

const initActivityIdMaker = (user) => {
    initIdMaker('activity', user).then((idMaker) => activityIdMaker = idMaker);
}

export {
    createActivity,
    loadActivity,
    initActivityIdMaker,
};