import {convertMsToH} from '../helpers/helpers';

test('convertMsToH', () => {
    expect(convertMsToH(1000 * 60 * 60)).toBe(1);
});