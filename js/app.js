//////////////////////////////////
// DOM ELEMENTS
////////////////////////////////

// buttons
const loadDemoContentBtn = document.querySelector("#loadDemoContentBtn")
const saveLocalStorageBtn = document.querySelector("#saveLocalStorageBtn");
const registerFormBtn = document.querySelector("#formBtn");

// variables
let demoData = [];



//////////////////////////////////
// FUNCTIONS
////////////////////////////////
// fetch data from json file
(function fetchData() {
    fetch("../data/demo.json")
        .then(handleFetchErrors)
        .then(res => res.json())
        .then(data => demoData = data)
        .catch(err => console.log(err))
})();

// look for local storage changes to update pages if they are open on different tabs
window.addEventListener("storage", () => {
    console.log("Local storage was updated on another page");
    if (localStorage.length !== 0) {
        // if queue page is open update its contents
        if (window.location.pathname === "/queue.html") {
            let list = localStorage.getItem("list");
            list = JSON.parse(list);
            clearWaitingList();
            loadData(list);
        }
    } else {
        if (window.location.pathname === "/queue.html") {
            // if local storage is empty
            // reset clients that are being served
            //reset queue list
            const s1 = document.getElementById("spec1");
            const s2= document.getElementById("spec2");
            s1.textContent = "";
            s2.textContent = "";
            clearWaitingList();
        }
    }
})

// check for list in local storage
if(localStorage.length !== 0){
    let list = localStorage.getItem("list");
    list = JSON.parse(list);
    loadData(list);

    if (window.location.pathname === "/queue.html") {
        loadDemoContentBtn.disabled = true;
    }
}


// save demo data to local storage on button click
// button located in /administrator.html
if(saveLocalStorageBtn){
    saveLocalStorageBtn.addEventListener("click", (e) => {
        localStorage.setItem("list", JSON.stringify(demoData));
        let list = localStorage.getItem("list");
        list = JSON.parse(list);

        loadData(list);
        e.preventDefault();
    })
}

// add new client to queue
// save it to local storage to be able to display it in queue page
if (registerFormBtn) {
    registerFormBtn.addEventListener("click", (e) => {
        // dom elements
        const form = document.querySelector("#registerForm");
        const inputName = document.querySelector("#clientName");
        const inputSpecialist = document.querySelector("#specialistId");
        const inputReason = document.querySelector("#visitReason");

        form.style.display = "none";
        

        let newClient = {
            "client_id": generateWaitingId(),
            "client_name": inputName.value,
            "specialist_id": parseInt(inputSpecialist.value),
            "visit_reason": inputReason.value,
            "waiting": true,
            "being_served": false
        }

        // check if list already exist in local storage
        // true: update list with new item
        // false: save new list to local storage
        if(localStorage.length !== 0){
            let localData = localStorage.getItem("list");
            localData = JSON.parse(localData);
            localData.push(newClient);
            updateWaitingList(localData);
        } else {
            let tempArr = [];
            tempArr.push(newClient);
            localStorage.setItem("list", JSON.stringify(tempArr));
        }

        // show id number on screen
        showIdNumber(newClient.client_id);

        e.preventDefault();
    })
}

function showIdNumber(clientId) {
    const main = document.querySelector("#register");
    let h1 = document.createElement("h1");
    let p = document.createElement("p");

    p.textContent = "Jusu eiles nr:";
    h1.textContent = clientId;

    main.appendChild(p);
    main.appendChild(h1);
}

// load demo data on click
// /queue.html
if(loadDemoContentBtn){
    loadDemoContentBtn.addEventListener("click", (e) => {
        //check if data was fetched without errors
        if (demoData.length === 0) {
            alert("Duomenys nerasti");
        }

        loadData(demoData);
        loadDemoContentBtn.disabled = true;
        e.preventDefault();
    })
}

function loadData(data) {
    data.map(client => {
        const clientBeingServed = document.querySelector(client.specialist_id === 1 ? "#spec1" : "#spec2");
        const waitingList = document.querySelector(client.specialist_id === 1 ? "#specialist1_queue" : "#specialist2_queue");
        let li = document.createElement("li");

        if (window.location.pathname === "/queue.html") {
            if(client.being_served){
                clientBeingServed.textContent = client.client_id;
            } else {
                // if client is waiting add him to waiting queue
                li.textContent = client.client_id;
                waitingList.appendChild(li);
            }
        }
     })
}

function clearWaitingList(){
    const li = document.querySelectorAll("li");
    if(li.length !== 0){
        li.forEach(listItem => listItem.remove());
    }
}


function clearLocalStorage() {
    return localStorage.clear();
}


function updateWaitingList(arr) {
    return localStorage.setItem("list", JSON.stringify(arr))
}


// generate id that will be used to manage queue
function generateWaitingId(){
    // check local storage if queue already exist
    // true: generate id that would be next number after last item
    // false: start from 1
    if(localStorage.length !== 0){
        let localData = localStorage.getItem("list");
        localData = JSON.parse(localData);
        return localData[localData.length - 1].client_id + 1;
    } else {
        return 1;
    }

}


function handleFetchErrors(res) {
    if(!res.ok) {
        throw Error("Duomenys nerasti")
    }

    return res;
}