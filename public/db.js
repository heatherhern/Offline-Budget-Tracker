let request = window.indexedDB.open("budgetdb", 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};


// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB




request.onerror = function(event) {
    console.log("error " + event.target.errorCode);
};