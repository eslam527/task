

let customerName = document.getElementById('customer');
let idInput = document.getElementById('idInput');
let amountInput = document.getElementById('amountInput');
let customersData = [];
let transactionsData = [];

// جلب بيانات العملاء
async function getCustomersData() {
    let response = await fetch('http://localhost:3000/customers');
    let customers = await response.json();
    customersData = customers;
    displayCustomer(customers);
    console.log(customers);
    return customers;
}

async function getTransationsData() {
    let response = await fetch('http://localhost:3000/transactions');
    let transactions = await response.json();
    transactionsData = transactions;
    console.log(transactions);
    displayTrans(transactions);
    // drawChart(transactions);
    return transactions;
}

function displayCustomer(customers) {
    let body = '';
    for (let i = 0; i < 1; i++) {
        body += `
            
              <td class =""  data-id="${customers[i].id}">${customers[i].name}</td>
            
        `;
    }
    document.getElementById("v").innerHTML = body;
}

function displayTrans(transactions) {
    let body = '';
    for (let i = 0; i < 1; i++) {
        body += `
                      <td class ="">${transactions[i].amount}</td>

        `;
    }
    document.getElementById('c').innerHTML = body;
}

function drawChart(transactions) {
    let data = anychart.data.set([]);

    let transactionData = {};
    transactions.forEach(transaction => {
        if (!transactionData[transaction.customer_id]) {
            transactionData[transaction.customer_id] = {};
        }
        if (!transactionData[transaction.customer_id][transaction.date]) {
            transactionData[transaction.customer_id][transaction.date] = 0;
        }
        transactionData[transaction.customer_id][transaction.date] += transaction.amount;
    });

    let chartData = [];
    for (let customer_id in transactionData) {
        let row = [customer_id];
        for (let date in transactionData[customer_id]) {
            row.push(transactionData[customer_id][date]);
        }
        chartData.push(row);
    }

    data.data(chartData);

    let chart = anychart.column();

    let seriesData = data.mapAs({ x: 0, value: 1 });
    let series = chart.column(seriesData);
    series.name("transactions");

    chart.xAxis().title("customers");
    chart.yAxis().title("transactions");

    chart.container("container");

    chart.draw();
}

getCustomersData();
getTransationsData();

const idInbut = document.getElementById('name')
const amontInput = document.getElementById('amont')
amontInput.addEventListener('input', function(e) {
    let amount = e.target.value;
    console.log(amount);

    function filterTransactionsByAmount(transactions, amount) {
        return transactions.filter(transaction => transaction.amount == amount);
    }

    let filteredTransactions = filterTransactionsByAmount(transactionsData, amount);
    console.log(filteredTransactions);
    displayTrans(filteredTransactions);
    drawChart(filteredTransactions);
    
});

idInbut.addEventListener('input', function(e) {
    let id = e.target.value;
    console.log(id);

    function filterTransactionsByCustomerId(transactions, id) {
        return transactions.filter(transaction => transaction.customer_id == id);
    }

    let filteredTransactions = filterTransactionsByCustomerId(transactionsData, id);
    console.log(filteredTransactions);

    let customer = customersData.find(customer => customer.id == id);
    if (customer) {
        document.getElementById("v").innerHTML = ` ${customer.name}`;
        displayTrans(filteredTransactions);
        drawChart(filteredTransactions);
    
        return true
    } else {
        document.getElementById("v").innerHTML = 'not fouend';
        return false
    }

});
// function clear(){
//     idInbut.value='';
//     amontInput.value='';
// }

$(function(){
    $('.loader').fadeOut(2000,function(){
        $('.body').fadeOut(2000,function(){
            $('body').css(  {overflow: 'auto'})
        })
    })
})
