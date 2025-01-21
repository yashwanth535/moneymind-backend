let debits=new Array;
let credits=new Array;
window.onload = async function() {
    try {
        const response = await fetch(`/fetch-transactons/fetch-debits`);
        if (response.ok) {
            debits = await response.json();
            fill_debits(debits);
        } else {
            alert('Error fetching expenses');
        }
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }

    try{
        const response = await fetch(`/fetch-transactons/fetch-credits`);
        if (response.ok) {
            credits = await response.json();
        }else {
            alert('Error fetching expenses');
        }
    }
    catch (error) {
        console.error('Error fetching expenses:', error);
    }
};


function applyFilters() {
    const filterType = document.getElementById('filter-type').value; // Debit or Credit
    const startMonth = document.getElementById('start-month').value; // Start Month
    const endMonth = document.getElementById('end-month').value; // End Month
    const filterMode = document.getElementById('filter-mode').value; // Payment Mode
    const filterCategory = document.getElementById('filter-category').value.toLowerCase(); // Category (Purpose)

    // Choose the correct array based on filter type
    let filteredArray = filterType === "Debit" ? debits : credits;

    // Apply filters one by one
    filteredArray = filteredArray.filter(item => {
        const itemDate = new Date(item.date);
        const itemMonthYear = itemDate.toISOString().slice(0, 7); // Format: YYYY-MM

        // Filter by month range if provided
        if (startMonth && itemMonthYear < startMonth) return false;
        if (endMonth && itemMonthYear > endMonth) return false;

        // Filter by mode of payment (if provided)
        if (filterMode && item.modeOfPayment !== filterMode) return false;

        // Filter by category (purpose) if provided
        if (filterCategory && !item.purpose.toLowerCase().includes(filterCategory)) return false;

        return true;
    });

    if(filterType === "Debit"){
        fill_debits(filteredArray);
    }
    else{
        fill_credits(filteredArray);
    }
}

function resetFilters() {
    // Reload the page
    location.reload();
}




