
document.getElementById('debit-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const purpose = document.getElementById('purpose').value;
    const modeOfPayment = document.getElementById('modeOfPayment').value;

    try {
        const response = await fetch('/add-transaction/debit-transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({amount, date, purpose, modeOfPayment })
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('message').style.color = '#90EE90';
            document.getElementById('message').textContent = data.message;
        } else {
            document.getElementById('message').style.color = 'red';
            document.getElementById('message').textContent = data.message || 'An error occurred.';
        }
    } catch (error) {
        console.error('Error adding expense:', error);
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').textContent = 'An unexpected error occurred. Please try again.';
    }
}); 

document.getElementById('credit-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 
        // Use FormData to get all form values
    const formData = new FormData(event.target);

    // Access values from the FormData object
    const amount = formData.get('amount'); // Retrieves the 'name="amount"' field value
    const date = formData.get('date'); // Retrieves the 'name="date"' field value
    const bank = formData.get('bank'); // Retrieves the 'name="bank"' field value
    const modeOfPayment = formData.get('modeOfPayment'); 
    console.log("posrting credits:"+JSON.stringify({amount, date, modeOfPayment, bank}));
    try {
        const response = await fetch('/add-transaction/credit-transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({amount, date, modeOfPayment, bank})
        });
      
        const data = await response.json();

        // Access the message element within the current form
        const messageElement = event.target.querySelector('#message');
        if (response.ok) {
            messageElement.style.color = '#90EE90';
            messageElement.textContent = data.message;
        } else {
            messageElement.style.color = 'red';
            messageElement.textContent = data.message || 'An error occurred.';
        }
    } catch (error) {
        const messageElement = form.querySelector('#message');
        messageElement.style.color = 'red';
        messageElement.textContent = 'An unexpected error occurred. Please try again.';
        console.error(error);
    }
}); 

function toggleForm() {
    const selectedForm = document.getElementById("formType").value;
    document.getElementById("debit-form").style.display = selectedForm === "debit-from" ? "block" : "none";
    document.getElementById("credit-form").style.display = selectedForm === "credit-form" ? "block" : "none";
}

