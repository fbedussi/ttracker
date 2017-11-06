import {onErrorReport, watchForError} from '../backend/errorReporter';

jest.mock('../db/dbFacade');

test('Error reporter', () => {
    var errorReported = false;
    var errorDetails;
    var error = new Error('fake error')
    onErrorReport((error) => {
        errorReported = true;
        errorDetails = error;
    })

    watchForError(() => new Promise((resolve, reject) => reject(error)))().then(() => {
        expect(errorReported).toBe(true);
        expect(errorDetails).toBe(error);
    });

});

