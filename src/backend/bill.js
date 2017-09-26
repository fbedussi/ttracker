import initIdMaker from '../helpers/idMaker';
import merge from '../helpers/merge';
import db from '../db/dbFacade';
import {deepCloneDataObject} from '../helpers/helpers';

import {loadClient} from './client';

var billIdMaker = null;
initIdMaker('bill').then((idMaker) => billIdMaker = idMaker);

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
    create: function(props) {
        if (!(props && props.client && props.client.activities && props.client.activities.length)) {
            return false;
        }
        const lastBilledTime = props.client.bills.reduce((lastBilledTime, bill) => bill.date, 0);
        const date = Date.now();
        if (lastBilledTime > date) {
            return false;
        }
        const total = props.client.activities.reduce((total, activity) => total + activity.getTotalCost(lastBilledTime), 0);
        if (total === 0) {
            return false;
        }
        Object.assign(this, Object.assign({}, deepCloneDataObject(defaultBillProps)));
        merge(this, props);
        this.id = billIdMaker.next().value;
        this.client = props.client;
        //delete this.client.bills;
        //console.log('BILL CLIENT', this.client)
        this.date = date;
        this.total = total;
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

        db.create(DBCOLLECTION, this.exportForDb());

        return this;
    },
    load: function(props) {
        merge(this, props);
        if (props && props.client) {
            this.client = props.client;
        }

        return this;
    },
    update: function(newProps) {
        // if (!this.client.bills.length) {
        //     return false;
        // }
        // const lastBill = this.client.bills[this.client.bills.length - 1];
        // console.log('newProps.id !== lastBill.id', newProps.id, lastBill.id)
        // if (newProps.id !== lastBill.id) {
        //     return false;
        // }
        merge(this, newProps);

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
        //delete this.client.bills;

        return this;
    }
}

const createBill = (props) => Object.create(Bill).create(props);

const loadBill = (props) => Object.assign(Object.create(Bill), deepCloneDataObject(defaultBillProps)).load(props);

export {
    createBill,
    loadBill
};