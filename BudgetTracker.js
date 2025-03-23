export default class BudgetTracker {
    constructor(querySelectorString) {
        this.root = document.querySelector(querySelectorString);
        this.root.innerHTML = BudgetTracker.html();

        this.root.querySelector(".new-entry").addEventListener("click", () => {
            this.onNewEntryClick();
        });

        // Load the data
        this.load();
    }

    static html() {
        return `
            <table class="budget-tracker">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody class="entries"></tbody>
                <tbody>
                    <tr>
                        <td colspan="5" class="controls">
                            <button type="button" class="new-entry">New Entry</button>
                        </td>
                    </tr> 
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="5" class="summary">
                            <strong>Total Balance:</strong>
                            <span class="total">0.00</span>
                        </td>
                    </tr>
                </tfoot>
            </table>
            <div class="financial-awareness">
                <h2>Financial Awareness Tips</h2>
                <section>
                    <h3>Why Budgeting Matters</h3>
                    <p>Budgeting helps you track your income and expenses, ensuring you live within your means and save for the future.</p>
                </section>
                <section>
                    <h3>Tips for Effective Budgeting</h3>
                    <ul>
                        <li>Track every expense, no matter how small.</li>
                        <li>Set financial goals (e.g., saving for a house or paying off debt).</li>
                        <li>Review your budget regularly and adjust as needed.</li>
                    </ul>
                </section>
            </div>
        `;
    }

    static entryHtml() {
        return `
            <tr>
                <td>
                    <input class="input input-date" type="date">
                </td>
                <td>
                    <input class="input input-description" type="text" placeholder="Add a Description (e.g., wages, bills, etc)">
                </td>
                <td>
                    <select class="input input-type">
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </td>
                <td>
                    <input type="number" class="input input-amount">
                </td>
                <td>
                    <button type="button" class="delete-entry">&#10005;</button>
                </td>
            </tr>
        `;
    }

    load() {
        const entries = JSON.parse(localStorage.getItem("entries") || "[]");

        for (const entry of entries) {
            this.addEntry(entry);
        }
        this.updateSummary();
    }

    updateSummary() {
        const total = this.getEntryRows().reduce((total, row) => {
            const amount = row.querySelector(".input-amount").value;
            const isExpense = row.querySelector(".input-type").value === "expense";
            const modifier = isExpense ? -1 : 1;
            return total + (modifier * parseFloat(amount));
        }, 0);

        const totalFormatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(total);

        this.root.querySelector(".total").textContent = totalFormatted;

        // Add financial advice based on total balance
        const adviceSection = this.root.querySelector(".financial-awareness");
        if (total < 0) {
            adviceSection.innerHTML += `
                <section class="advice">
                    <h3>Financial Advice</h3>
                    <p>Your balance is negative. Consider reducing expenses or finding additional income sources.</p>
                </section>
            `;
        } else {
            adviceSection.innerHTML += `
                <section class="advice">
                    <h3>Financial Advice</h3>
                    <p>Great job! You're in the green. Consider saving or investing your surplus.</p>
                </section>
            `;
        }
    }

    save() {
        const data = this.getEntryRows().map(row => {
            return {
                date: row.querySelector(".input-date").value,
                description: row.querySelector(".input-description").value,
                type: row.querySelector(".input-type").value,
                amount: parseFloat(row.querySelector(".input-amount").value)
            };
        });

        localStorage.setItem("entries", JSON.stringify(data));
        this.updateSummary();
    }

    addEntry(entry = {}) {
        this.root.querySelector(".entries").insertAdjacentHTML("beforeend", BudgetTracker.entryHtml());

        const row = this.root.querySelector(".entries tr:last-child");
        row.querySelector(".input-date").value = entry.date || new Date().toISOString().split("T")[0];
        row.querySelector(".input-description").value = entry.description || "";
        row.querySelector(".input-type").value = entry.type || "income";
        row.querySelector(".input-amount").value = entry.amount || 0;
        row.querySelector(".delete-entry").addEventListener("click", e => {
            this.onDeleteEntryClick(e);
        });
        row.querySelectorAll(".input").forEach(input => { 
            input.addEventListener("change", () => this.save());
        });
    }

    getEntryRows() {
        return Array.from(this.root.querySelectorAll(".entries tr"));
    }

    onNewEntryClick() {
        this.addEntry();
    }

    onDeleteEntryClick(e) {
        e.target.closest("tr").remove();
        this.save();
    }
}