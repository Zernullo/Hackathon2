const income = document.querySelector(".income-input");
const results = document.querySelector(".results-input");
const calculate = document.querySelector("#calculate");
const reset = document.querySelector("#reset");
const form = document.querySelector("form");

// Reset button functionality
reset.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission
    document.location.reload(); // Reload the page
});

// Function to round the result to 2 decimal places
const numRounded = (value) => {
    return (Math.round(value * 100) / 100).toFixed(2);
};

// Calculate button functionality
calculate.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission

    const incomeValue = parseFloat(income.value); // Convert input to a number

    if (isNaN(incomeValue)) {
        alert("Please enter a valid income amount.");
        return;
    }

    let tax = 0;

    // US Federal Tax Brackets for 2025 (Single Filer)
    if (incomeValue <= 11600) {
        tax = incomeValue * 0.10;
    } else if (incomeValue > 11600 && incomeValue <= 47150) {
        tax = 1160 + (incomeValue - 11600) * 0.12;
    } else if (incomeValue > 47150 && incomeValue <= 100525) {
        tax = 5426 + (incomeValue - 47150) * 0.22;
    } else if (incomeValue > 100525 && incomeValue <= 191950) {
        tax = 17196.50 + (incomeValue - 100525) * 0.24;
    } else if (incomeValue > 191950 && incomeValue <= 243725) {
        tax = 39146.50 + (incomeValue - 191950) * 0.32;
    } else if (incomeValue > 243725 && incomeValue <= 609350) {
        tax = 55937.50 + (incomeValue - 243725) * 0.35;
    } else if (incomeValue > 609350) {
        tax = 168183.75 + (incomeValue - 609350) * 0.37;
    }

    // Round the tax result and display it
    results.value = numRounded(tax);
});