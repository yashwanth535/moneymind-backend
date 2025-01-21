
async function retrieveDashBoard() {
    try {
        const response = await fetch(`home/dashboard`);
        
        if (response.ok) {
            const data = await response.json();
            
            // Update the total expenses
            document.getElementById('totalExpenses').innerHTML = `Total Expenses: ₹${data.total}/-`;
            
            renderPieChart(data.expenseByPurpose);
        } else {
            alert('Error fetching dashboard data');
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
}

function renderPieChart(expenseByPurpose) {
const ctx = document.getElementById('pieChart').getContext('2d');

// Sort the data in descending order of total amounts
const sortedData = expenseByPurpose.sort((a, b) => b.total - a.total);

// Separate the top 6 purposes and group the rest as "Others"
const top6 = sortedData.slice(0, 6);
const others = sortedData.slice(6);

// Calculate the total for "Others"
const othersTotal = others.reduce((sum, item) => sum + item.total, 0);

// Prepare labels and values for the chart
const labels = top6.map(item => item._id); // Top 6 purpose names
const values = top6.map(item => item.total); // Top 6 totals

if (othersTotal > 0) {
    labels.push('Others'); // Add "Others" label
    values.push(othersTotal); // Add "Others" total
}

// Create the pie chart
new Chart(ctx, {
    type: 'pie',
    data: {
        labels: labels,
        datasets: [{
            data: values,
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
                '#C0C0C0' // Color for "Others"
            ].slice(0, labels.length) // Ensure colors match the number of labels
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom'
            }
        }
    }
});
}

async function fetchDebits() {
try {
    const response = await fetch('/home/debits');
    if (response.ok) {
        const data = await response.json();

        // Update total debit
        document.getElementById('totalDebit').textContent = data.totalDebit;

        // Populate last 5 debits
        const lastDebitsList = document.getElementById('lastDebitsList');
        lastDebitsList.innerHTML = ''; // Clear any existing entries

        data.lastDebits.forEach(debit => {
            const listItem = document.createElement('li');
            listItem.textContent = `${new Date(debit.date).toLocaleDateString()}: ₹${debit.amount}`;
            lastDebitsList.appendChild(listItem);
        });
    } else {
        alert('Error fetching debit data');
    }
} catch (error) {
    console.error('Error fetching debits:', error);
}
}

document.addEventListener('DOMContentLoaded', fetchDebits);

