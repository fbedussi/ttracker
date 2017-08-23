function convertMsToH(ms) {
    return ms/3600000;    
}

var Activity = {
    id: null,
    name: 'new activity',
    startTime: null,
    hourlyRate: null,
    db: null,
    subactivities: [],
    create: function(conf) {
        this.id = conf.id;
        this.hourlyRate = conf.hourlyRate;
        this.db = conf.db;
        this.startTime = Date.now();
        this.db.create('activity', this);
        return this;
    },
    update: function(newProps) {
        Object.keys(this).forEach(key => {
            if (newProps[key]) {
                
            }
        })
        Object.assign(this, newProps);
        this.db.update('activity', this);
    },
    delete: function() {
        this.db.delete('activity', this);
    },
    getTotalTime: function() {
        return this.subactivities.reduce((totalTime, subactivity) => totalTime + subactivity.getTotalTime(), 0);
    },
    getTotalCost: function() {
        return convertMsToH(this.getTotalTime()) * this.hourlyRate;
    }
}

const createActivity = (conf) => {
    return Object.create(Activity).create(conf);
}

export default createActivity;