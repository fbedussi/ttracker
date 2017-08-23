import merge from '../helpers/merge';

test('merge', () => {
    const destObj = {
        a: 'a'
    };
    const sourceObj = {
        a: 'b',
        b: 'b'
    }
    merge(destObj, sourceObj)
    expect(destObj.a).toBe('b');
    expect(destObj.b).toBe(undefined);
});
