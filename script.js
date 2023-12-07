document.addEventListener('DOMContentLoaded', function () {
    const datepicker = document.getElementById('datepicker');
    const selectedDateLabel = document.getElementById('selectedDateLabel');
    const saveButton = document.getElementById('saveButton');

    datepicker.addEventListener('input', function () {
        const selectedDate = new Date(datepicker.value);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = selectedDate.toLocaleDateString('el-GR', options);

        selectedDateLabel.textContent = `Ημερομηνία: ${formattedDate}`;
        updateTotals();
        loadSavedDataForDate(selectedDate);
    });

    saveButton.addEventListener('click', function () {
        saveDataToLocalStorage();
    });

    loadDataFromLocalStorage();
});

function saveDataToLocalStorage() {
    const selectedDate = document.getElementById('datepicker').value;
    const cashIncome = parseFloat(document.getElementById('cashIncome').value) || 0;
    const cardIncome = parseFloat(document.getElementById('cardIncome').value) || 0;
    const cashExpense = parseFloat(document.getElementById('cashExpense').value) || 0;
    const cardExpense = parseFloat(document.getElementById('cardExpense').value) || 0;

    // Έλεγχος αν υπάρχουν ήδη δεδομένα για τη συγκεκριμένη ημερομηνία
    const existingData = localStorage.getItem(selectedDate);
    if (existingData) {
        if (window.confirm('Υπάρχουν ήδη δεδομένα για αυτήν την ημερομηνία. Θέλετε να τα αντικαταστήσετε;')) {
            localStorage.removeItem(selectedDate);
        } else {
            return; // Αν ο χρήστης δεν επιθυμεί την αντικατάσταση, τερματίζουμε την συνάρτηση
        }
    }

    const dataToSave = {
        date: selectedDate,
        income: {
            cash: cashIncome,
            card: cardIncome
        },
        expense: {
            cash: cashExpense,
            card: cardExpense
        }
    };

    localStorage.setItem(selectedDate, JSON.stringify(dataToSave));
    localStorage.setItem('lastSelectedDate', selectedDate);
    alert('Τα δεδομένα αποθηκεύτηκαν επιτυχώς!');
    // Καλούμε τη συνάρτηση για να ανανεώσουμε τον πίνακα αποθηκευμένων δεδομένων
    loadSavedDataForDate(new Date(selectedDate));
}

function loadSavedDataForDate(selectedDate) {
    const savedDataTable = document.getElementById('savedDataTable').getElementsByTagName('tbody')[0];
    savedDataTable.innerHTML = ''; // Καθαρίζουμε τον πίνακα πριν προσθέσουμε νέα δεδομένα

    const savedData = localStorage.getItem(selectedDate.toISOString().split('T')[0]);
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        displaySavedData(parsedData);
    }
}

// Υπόλοιπος κώδικας παραμένει ίδιος


function displaySavedData(data) {
    const savedDataTable = document.getElementById('savedDataTable').getElementsByTagName('tbody')[0];
    const row = savedDataTable.insertRow();
    const dateCell = row.insertCell(0);
    const cashIncomeCell = row.insertCell(1);
    const cardIncomeCell = row.insertCell(2);
    const totalIncomeCell = row.insertCell(3);
    const cashExpenseCell = row.insertCell(4);
    const cardExpenseCell = row.insertCell(5);
    const totalExpenseCell = row.insertCell(6);
    const totalCashCell = row.insertCell(7);
    const totalCardCell = row.insertCell(8);

    dateCell.textContent = data.date;
    cashIncomeCell.textContent = formatCurrency(data.income.cash);
    cardIncomeCell.textContent = formatCurrency(data.income.card);
    totalIncomeCell.textContent = formatCurrency(data.income.cash + data.income.card);
    cashExpenseCell.textContent = formatCurrency(data.expense.cash);
    cardExpenseCell.textContent = formatCurrency(data.expense.card);
    totalExpenseCell.textContent = formatCurrency(data.expense.cash + data.expense.card);
    totalCashCell.textContent = formatCurrency(data.income.cash - data.expense.cash);
    totalCardCell.textContent = formatCurrency(data.income.card - data.expense.card);
}

// Οι υπόλοιπες συναρτήσεις παραμένουν ίδιες

function calculateTotalIncome() {
    const cashIncome = parseFloat(document.getElementById('cashIncome').value) || 0;
    const cardIncome = parseFloat(document.getElementById('cardIncome').value) || 0;
    const totalIncome = cashIncome + cardIncome;

    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    updateTotals();
}

function calculateTotalExpense() {
    const cashExpense = parseFloat(document.getElementById('cashExpense').value) || 0;
    const cardExpense = parseFloat(document.getElementById('cardExpense').value) || 0;
    const totalExpense = cashExpense + cardExpense;

    document.getElementById('totalExpense').textContent = formatCurrency(totalExpense);
    updateTotals();
}

