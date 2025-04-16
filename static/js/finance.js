document.addEventListener('DOMContentLoaded', function() {
    // Initialize DataTable for expenses
    if (document.getElementById('expensesTable')) {
        $('#expensesTable').DataTable({
            responsive: true,
            "order": [[1, "desc"]],
            "pageLength": 10,
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
        });
    }
    
    // Filter expenses by category or date range
    const categoryFilter = document.getElementById('categoryFilter');
    const startDateFilter = document.getElementById('startDateFilter');
    const endDateFilter = document.getElementById('endDateFilter');
    
    function filterExpenses() {
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        const startDate = startDateFilter ? new Date(startDateFilter.value) : null;
        const endDate = endDateFilter ? new Date(endDateFilter.value) : null;
        
        const rows = document.querySelectorAll('#expensesTable tbody tr');
        
        rows.forEach(row => {
            const category = row.querySelector('td:nth-child(3)').textContent;
            const dateStr = row.querySelector('td:nth-child(2)').textContent;
            const dateParts = dateStr.split('-');
            const rowDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            
            const categoryMatch = selectedCategory === 'all' || category === selectedCategory;
            const dateMatch = 
                (!startDate || rowDate >= startDate) && 
                (!endDate || rowDate <= endDate);
            
            if (categoryMatch && dateMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        
        // Update total amount
        updateTotalAmount();
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterExpenses);
    }
    
    if (startDateFilter) {
        startDateFilter.addEventListener('change', filterExpenses);
    }
    
    if (endDateFilter) {
        endDateFilter.addEventListener('change', filterExpenses);
    }
    
    // Update total amount based on visible rows
    function updateTotalAmount() {
        const totalAmountElement = document.getElementById('totalAmount');
        if (!totalAmountElement) return;
        
        const visibleRows = document.querySelectorAll('#expensesTable tbody tr:not([style*="display: none"])');
        let total = 0;
        
        visibleRows.forEach(row => {
            const amountText = row.querySelector('td:nth-child(4)').textContent;
            const amount = parseFloat(amountText.replace(/[^0-9.-]+/g, ''));
            total += isNaN(amount) ? 0 : amount;
        });
        
        totalAmountElement.textContent = total.toFixed(2);
    }
    
    // Expense form validation
    const addExpenseForm = document.getElementById('addExpenseForm');
    if (addExpenseForm) {
        addExpenseForm.addEventListener('submit', function(event) {
            const category = document.getElementById('category').value;
            const amount = document.getElementById('amount').value;
            const description = document.getElementById('description').value;
            const date = document.getElementById('date').value;
            
            if (!category || !amount || !description || !date) {
                event.preventDefault();
                showAlert('Please fill all required fields.', 'danger');
            }
        });
    }
    
    // Set today's date as default for date field
    const dateInput = document.getElementById('date');
    if (dateInput && !dateInput.value) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
    
    // Toggle payment method details
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const chequeContainer = document.getElementById('chequeDetailsContainer');
    const onlineContainer = document.getElementById('onlineDetailsContainer');
    
    if (paymentMethodSelect && chequeContainer && onlineContainer) {
        paymentMethodSelect.addEventListener('change', function() {
            const selectedMethod = this.value;
            
            chequeContainer.style.display = selectedMethod === 'Cheque' ? 'block' : 'none';
            onlineContainer.style.display = selectedMethod === 'Online' ? 'block' : 'none';
        });
    }
    
    // Show alert message
    function showAlert(message, type = 'info') {
        const alertPlaceholder = document.getElementById('alertPlaceholder');
        if (!alertPlaceholder) return;
        
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        alertPlaceholder.appendChild(wrapper);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = wrapper.querySelector('.alert');
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }
});
