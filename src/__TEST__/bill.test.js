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
        address: 'Oxford street, 1',
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
    activities: [{
        id:1,
        name: 'activity 1',
        getTotalCost: (sinceTime) => sinceTime > 100 ? 0 : 30
    }, {
        id:2,
        name: 'activity 2',
        getTotalCost: (sinceTime) => sinceTime > 100 ? 0 : 30
    }]
};
const textTemplate = '${clientName}\n${clientAddress}\n${clientVatNumber}\n\ndate: ${date}\n\nthe invoice total is ${currency}${total}.\nfor the following activities: ${activities}.';

test('Create bill', () => {
    Date.now = () => 101;
   
    const bill = createBill({
        client,
        textTemplate,
        currency: '€'
    });

    expect(bill.id > 0).toBe(true);
    expect(bill.date).toBe(101);
    expect(bill.textTemplate).toBe(textTemplate);
    expect(bill.total).toBe(60);
    expect(bill.text).toBe(`client 1\nOxford street, 1\nabcde\n\ndate: ${new Date(101).toLocaleDateString()}\n\nthe invoice total is €60.\nfor the following activities: activity 1, activity 2.`)
});

test('Create bill - do not create bill if there is nothing to bill', () => {
    Date.now = () => 200;
    client.bills.push({
        id: 2,
        date: 150,
        total: 10
    });
    const bill = createBill({
        client,
        textTemplate,
        currency: '€'
    });

    expect(bill).toBe(false);
    client.bills.pop();
});

test('bill.update()', () => {
    Date.now = () => 102;
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

test('bill.delete()', () => {
    const bill = createBill({
        client,
        textTemplate,
        currency: '€'
    });
    bill.delete();
    expect(db.delete).toBeCalled();
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
        currency: bill.currency,
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
        currency: '€'        
    });
});