// waiting = true , being_served = false -> client is waiting in line
//waiting = false, beng_served = false -> client is currently being served and not waiting in line
//waiting = false, being_served = true -> client was served and is removed from waiting line



//  DOM ELEMENTS
const loadDemoContentBtn = document.querySelector("#loadDemoContentBtn")
const saveLocalStorageBtn = document.querySelector("#saveLocalStorageBtn");
const registerFormBtn = document.querySelector("#formBtn");
const clientsInLine = document.querySelector("#totalWaitingList");
const servedBtn = document.getElementsByClassName("servedBtn");

// VARIABLES
const URL = window.location.pathname;
let demoData = [];
let data;



if(URL === "/management.html"){
    document.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains("servedBtn")) {
           let =  e.target.parentElement.parentElement.getAttribute("data-key");
            e.target.parentElement.parentElement.style.background = "red";
        }
    });
}

// Fetch data from JSON
(function fetchData() {
    fetch("../data/demo.json")
        .then(handleFetchErrors)
        .then(res => res.json())
        .then(data => demoData = data)
        .catch(err => console.log(err))
})();


// watch for changes in localStorage
window.addEventListener("storage", () => {
    if (localStorage.length !== 0) {
        data = getDataFromStorage();

        if(URL === "/queue.html") {
            clearWaitingList();
            loadWaitingPage(data);
        } 
        
        if (URL === "/management.html") {
            //filter people who are waiting
            const waiting = data.filter(client => client.waiting === true)
            clientsInLine.textContent = waiting.length;
            clearSpecialistList();
            createSpecialistTable(data);
        }
    } else {
        if (URL === "/queue.html") {
            clearWaitingList();
        }

        if(URL === "/management.html"){
            clearSpecialistList();
            clientsInLine.textContent = "0";
        }
    }
})

// check data in localStorage if app was re-entered after web browser was closed
if (localStorage.length !== 0) {
    data = getDataFromStorage();
    loadWaitingPage(data);

    if (URL === "/queue.html") {
        loadDemoContentBtn.style.display = "none";
    }

    if (URL === "/management.html") {
        const waiting = data.filter(client => client.waiting === true)
        clientsInLine.textContent = waiting.length;
        createSpecialistTable(data);
    }
}



// /management.html page
function createSpecTable(specialist, clients) {
    let table = document.querySelector(`${specialist === 1 ? "#spec1Table" : "#spec2Table"}`);



    clients.forEach(client => {
        let tr = document.createElement("tr");
        tr.classList.add("border-b-2", "text-center", "text-xs", "font-normal", "list-item", "hover:bg-gray-800", "hover:text-white", "cursor-default");
        tr.setAttribute("data-key", client.client_id);
        tr.innerHTML = `
                            <th class="font-sans uppercase border-gray-500 border-r">
                                ${client.client_id}</th>
                            <th class="font-sans uppercase border-gray-500 border-r">
                                ${client.client_name}</th>
                            <th class="font-sans uppercase border-gray-500 border-r">
                                ${client.visit_reason}</th>
                            <th class="font-sans uppercase border-gray-500 border-r">
                                ${client.waiting ? "Laukia" : "Aptarnaujamas"}</th>
                            <th class="border-gray-500 border-r ">
                                <button class="bg-green-600 w-full h-full text-white servedBtn">${client.being_served ? "Kvieciamas" : "Aptarnautas" }</button>
                            </th>
        `
        table.appendChild(tr);
    })
}


//create table that filters clients by specialists
function createSpecialistTable(clients) {
    const specialist1Clients = clients.filter(client => client.specialist_id === 1);
    const specialist2Clients = clients.filter(client => client.specialist_id === 2);

    createSpecTable(1, specialist1Clients);
    createSpecTable(2, specialist2Clients);
}

// save demo data to local storage on button click
// button located in /administrator.html
if(saveLocalStorageBtn){
    saveLocalStorageBtn.addEventListener("click", (e) => {
        localStorage.setItem("client_list", JSON.stringify(demoData));
        data = getDataFromStorage();

        loadWaitingPage(data);
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
        const inputSpecialist = document.querySelector("#selectSpecialist");
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
            data = getDataFromStorage();
            data.push(newClient);
            updateClientList(data);
        } else {
            let tempArr = [];
            tempArr.push(newClient);
            localStorage.setItem("client_list", JSON.stringify(tempArr));
        }

        // show id number on screen
        showIdNumber(newClient.client_id);

        e.preventDefault();
    })
}

function showIdNumber(clientId) {
    // const main = document.querySelector("#register");
    const div = document.querySelector("#show-queue-number");
    let h1 = document.createElement("h1");
    let p = document.createElement("p");

    // add styling classses to elements
    div.classList.remove("hidden");
    div.classList.add("h-64", "w-full", "flex", "flex-col", "justify-center", "items-center", "mb-4");

    p.classList.add("text-xl", "text-gray-700", "uppercase", "underline", "leading-loose", "font-semibold", "w-full", "text-left");
    p.textContent = "Jūsų eilės nr:";

    h1.classList.add("text-15xl", "p-2", "bg-green-500", "text-white", "font-bold", "font-sans", "block", "w-full", "text-center")
    h1.textContent = clientId;

    div.appendChild(p);
    div.appendChild(h1);

    
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

function loadWaitingPage(data) {
    data.map(client => {
        const clientBeingServed = document.querySelector(client.specialist_id === 1 ? "#spec1" : "#spec2");
        const waitingList = document.querySelector(client.specialist_id === 1 ? "#specialist1_queue" : "#specialist2_queue");
        let li = document.createElement("li");

        li.classList.add("w-full", "bg-gray-600", "my-2", "py-4", "text-2xl", "text-center", "text-white", "font-bold", "font-sans");

        if (URL === "/queue.html") {
            if(!client.waiting){
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
    if(URL === "/queue.html"){
        const s1 = document.querySelector("#spec1");
        const s2 = document.querySelector("#spec2");
        const li = document.querySelectorAll("li");

        s1.textContent = "";
        s2.textContent = "";
        if(li.length !== 0){
            li.forEach(listItem => listItem.remove());
        }
    }
}

function clearSpecialistList() {
    const spec1Table = document.querySelector("#spec1Table");
    const spec2Table = document.querySelector("#spec2Table");

    spec1Table.innerHTML = "";
    spec2Table.innerHTML = "";

}


function clearLocalStorage() {
    return localStorage.clear();
}


function updateClientList(arr) {
    return localStorage.setItem("client_list", JSON.stringify(arr))
}


// generate id that will be used to manage queue
function generateWaitingId(){
    // check local storage if queue already exist
    // true: generate id that would be next number after last item
    // false: start from 1
    if(localStorage.length !== 0){
        data = getDataFromStorage();
        return data[data.length - 1].client_id + 1;
    } else {
        return 1;
    }

}

function getDataFromStorage() {
    let data;
    data = localStorage.getItem("client_list");
    data = JSON.parse(data);

    return data;
}


function handleFetchErrors(res) {
    if(!res.ok) {
        throw Error("Duomenys nerasti")
    }

    return res;
}