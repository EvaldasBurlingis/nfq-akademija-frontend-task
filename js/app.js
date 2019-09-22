// waiting = true , being_served = false -> client is waiting in line -> Laukia (geltona)
//waiting = false, beng_served = false -> client is currently being served and not waiting in line -> Aptarnaujamas (melyna)
//waiting = false, being_served = true -> client was served and is removed from waiting line -> Aptarnautas (zalia)


const loadDemoContentBtn = document.querySelector("#loadDemoContentBtn")
const saveLocalStorageBtn = document.querySelector("#saveLocalStorageBtn");
const registerFormBtn = document.querySelector("#formBtn");
const clientsInLine = document.querySelector("#totalWaitingList");
const clientsServed = document.querySelector("#totalCustomersServed");
const servedBtn = document.getElementsByClassName("servedBtn");

const URL = window.location.pathname;
// VARIABLES
let demoData = [];
let data;

const clearLocalStorage = () => { localStorage.clear(); }
const updateClientList = (arr) => { localStorage.setItem("client_list", JSON.stringify(arr)) };
const clearClientsInLine = () => { return clientsInLine.textContent = "0" };
const numOfClientsInLine = (data) => {
    const waiting = data.filter(client => client.waiting === true && client.being_served === false);
    clientsInLine.textContent = waiting.length
}

const numOfCLientsServed = (data) => {
    const total = data.filter(client => client.being_served);
    clientsServed.textContent = total.length;
}

// management page react to changes
if(URL === "/management.html"){
    data = getDataFromStorage();
    document.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains("servedBtn")) {
           let id =  e.target.parentElement.parentElement.getAttribute("data-key");
           id = parseInt(id);
           data.map(client => {
               if(client.client_id === id){
                // aptarnaujamas
                // laukia
                // aptarnautas
                if(!client.waiting && !client.being_served) {
                    client.being_served = true;
                } else if(client.waiting && !client.being_served){
                    client.waiting = false;
                } else if (!client.waiting && client.being_served) {
                    client.waiting = false;
                }
               }
           })
            clearSpecialistList();
            updateClientList(data);
            createSpecialistTable(data);
            numOfClientsInLine(data);
            numOfCLientsServed(data);
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
            const waiting = data.filter(client => client.waiting && client.being_served)
            //filter people who are waiting
            clearSpecialistList();
            createSpecialistTable(data);
            numOfCLientsServed(data);
        }
    } else {
        if (URL === "/queue.html") {
            clearWaitingList();
        }

        if(URL === "/management.html"){
            clearSpecialistList();
            clearClientsInLine()

            
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
        const waiting = data.filter(client => client.waiting === true);
        clientsInLine.textContent = waiting.length;
        createSpecialistTable(data);
        numOfCLientsServed(data);
    }
}



// /management.html page
function createSpecTable(specialist, clients) {
    let table = document.querySelector(`${specialist === 1 ? "#spec1Table" : "#spec2Table"}`);



    clients.forEach(client => {
        const { 
            client_id: id,
            client_name: name,
            visit_reason: reason,
            waiting: isWaiting,
            being_served: hasBeingServed
        } = client;

        let status;
        let btnStatus;
        let btnColor;
        let tr = document.createElement("tr");

        if(isWaiting === true && hasBeingServed === false) {
            status = "Laukia";
            btnStatus = "Kviesti";
            btnColor = "bg-yellow-600";
        } else if(isWaiting === false && hasBeingServed === false ) {
            status = "Aptarnaujamas";
            btnStatus = "Aptarnautas";
            btnColor = "bg-blue-600";
        } else if(isWaiting === false && hasBeingServed === true ) {
            status = "Aptarnautas";
            btnStatus = "Baigta";
            btnColor = "bg-gray-600";
        }

        tr.classList.add("border-b-2", "text-center", "text-xs", "font-normal", "list-item", "hover:bg-gray-800", "hover:text-white", "cursor-default");
        tr.setAttribute("data-key", id);
        tr.innerHTML = `
            <th class="py-2 uppercase text-xs md:text-md text-normal border-gray-500 border-r">
                ${id}</th>
            <th class="py-2 uppercase text-xs md:text-md text-normal border-gray-500 border-r">
                ${name}</th>
            <th class="py-2 uppercase text-xs md:text-md text-normal border-gray-500 border-r">
                ${reason}</th>
            <th class="py-2 uppercase text-xs md:text-md text-normal border-gray-500 border-r">
                ${status}
            </th>
            <th class="border-gray-500 border-r">
                <button class="w-full py-2  h-full text-white servedBtn ${btnColor}">
                    ${btnStatus}
                </button>
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



// Register new client
if (URL === "/") {

    const form = document.querySelector("#registerForm");
    const inputName = document.querySelector("#clientName");
    const inputSpecialist = document.querySelector("#selectSpecialist");
    const inputReason = document.querySelector("#visitReason");

    const removeError = () => { inputName.nextSibling.remove() };

    
    registerFormBtn.addEventListener("click", (e) => {
        // name validation
        if (inputName.value === "" || inputName.value.replace(/\s+/g, '') === ""){
            showValidationError("Šis laukelis negali būti tuščias");
            setTimeout(removeError, 2000)
        } else if(!isNaN(inputName.value)) {
            showValidationError("Klaidinga informacija. Bandykite iš naujo");
            setTimeout(removeError, 2000)
        } else {
            let newClient = {
                "client_id": generateWaitingId(),
                "client_name": inputName.value,
                "specialist_id": parseInt(inputSpecialist.value),
                "visit_reason": inputReason.value,
                "waiting": true,
                "being_served": false
            }
            form.style.display = "none";

            if (localStorage.length !== 0) {
                data = getDataFromStorage();
                data.push(newClient);
                updateClientList(data);
            } else {
                let tempArr = [];
                tempArr.push(newClient);
                localStorage.setItem("client_list", JSON.stringify(tempArr));
            }

            // after registration show waiting number
            showWaitingListNum(newClient.client_id);
        }
        e.preventDefault();
    })
}

function showValidationError(msg){
    const input = document.querySelector("#clientName");
    const p = document.createElement("p");

    p.classList.add("text-red-500", "text-xs", "italics", "mt-2");
    p.setAttribute("id", "validationError");
    p.textContent = msg;
    input.parentNode.insertBefore(p, input.nextSibling);  
}

function showWaitingListNum(queueNum) {
    const div = document.querySelector("#show-queue-number");
    const h2 = document.createElement("h2");
    const span = document.createElement("span");
    const button = document.createElement("a");

    div.classList.remove("hidden");

    h2.classList.add("text-2xl", "font-semibold", "uppercase", "mt-4");
    span.classList.add("w-full", "flex", "flex--center", "h-64", "text-12xl", "fade-in");
    button.classList.add("btn", "bg-purple-700", "hover:bg-purple-900");
    button.setAttribute("href", "/queue.html");

    h2.textContent = "Jūsų eilės nr:";
    button.textContent = "Laukimo sąrašas";
    span.textContent = queueNum;

    div.appendChild(h2)
    div.appendChild(span);  
    div.appendChild(button);
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
            if(!client.waiting && !client.being_served){
                clientBeingServed.textContent = client.client_id;
            } else if(client.waiting) {
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