function fill_debits(debits){
    const tbody = document.getElementById('debit-tbody');
    document.getElementById('credit-table').style.display='none';
    document.getElementById('debit-table').style.display='table';
    tbody.innerHTML = '';
    
    if (debits.length === 0) {
        // Create a row with a message when no debits are found
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5; // Adjust colspan to match the number of columns in your table
        cell.textContent = 'No Debits Found';
        cell.style.textAlign = 'center'; // Center the text horizontally
        cell.style.fontSize = '18px'; // Increase the font size
        cell.style.fontWeight = 'bold'; // Optional: Make the text bold for emphasis
        cell.style.color = '#e0e0e0';
        row.appendChild(cell);
        tbody.appendChild(row);
    } 
    else {
        debits.forEach(expense => {
            const row = document.createElement('tr');
            row.id = `row-${expense._id}`; // Add unique ID to each row
            row.innerHTML = `
                <td><span class="static">${expense.amount}</span><input class="edit hidden" type="number" value="${expense.amount}" /></td>
                <td><span class="static">${new Date(expense.date).toLocaleDateString()}</span><input class="edit hidden" type="date" value="${expense.date.split('T')[0]}" /></td>
                <td><span class="static">${expense.purpose}</span><input class="edit hidden" type="text" value="${expense.purpose}" /></td>
                <td><span class="static">${expense.modeOfPayment}</span><input class="edit hidden" type="text" value="${expense.modeOfPayment}" /></td>
                <td>
                    <button class="edit-btn" onclick="edit_debit('${expense._id}')">Edit</button>
                    <button class="save-btn hidden" onclick="save_debit('${expense._id}')">Save</button>
                    <button onclick="delete_debit('${expense._id}')">Delete</button>
                </td>
            `; 
            tbody.appendChild(row);
        });
}
}
function fill_credits(credits){ 
    const tbody = document.getElementById('credit-tbody');
    tbody.innerHTML = '';
    document.getElementById('debit-table').style.display='none';
    document.getElementById('credit-table').style.display='table';
    if (credits.length === 0) {
        // Create a row with a message when no debits are found
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5; // Adjust colspan to match the number of columns in your table
        cell.textContent = 'No Credits Found';
        cell.style.textAlign = 'center'; // Center the text horizontally
        cell.style.fontSize = '18px'; // Increase the font size
        cell.style.fontWeight = 'bold'; // Optional: Make the text bold for emphasis
        row.appendChild(cell);
        tbody.appendChild(row);
    } 
    else {
        credits.forEach(expense => {
            const row = document.createElement('tr');
            row.id = `row-${expense._id}`; // Add unique ID to each row
            row.innerHTML = `
                <td><span class="static">${expense.amount}</span><input class="edit hidden" type="number" value="${expense.amount}" /></td>
                <td><span class="static">${new Date(expense.date).toLocaleDateString()}</span><input class="edit hidden" type="date" value="${expense.date.split('T')[0]}" /></td>
                <td><span class="static">${expense.modeOfPayment}</span><input class="edit hidden" type="text" value="${expense.modeOfPayment}" /></td>
                                <td><span class="static">${expense.bank}</span><input class="edit hidden" type="text" value="${expense.bank}" /></td>
                <td>
                    <button class="edit-btn" onclick="edit_credit('${expense._id}')">Edit</button>
                    <button class="save-btn hidden" onclick="save_credit('${expense._id}')">Save</button>
                    <button onclick="delete_credit('${expense._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
}
}



function edit_debit(expenseId) {
    const row = document.getElementById(`row-${expenseId}`);
    const staticFields = row.querySelectorAll('.static');
    const editFields = row.querySelectorAll('.edit');
    const editBtn = row.querySelector('.edit-btn'); 
    const saveBtn = row.querySelector('.save-btn');

    // Hide static fields and "Edit" button, show edit fields and "Save" button
    staticFields.forEach(el => el.classList.add('hidden'));
    editFields.forEach(el => el.classList.remove('hidden'));
    editBtn.classList.add('hidden');
    saveBtn.classList.remove('hidden');
}

async function save_debit(expenseId) {
const row = document.getElementById(`row-${expenseId}`);
if (!row) {
 console.error(`Row with ID row-${expenseId} not found`);
 return;
}

// Get values from input fields inside the row
const inputs = row.getElementsByTagName('input');
if (inputs.length < 4) {
 console.error("One or more input fields could not be found");
 return;
}

const amount = inputs[0].value; // Assuming first input is amount
const date = inputs[1].value; // Assuming second input is date
const purpose = inputs[2].value; // Assuming third input is purpose
const modeOfPayment = inputs[3].value; // Assuming fourth input is mode of payment

// Validation: Check if any field is empty
if (!amount || !date || !purpose || !modeOfPayment) {
 alert("All fields are required!");
 return;
}

try {
 const response = await fetch(`/fetch-transactons/edit-debit/${expenseId}`, {
     method: 'PUT',
     headers: {
         'Content-Type': 'application/json',
     },
     body: JSON.stringify({
         amount,
         date,
         purpose,
         modeOfPayment,
     }),
 });

 if (response.ok) {
     alert('Expense updated successfully');
     window.location.reload();
 } else {
     alert('Error updating expense');
 }
} catch (error) {
 console.error('Error updating expense:', error);
}
}



async function delete_debit(expenseId) {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
        const response = await fetch(`/fetch-transactons/delete-debit/${expenseId}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Expense deleted successfully');
            window.location.reload();
        } else {
            alert('Error deleting expense');
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}


function edit_credit(expenseId) {
    const row = document.getElementById(`row-${expenseId}`);
    const staticFields = row.querySelectorAll('.static');
    const editFields = row.querySelectorAll('.edit');
    const editBtn = row.querySelector('.edit-btn'); 
    const saveBtn = row.querySelector('.save-btn');

    // Hide static fields and "Edit" button, show edit fields and "Save" button
    staticFields.forEach(el => el.classList.add('hidden'));
    editFields.forEach(el => el.classList.remove('hidden'));
    editBtn.classList.add('hidden');
    saveBtn.classList.remove('hidden');
}

async function save_credit(expenseId) {
const row = document.getElementById(`row-${expenseId}`);
if (!row) {
 console.error(`Row with ID row-${expenseId} not found`);
 return;
}

// Get values from input fields inside the row
const inputs = row.getElementsByTagName('input');
if (inputs.length < 4) {
 console.error("One or more input fields could not be found");
 return;
}

const amount = inputs[0].value; // Assuming first input is amount
const date = inputs[1].value; // Assuming second input is date
const purpose = inputs[2].value; // Assuming third input is purpose
const modeOfPayment = inputs[3].value; // Assuming fourth input is mode of payment

// Validation: Check if any field is empty
if (!amount || !date || !purpose || !modeOfPayment) {
 alert("All fields are required!");
 return;
}

try {
 const response = await fetch(`/fetch-transactons/edit-credit/${expenseId}`, {
     method: 'PUT',
     headers: {
         'Content-Type': 'application/json',
     },
     body: JSON.stringify({
         amount,
         date,
         purpose,
         modeOfPayment,
     }),
 });

 if (response.ok) {
     alert('Expense updated successfully');
     window.location.reload();
 } else {
     alert('Error updating expense');
 }
} catch (error) {
 console.error('Error updating expense:', error);
}
}



async function delete_credit(expenseId) {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
        const response = await fetch(`/fetch-transactons/delete-credit/${expenseId}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Expense deleted successfully');
            window.location.reload();
        } else {
            alert('Error deleting expense');
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}