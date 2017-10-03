import {convertMsToH, objHasDeepProp} from '../helpers/helpers';

test('convertMsToH', () => {
    expect(convertMsToH(1000 * 60 * 60)).toBe(1);
});

test('objHasDeepProp', () => {
    const obj = {
        id: 0,
        client: {
            id: 1,
            name: 'client'
        }
    }

    expect(objHasDeepProp(obj, 'id')).toBe(true);
    expect(objHasDeepProp(obj, 'client.id')).toBe(true);
    expect(objHasDeepProp(obj, 'client.address')).toBe(false);
    expect(objHasDeepProp(obj, 'address')).toBe(false);
});