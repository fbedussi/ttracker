import Db from db;

var Activity = {
    ID,
    name: 'new activity',
    startTime,
    hourlyRate,
    subactivities: [],
    create: (ID, hourlyRate) => {
        this.ID = ID;
        this.hourlyRate = hourlyRate;
        this.startTime = Date.now();
        db.createActivity(this);
    },
    update: (newProps) => {
        Object.keys(this).forEach(key => {
            if (newProps[key]) {
                
            }
        })
        Object.assign(this, newProps);
        db.updateActivity(this);
    },
    delete: () => {
        db.deleteActivity(this);
    },
}
