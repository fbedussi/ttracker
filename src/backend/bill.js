import initIdMaker from '../helpers/idMaker';
import merge from '../helpers/merge';
import db from '../db/dbFacade';
import {deepCloneDataObject, objHasDeepProp} from '../helpers/helpers';

import {loadClient} from './client';

var billIdMaker = null;

const DBCOLLECTION = 'bill';

const defaultBillProps = {
    id: 0,
    date: 0,
    total: 0,
    client: {},
    text: '',
    currency: '€',
    textTemplate: '',
};

var Bill = {
    _createText: function() {
        const templateWithThisKeyword = this.textTemplate.replace(/(\${)([^}]*})/g, '$1' + 'this.' + '$2');
        const textTemplate = new Function(`return \`${templateWithThisKeyword}\`;`);
        const textTemplateVariables = {
            clientName: this.client.name,
            clientAddress: this.client.billingInfo.address,
            clientVatNumber: this.client.billingInfo.vatNumber,
            date: new Date(this.date).toLocaleDateString(),
            currency: this.currency,
            total: this.total,
            activities: this.client.activities.reduce((activityList, activity) => `${activityList}${activityList.length ? ', ' : ''}${activity.name}`, '')
        };
        this.text = textTemplate.call(textTemplateVariables);
    },
    create: function(props, options = {}) {
        if (!(objHasDeepProp(props, 'client.activities') && props.client.activities.length)) {
            return false;
        }
        const lastBilledTime = props.client.bills.reduce((lastBilledTime, bill) => bill.date, 0);
        const date = Date.now();
        if (lastBilledTime > date) {
            return false;
        }
        const total = Math.round(props.client.activities.reduce((total, activity) => total + activity.getTotalCost(lastBilledTime), 0));
        
        if (total === 0 && !(objHasDeepProp(options, 'allowZeroTotalBill') && options.allowZeroTotalBill)) {
            return false;
        }
        
        Object.assign(this, Object.assign({}, deepCloneDataObject(defaultBillProps)));
        merge(this, props);
        this.id = billIdMaker.next().value;
        this.client = props.client;
        this.date = date;
        this.total = total;
        this._createText();

        db.create(DBCOLLECTION, this.exportForDb());

        return this;
    },
    load: function(props) {
        merge(this, props);
        if (objHasDeepProp(props, 'client')) {
            this.client = props.client;
        }

        return this;
    },
    update: function(newProps) {
        merge(this, newProps);

        db.update(DBCOLLECTION, this.exportForDb());

        return this;
    },
    refreshText: function() {
        this._createText();
        
        db.update(DBCOLLECTION, this.exportForDb());

        return this;
    },
    delete: function() {
        db.delete(DBCOLLECTION, this.id);

        return this.id;
    },
    exportForDb: function() {
        var objToSave = Object.assign({}, this);
        objToSave.client = {id: this.client.id};

        return objToSave;
    },
    exportForClient: function() {
        var objToExport = Object.assign({}, this);
  
        return objToExport;
    },
    resolveDependencies: function(clients) {
        this.client = clients.filter((client) => client.id === this.client.id)[0];

        return this;
    }
}

const createBill = (props, options) => Object.create(Bill).create(props, options);

const loadBill = (props) => Object.assign(Object.create(Bill), deepCloneDataObject(defaultBillProps)).load(props);

const initBillIdMaker = (user) => {
    initIdMaker('bill', user).then((idMaker) => billIdMaker = idMaker);
}

export {
    createBill,
    loadBill,
    initBillIdMaker
};