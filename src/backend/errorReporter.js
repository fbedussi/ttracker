const subscribers = [];

export const onErrorReport = (cb) => subscribers.push(cb);
export const notifyError = (error) => subscribers.forEach((subscriber) => subscriber(error));
export const watchForError = (pendingPromise) => (...args) => pendingPromise(...args).catch(notifyError);
