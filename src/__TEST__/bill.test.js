import {createBill, loadBill} from '../backend/bill';
import db from '../db/dbFacade';

jest.mock('../db/dbFacade');
jest.mock('../helpers/idMaker');

beforeEach(() => {
    Object.keys(db).forEach(method => db[method].mockClear());
});

const client = {
    id: 1,
    name: 'client 1',
    billingInfo: {
        address: 'Oxfrod street, 1',
        phone: '12345',
        vatNumber: 'abcde',
    },
    bills: [
        {
            id: 1,
            date: 40,
            total: 10
        }
    ],
    activities: [{id:1, name: 'activitiy 1', getTotalCost: (sinceTime) => sinceTime > 50 ? 0 : 30}, {id:2, name: 'activitiy 2', getTotalCost: () => sinceTime > 50 ? 0 : 30}]
};
const textTemplate = '${clientName}\n${clientAddress}\n${clientVatNumber\n\ndate: ${date}\n\nthe invoice total is ${currency}${total}\nfor the following activities: ${activities}.';

test('Create bill', () => {
    Date.now() = () => 101;
   
    const bill = createBill({
        client,
        textTemplate,
        currency: '€'
    });

    // const template = "Hello ${this.word}!";
    // const tpl = new Function(`return \`${template}\`;`);
    
    // console.log(tpl.call({
    //     word: "world"    
    // }));

    expect(bill.id > 0).toBe(true);
    expect(bill.date).toBe(101);
    expect(bill.textTemplate).toBe(textTemplate);
    expect(bill.total).toBe(60);
    exepct(bill.text).toBe('client 1\nOxfordStreet, 1\n12345\nabcde\n\ndate: Thu Jan 01 1970\n\nthe invoice total is €60.\nfor the following activities: activity 1, activity 2.')
});

test('Create bill - do not create bill if there is nothing to bill', () => {
    Date.now() = () => 101;
    const client2 = Object.assing({}, client);
    client2.bills.push({
        id: 2,
        date: 60,
        total: 10
    });
    const bill = createBill({
        client: client2,
        textTemplate,
        currency: '€'
    });

    expect(bill).toBe(false);
});

test('bill.update()', () => {
    Date.now() = () => 102;
    const bill = createBill({
        client,
        textTemplate,
        currency: '€'
    });
    
    bill.update({
        id: 1,
        date: 103,
        total: 70,
        text: 'baz'
    });
    expect(bill.date).toBe(103);
    expect(bill.text).toBe('baz');
    expect(bill.total).toBe(70);
    expect(db.update).toBeCalled();    
});

test('bill.update() do not change date if it is not the last bill', () => {
    Date.now() = () => 104;
    const bill = createBill({
        client,
        textTemplate,
        currency: '€'
    });
    Date.now() = () => 155;
    const bill2 = createBill({
        client,
        textTemplate,
        currency: '€'
    });
    
    bill.update({
        id: 1,
        date: 200,
        total: 70,
        text: 'baz'
    });
    expect(bill.date).toBe(104);
    expect(bill.text).toBe('baz');
    expect(bill.total).toBe(70);
    expect(db.update).toBeCalled();    
});

test('client.exportForDb()', () => {
    const bill = createBill({
        client,
        textTemplate,
        currency: '€'
    });

    const billReadyForDB = bill.exportForDb();    
    expect(billReadyForDB).toEqual({
        id: bill.id,
        date: bill.date,
        client: {id: bill.client.id},
        textTemplate: bill.textTemplate,
        text: bill.text,
        total: bill.total,
    });
});


test('bill.exportForClient()', () => {
    const bill = createBill({
        client,
        textTemplate,
        currency: '€'
    });

    const billReadyForClient = bill.exportForClient();    
    expect(billReadyForClient).toEqual({
        id: bill.id,
        date: bill.date,
        client: bill.client,
        textTemplate: bill.textTemplate,
        text: bill.text,
        total: bill.total,
    });
});