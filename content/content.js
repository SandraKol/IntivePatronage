// prevent from entering unlogged user
const preventUnloggedUser = () => {
    if (sessionStorage.getItem('user') == null) {
        window.location.href = "../login/login.html";
    }
}
preventUnloggedUser();
console.log(sessionStorage.length);

// get name of the logged user
if (sessionStorage.getItem('user') != null) {
    const loggedNameJson = sessionStorage.getItem('user');
    const loggedUser = JSON.parse(loggedNameJson);
    console.log(loggedUser);
    const loggedUsername = loggedUser.login;
    console.log(loggedUsername);

    const p = document.getElementById('LoggedUsername');
    p.textContent = `Witaj, ${loggedUsername}`;
}

// get icons (transaction types)
const iconMap = new Map([
    [1, '<i class="fa-sharp fa-solid fa-hand-holding-dollar"></i>'],
    [2, '<i class="fa-sharp fa-solid fa-basket-shopping"></i>'],
    [3, '<i class="fa-sharp fa-solid fa-file-invoice-dollar"></i>'],
    [4, '<i class="fa-solid fa-gift"></i>'],

]);
// Fill table
async function fillTable(apiURL, table) {
    const tableHead = table.querySelector('thead');
    const tableBody = table.querySelector('tbody');
    const response = await fetch(apiURL);
    let data = await response.json();
    console.log(data.transactions[1].type);

    // clear the table
    tableHead.innerHTML = "<tr></tr>";
    tableBody.innerHTML = "";

    // setting the headers:
    let headers = ['Data', 'Typ transakcji', 'Kwota', 'Saldo', 'Opis'];
    console.log(headers);
    for (const headerText of headers) {
        const headerElement = document.createElement('th');
        headerElement.textContent = headerText;
        tableHead.querySelector('tr').appendChild(headerElement);
    }

    // populate table with content
    for (let i = 0; i < data.transactions.length; i++) {
        const obj = Object.entries(data.transactions[i]);
        const row = document.createElement('tr');
        for (const [key, value] of obj) {
            console.log(key, value);
            const cell = document.createElement('td');
            if (key === 'type') {
                cell.innerHTML = iconMap.get(value);
            } else {
                cell.textContent = value;
            }
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }

    const icon2 = document.getElementById("transaction-2");

}

fillTable("https://api.npoint.io/38edf0c5f3eb9ac768bd", document.querySelector('table'));


// Create charts
let balanceLabel = [];
let dateData = [];
let transactionData = [];
let transactionTypeNames = [];


async function transactionChart() {
    await getApiData()

    const ctx = document.getElementById('doughnutChart');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: transactionTypeNames,
            datasets: [{
                label: 'Ilość transakcji',
                data: eachTypeCount,
                borderWidth: 1,
                backgroundColor: ["#9FFB88", "#FA8072", "#FDE456", "#660066"],
                color: 'black',
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'black'
                    }
                }
            }
        }
    })
};

transactionChart();

async function balanceChart() {
    await getApiData()

    const ctx = document.getElementById('barChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dateData,
            datasets: [{
                label: 'Balans',
                data: balanceLabel,
                borderWidth: 1,
                backgroundColor: ["#CDEBA7", "#FFFFD2", "#E61C66", "#FF7F50", "#DC143C", "#C6CECE", "#4B0082"],
                color: 'black',
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    ticks: { color: 'black', beginAtZero: true }
                },
                x: {
                    ticks: { color: 'black', beginAtZero: false }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'black'
                    }
                }
            }
        }
    })
};

balanceChart();

async function getApiData() {
    const apiURL = "https://api.npoint.io/38edf0c5f3eb9ac768bd";
    const response = await fetch(apiURL);
    const ChartData = await response.json();

    const balance = ChartData.transactions.map((item) => item.balance);
    const date = ChartData.transactions.map((item) => item.date);
    const transactions = ChartData.transactions.map((item) => item.type);

    balanceLabel = balance;
    dateData = date;
    transactionData = transactions;

    const countTypes = {};
    transactionData.forEach((type) => { countTypes[type] = (countTypes[type] || 0) + 1; });

    console.log(countTypes);

    eachTypeCount = Object.values(countTypes);


    const transactionNames = Object.values(ChartData.transacationTypes);
    transactionTypeNames = transactionNames;

}

// logout button

const logout = () => {
    sessionStorage.clear()
    window.location.href = "../login/login.html";
}
