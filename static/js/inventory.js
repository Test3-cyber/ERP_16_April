document.addEventListener('DOMContentLoaded', function() {
    // Calculate total cost when unit price or quantity changes
    const unitPriceInput = document.getElementById('unitPrice');
    const quantityInput = document.getElementById('quantity');
    const totalCostDisplay = document.getElementById('totalCostDisplay') || document.getElementById('totalCost');
    const totalCostHidden = document.getElementById('totalCostHidden');

    function calculateTotalCost() {
        if (unitPriceInput && quantityInput && totalCostDisplay) {
            const unitPrice = parseFloat(unitPriceInput.value) || 0;
            const quantity = parseFloat(quantityInput.value) || 0;
            const totalCost = unitPrice * quantity;
            
            totalCostDisplay.value = totalCost.toFixed(2);
            
            if (totalCostHidden) {
                totalCostHidden.value = totalCost.toFixed(2);
            }
        }
    }

    if (unitPriceInput) {
        unitPriceInput.addEventListener('input', calculateTotalCost);
    }
    
    if (quantityInput) {
        quantityInput.addEventListener('input', calculateTotalCost);
    }

    // Initialize calculation
    calculateTotalCost();

    // Category filter for inventory table
    const categoryFilter = document.getElementById('categoryFilter');
    const inventoryTable = document.getElementById('inventoryTable');
    
    if (categoryFilter && inventoryTable) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            const rows = inventoryTable.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const categoryCell = row.cells[2]; // Category is in the 3rd column (index 2)
                
                if (selectedCategory === 'all' || categoryCell.textContent === selectedCategory) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Handle status change buttons
    const statusButtons = document.querySelectorAll('.change-status-btn');
    
    statusButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const itemId = this.getAttribute('data-id');
            const newStatus = this.getAttribute('data-status');
            const row = this.closest('tr');
            const statusCell = row.querySelector('.item-status');
            
            // Here you would normally make an AJAX call to update the status
            // For demo purposes, we'll just update the UI
            if (statusCell) {
                statusCell.textContent = newStatus;
                
                // Update visible status buttons
                row.querySelectorAll('.change-status-btn').forEach(btn => {
                    if (btn.getAttribute('data-status') === newStatus) {
                        btn.style.display = 'none';
                    } else {
                        btn.style.display = '';
                    }
                });
                
                // Show success message
                showAlert(`Item status updated to "${newStatus}"`, 'success');
            }
        });
    });

    // Form submission handling
    const addInventoryForm = document.getElementById('addInventoryForm');
    
    if (addInventoryForm) {
        addInventoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Normally this would submit via AJAX, but for demo we'll just show a success message
            showAlert('Inventory item added successfully!', 'success');
            
            // In a real application, you would send the form data to the server
            // and then redirect or update the inventory list
            setTimeout(() => {
                window.location.href = '/inventory';
            }, 1500);
        });
    }

    // Function to show alerts
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
        
        alertPlaceholder.append(wrapper);
        
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
