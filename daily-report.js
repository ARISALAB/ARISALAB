document.addEventListener('DOMContentLoaded', function () {
    const selectedDateHeader = document.getElementById('selectedDateHeader');

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const selectedDate = urlParams.get('date');

    if (selectedDate) {
        selectedDateHeader.textContent = `Ημερήσια Αναφορά για την Ημερομηνία: ${selectedDate}`;
        displayDailyReport(selectedDate);
    } else {
        selectedDateHeader.textContent = 'Δεν έχει επιλεγεί ημερομηνία.';
    }
});

function displayDailyReport(selectedDate) {
    const dailyReportTable = document.getElementById('dailyReportTable').getElementsByTagName('tbody')[0];
    dailyReportTable.innerHTML = ''; // Καθαρίζουμε τον πίνακα πριν προσθέσουμε νέα δεδομένα

    const savedData = localStorage.getItem(selectedDate);
    if (savedData) {
        const parsedData = JSON.parse(savedData);

        if (parsedData.income) {
            displayRow(dailyReportTable, 'Έσοδα Μετρητά', parsedData.income.cash);
            displayRow(dailyReportTable, 'Έσοδα Κάρτα', parsedData.income.card);
        }

        if (parsedData.expense) {
            displayRow(dailyReportTable, 'Έξοδα Μετρητά', parsedData.expense.cash);
            displayRow(dailyReportTable, 'Έξοδα Κάρτα', parsedData.expense.card);
        }
    }
}

function displayRow(table, type, amount) {
    const row = table.insertRow();
    const typeCell = row.insertCell(0);
    const amountCell = row.insertCell(1);

    typeCell.textContent = type;
    amountCell.textContent = formatCurrency(amount);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(amount);
}
