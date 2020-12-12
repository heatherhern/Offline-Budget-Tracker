let request = window.indexedDB.open("budgetdb", 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};


// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
};


request.onerror = function (event) {
    console.log("error " + event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");

    const store = transaction.objectStore("pending");

    store.add(record);
}

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(() => {
                    const transaction = db.transaction(["pending"], "readwrite");

                    const store = transaction.objectStore("pending");

                    store.clear();
                });
        }
    };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);
