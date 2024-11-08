class Transaction {
    constructor(amount, description, category, date) {
        this.amount = amount;
        this.description = description;
        this.category = category;
        this.date = date;
    }
}
class Tracker {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        this.updateDisplay();
    }
    addTransaction(amount, description, category, date) {

        const transactionsList = document.getElementById("transactions-list");
        const newRow = document.createElement("tr");
        
        const dateCell = document.createElement("td");
        dateCell.textContent = date;

        const amountCell = document.createElement("td");
        amountCell.textContent = amount;

        const categoryCell = document.createElement("td");
        categoryCell.textContent = category;

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = description;

        newRow.appendChild(dateCell);
        newRow.appendChild(amountCell);
        newRow.appendChild(categoryCell);
        newRow.appendChild(descriptionCell);

        transactionsList.appendChild(newRow);

        const transaction = new Transaction(amount, description, category, date);
        this.transactions.push(transaction);
        this.saveToLocalStorage();
        this.updateDisplay();
    }
    calculateTotals() {
        let income = 0, expenses = 0;
        this.transactions.forEach(transaction => {
            if (transaction.amount > 0) 
                income += +transaction.amount;
            else 
                expenses += +transaction.amount;
        });
        return { income, expenses, balance: income - expenses };
    }
    updateDisplay() {
        this.displayTransactions();
        this.updateTotals();
    }
    displayTransactions() {
        const listContainer = document.getElementById("transactions-list");
        listContainer.innerHTML = "";  
        this.transactions.forEach(transaction => {
            const row = document.createElement("tr");

            const dateCell = document.createElement("td");
            dateCell.textContent = transaction.date;
            row.appendChild(dateCell);

            const amountCell = document.createElement("td");
            amountCell.textContent = `${transaction.amount}`;
            row.appendChild(amountCell);

            const categoryCell = document.createElement("td");
            categoryCell.textContent = transaction.category;
            row.appendChild(categoryCell);

            const descriptionCell = document.createElement("td");
            descriptionCell.textContent = transaction.description;
            row.appendChild(descriptionCell);
            // row.innerHTML = `
            // <td>${transaction.date}>/td>
            // <td>${transaction.amount}>/td>
            // <td>${transaction.category}>/td>
            // <td>${transaction.description}>/td>
            // `;
            // const listItem = document.createElement("div");
            // listItem.textContent = `${transaction.date} : ₹ ${transaction.amount} for ${transaction.category} - ${transaction.description}`;
            listContainer.appendChild(row);
        });
    }
    updateTotals() {
        const { income, expenses, balance } = this.calculateTotals();
        document.getElementById("total-expenditures").textContent = expenses;
        document.getElementById("total-income").textContent = income;
        document.getElementById("net-balance").textContent = balance;
    }
    saveToLocalStorage() {
        localStorage.setItem("transactions", JSON.stringify(this.transactions));
    }
}

const tracker = new Tracker();

document.getElementById("date").max = new Date().toISOString().split("T")[0];

document.getElementById("finance-tracker-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    if (!amount || !description || !date) {
        alert("Please fill in all fields.");
        return;
    }

    tracker.addTransaction(amount, description, category, date);
    e.target.reset();
});
