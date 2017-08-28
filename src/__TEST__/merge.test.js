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

test('merge with no sourceObj', () => {
    const destObj = {
        a: 'a'
    };
    
    merge(destObj)
    expect(destObj.a).toBe('a');
});