function updateTotals() {
    const totalCash = parseFloat(document.getElementById('cashIncome').value) - parseFloat(document.getElementById('cashExpense').value) || 0;
    const totalCard = parseFloat(document.getElementById('cardIncome').value) - parseFloat(document.getElementById('cardExpense').value) || 0;

    document.getElementById('totalCash').textContent = formatCurrency(totalCash);
    document.getElementById('totalCard').textContent = formatCurrency(totalCard);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(amount);
}
function generateDailyReport() {
    const reportDate = document.getElementById('reportDate').value;
    const parsedDate = new Date(reportDate);
    const formattedDate = parsedDate.toLocaleDateString('el-GR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const savedData = localStorage.getItem(parsedDate.toISOString().split('T')[0]);

    if (savedData) {
        const parsedData = JSON.parse(savedData);
        displayDailyReport(parsedData, formattedDate);
    } else {
        alert('Δεν υπάρχουν αποθηκευμένα δεδομένα για την επιλεγμένη ημερομηνία.');
    }
}

function displayDailyReport(data, date) {
    const dailyReportTable = document.getElementById('dailyReportTable').getElementsByTagName('tbody')[0];
    dailyReportTable.innerHTML = ''; // Καθαρίζουμε τον πίνακα πριν προσθέσουμε νέα δεδομένα

    // Προσθήκη ημερομηνίας
    const rowDate = dailyReportTable.insertRow();
    const dateCell = rowDate.insertCell(0);
    const amountCellDate = rowDate.insertCell(1);

    dateCell.textContent = 'Ημερομηνία';
    amountCellDate.textContent = date;

    // Προσθήκη εσόδων
    const rowCashIncome = dailyReportTable.insertRow();
    const typeCellCashIncome = rowCashIncome.insertCell(0);
    const amountCellCashIncome = rowCashIncome.insertCell(1);

    typeCellCashIncome.textContent = 'Έσοδα από Μετρητά';
    amountCellCashIncome.textContent = formatCurrency(data.income.cash);

    const rowCardIncome = dailyReportTable.insertRow();
    const typeCellCardIncome = rowCardIncome.insertCell(0);
    const amountCellCardIncome = rowCardIncome.insertCell(1);

    typeCellCardIncome.textContent = 'Έσοδα από Κάρτα';
    amountCellCardIncome.textContent = formatCurrency(data.income.card);

    const rowTotalIncome = dailyReportTable.insertRow();
    const typeCellTotalIncome = rowTotalIncome.insertCell(0);
    const amountCellTotalIncome = rowTotalIncome.insertCell(1);

    typeCellTotalIncome.textContent = 'Σύνολο Εσόδων';
    amountCellTotalIncome.textContent = formatCurrency(data.income.cash + data.income.card);

    // Προσθήκη εξόδων
    const rowCashExpense = dailyReportTable.insertRow();
    const typeCellCashExpense = rowCashExpense.insertCell(0);
    const amountCellCashExpense = rowCashExpense.insertCell(1);

    typeCellCashExpense.textContent = 'Έξοδα από Μετρητά';
    amountCellCashExpense.textContent = formatCurrency(data.expense.cash);

    const rowCardExpense = dailyReportTable.insertRow();
    const typeCellCardExpense = rowCardExpense.insertCell(0);
    const amountCellCardExpense = rowCardExpense.insertCell(1);

    typeCellCardExpense.textContent = 'Έξοδα από Κάρτα';
    amountCellCardExpense.textContent = formatCurrency(data.expense.card);

    const rowTotalExpense = dailyReportTable.insertRow();
    const typeCellTotalExpense = rowTotalExpense.insertCell(0);
    const amountCellTotalExpense = rowTotalExpense.insertCell(1);

    typeCellTotalExpense.textContent = 'Σύνολο Εξόδων';
    amountCellTotalExpense.textContent = formatCurrency(data.expense.cash + data.expense.card);

    // Προσθήκη συνολικών υπολοίπων
    const rowTotalCash = dailyReportTable.insertRow();
    const typeCellTotalCash = rowTotalCash.insertCell(0);
    const amountCellTotalCash = rowTotalCash.insertCell(1);

    typeCellTotalCash.textContent = 'Σύνολο Μετρητών';
    amountCellTotalCash.textContent = formatCurrency(data.income.cash - data.expense.cash);

    const rowTotalCard = dailyReportTable.insertRow();
    const typeCellTotalCard = rowTotalCard.insertCell(0);
    const amountCellTotalCard = rowTotalCard.insertCell(1);

    typeCellTotalCard.textContent = 'Σύνολο Καρτών';
    amountCellTotalCard.textContent = formatCurrency(data.income.card - data.expense.card);
}



// script.js

