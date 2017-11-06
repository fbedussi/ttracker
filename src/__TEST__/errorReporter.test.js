import {onErrorReport, watchForError} from '../backend/errorReporter';

jest.mock('../db/dbFacade');

test('Error reporter', () => {
    var errorReported = false;
    var errorText = '';

    onErrorReport((error) => {
        errorReported = true;
        errorText = error.message;
    })

    watchForError(() => new Promise((resolve, reject) => reject(new Error('fake error'))))().then(() => {
        expect(errorReported).toBe(true);
        expect(errorMessage).toBe('fake error');
    });

});

