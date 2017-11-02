if (!('indexedDB' in window)) {
    //throw new Error('This browser doesn\'t support IndexedDB');
}

var db;

const openDb = (dbName, user) => new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);
    var newDb = false;

    request.onerror = (event) => reject(`Error opening DB ${dbName}: : ${request.error}`);

    request.onupgradeneeded = (event) => {
        const db = event.target.result;

        db.createObjectStore('activity', { keyPath: "id" });
        db.createObjectStore('client', { keyPath: "id" });
        db.createObjectStore('bill', { keyPath: "id" });
        db.createObjectStore('option', { keyPath: "id" });
        newDb = true;
    };
    
    request.onsuccess = (event) => {
        db = event.target.result;
        if (newDb) {
            createInStore('option', {id: 1});
        }
        resolve(dbInterface)
    };
});

const createInStore = (storeName, content) => new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const request = transaction
        .objectStore(storeName)
        .add(content)
        ;

    transaction.oncomplete = (event) => resolve(transaction.error);

    transaction.onerror = () => reject(`Error writing ID ${content.id} to ${storeName}: ${transaction.error}`); // error handling????

    request.onerror = (event) => reject(`Error writing ID ${content.id} to ${storeName}: ${request.error}`); // error handling????

    request.onsuccess = (event) => resolve(request.result); //key
});

const readInStore = (storeName, contentId) => new Promise((resolve, reject) => {
    const request = db
        .transaction([storeName])
        .objectStore(storeName)
        .get(contentId)
        ;

    request.onerror = (event) => reject(`Error reading ID ${contentId} from ${storeName}: ${request.error}`);

    request.onsuccess = (event) => resolve(request.result);
});

const readAllInStore = (storeName) => new Promise((resolve, reject) => {
    const request = db
        .transaction([storeName])
        .objectStore(storeName)
        .getAll()
        ;

    request.onerror = (event) => reject(`Error reading from ${storeName}: ${request.error}`);

    request.onsuccess = (event) => resolve(request.result);
});

const updateInStore = (storeName, content) => new Promise((resolve, reject) => {
    const objectStore = db
        .transaction([storeName], "readwrite")
        .objectStore(storeName)
        ;
    const request = objectStore.get(content.id);

    request.onerror = (event) => reject(`Error updating ID ${content.id} from ${storeName}: ${request.error}`);

    request.onsuccess = (event) => {
        // Get the old value that we want to update
        const oldContent = event.target.result;

        // update the value(s) in the object that you want to change
        const newContent = Object.assign({}, oldContent, content);

        // Put this updated object back into the database.
        const request = objectStore.put(newContent);

        request.onerror = (event) => reject(`Error updating ID ${content.id} from ${storeName}: ${request.error}`);

        request.onsuccess = (event) => resolve(request.result);
    };
});

const deleteInStore = (storeName, contentId) => new Promise((resolve, reject) => {
    const request = db
        .transaction([storeName], "readwrite")
        .objectStore(storeName)
        .delete(contentId)
        ;

    request.onsuccess = (event) => resolve(request.result === undefined);

    request.onerror = (event) => reject(`Error deleting ID ${contentId} in ${storeName}: ${request.error}`);
});

const replaceAllInStore = (storeName, data) => new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const clearRequest = transaction
        .objectStore(storeName)
        .clear()
    ;
    
    transaction.onerror = () => reject(`Error opening ${storeName}: ${transaction.error}`); // error handling????

    clearRequest.onerror = (event) => reject(`Error clearing ${storeName}: ${clearRequest.error}`); // error handling????

    clearRequest.onsuccess = (event) => {
        const writeDataPromises = data.map((record) => new Promise((resolve, reject) => {
            const addRequest = transaction
                .objectStore(storeName)
                .add(record)
            ;
    
            addRequest.onerror = (event) => reject(`Error writing ID ${record.id} to ${storeName}: ${addRequest.error}`); // error handling????
    
            addRequest.onsuccess = (event) => resolve(addRequest.result); //key
        }));

        Promise.all(writeDataPromises)
            .then((data) => resolve(data))
            .catch((e) => reject(e))
        ;
    }
});

const dbInterface = {
    openDb,

    create: createInStore,
    read: readInStore,
    readAll: readAllInStore,
    update: updateInStore,
    delete: deleteInStore,
    replaceAll: replaceAllInStore,
};

export default dbInterface;