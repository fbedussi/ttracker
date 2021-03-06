import merge from '../helpers/merge';

test('merge', () => {
    const destObj = {
        a: 'a'
    };
    const sourceObj = {
        a: 'b',
        b: 'b'
    }
    const result = merge(destObj, sourceObj)
    expect(result.a).toBe('b');
    expect(result.b).toBe(undefined);
});

test('merge with no sourceObj', () => {
    const destObj = {
        a: 'a'
    };
    
    merge(destObj)
    expect(destObj.a).toBe('a');
});

test('merge with nested objects', () => {
    const destObj = {
        a: 'a',
        b: {
            b1: 'b1'
        }
    }
    const sourceObj = {
        b: {
            b1: 'b2',
            b2: 'b2'
        }
    }

    merge(destObj, sourceObj);
    expect(destObj).toEqual({
        a: 'a',
        b: {
            b1: 'b2'
        }
    });
});