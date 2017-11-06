import {onErrorReport, watchForErrorReport} from '../backend/bill';

test('Error reporter', () => {
    var errorReported = false;
    var errorText = '';

    onErrorReport((error) => {
        errorReported = true;
        errorText = error.message;
    })

    const fakeDBCall = watchForErrorReport(() => Promise.reject(new Error('fake error')));

    fakeDbCall();

    expect(errorReported).toBe(true);
    expect(errorMessage).toBe('fake error');
});

