document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function toggleClassList() {
    const classList = document.getElementById('class-select');
    const classSearch = document.getElementById('class-search');
    if (classList) {
        const isVisible = classList.style.display === 'block';
        classList.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            const studentList = document.getElementById('student-select');
            if (studentList) {
                studentList.style.display = 'none';
            }
        }
    }
}

function toggleStudentList() {
    const studentList = document.getElementById('student-select');
    const studentSearch = document.getElementById('student-search');
    if (studentList && !studentList.disabled) {
        const isVisible = studentList.style.display === 'block';
        studentList.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            const classList = document.getElementById('class-select');
            if (classList) {
                classList.style.display = 'none';
            }
        }
    }
}

function initApp() {
    // Initialize modals
    const classModalEl = document.getElementById('class-modal');
    const reportsModalEl = document.getElementById('reports-modal');
    const feeTypesModalEl = document.getElementById('fee-types-modal');

    const classModal = classModalEl ? new bootstrap.Modal(classModalEl) : null;
    const reportsModal = reportsModalEl ? new bootstrap.Modal(reportsModalEl) : null;
    const feeTypesModal = feeTypesModalEl ? new bootstrap.Modal(feeTypesModalEl) : null;

    // DOM Elements
    const classSelect = document.getElementById('class-select');
    const studentSelect = document.getElementById('student-select');
    const selectStudentBtn = document.getElementById('select-student-btn');
    const hideStudentInfoBtn = document.getElementById('hide-student-info');
    const addFeeBtn = document.getElementById('add-fee-btn');
    const openReportsBtn = document.getElementById('open-reports-modal');
    const feeTypeInput = document.getElementById('fee-type-search');
    const feeTypeList = document.getElementById('fee-type-list');
    const feeAmount = document.getElementById('fee-amount');
    const addFeeItemBtn = document.getElementById('add-fee-item-btn');
    const feeItemsList = document.getElementById('fee-items-list');
    const feeTotal = document.getElementById('fee-total');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const paymentMethodSelect = document.getElementById('payment-method');
    const chequeDetails = document.getElementById('cheque-details');
    const processPaymentBtn = document.getElementById('process-payment-btn');

    // Hidden input for storing student ID
    const studentIdInput = document.createElement('input');
    studentIdInput.type = 'hidden';
    studentIdInput.id = 'student-id';
    document.body.appendChild(studentIdInput);

    // Load classes when the page loads
    loadClasses();

    // Load fee types
    loadFeeTypes();

    // Event Listeners
    const classSearch = document.getElementById('class-search');
    const studentSearch = document.getElementById('student-search');

    if (classSearch) {
        classSearch.addEventListener('click', function(e) {
            e.stopPropagation();
            const classList = document.getElementById('class-select');
            const studentList = document.getElementById('student-select');
            
            if (classList) {
                classList.style.display = 'block';
                if (studentList) {
                    studentList.style.display = 'none';
                }
            }
        });

        classSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const classList = document.getElementById('class-select');
            const options = classList.getElementsByTagName('option');
            
            classList.style.display = 'block';
            for (let option of options) {
                const text = option.textContent.toLowerCase();
                option.style.display = text.includes(searchTerm) ? '' : 'none';
            }
        });
    }

    if (studentSearch) {
        studentSearch.addEventListener('click', function(e) {
            e.stopPropagation();
            if (!this.disabled) {
                const studentList = document.getElementById('student-select');
                const classList = document.getElementById('class-select');
                
                if (studentList) {
                    studentList.style.display = 'block';
                    if (classList) {
                        classList.style.display = 'none';
                    }
                }
            }
        });

        studentSearch.addEventListener('input', function() {
            if (!this.disabled) {
                const searchTerm = this.value.toLowerCase();
                const options = studentSelect.getElementsByTagName('option');
                studentSelect.style.display = 'block';
                
                for (let option of options) {
                    const text = option.textContent.toLowerCase();
                    option.style.display = text.includes(searchTerm) ? '' : 'none';
                }
            }
        });
    }

    // Close lists when clicking outside
    document.addEventListener('click', function(e) {
        const classSearch = document.getElementById('class-search');
        const classList = document.getElementById('class-select');
        const studentSearch = document.getElementById('student-search');
        const studentList = document.getElementById('student-select');

        if (classList && !classSearch.contains(e.target) && !classList.contains(e.target)) {
            classList.style.display = 'none';
        }
        if (studentList && !studentSearch.contains(e.target) && !studentList.contains(e.target)) {
            studentList.style.display = 'none';
        }
    });

    // Allow selecting options with click
    if (classSelect) {
        classSelect.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    if (studentSelect) {
        studentSelect.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    if (classSelect) {
        classSelect.addEventListener('change', function() {
            const className = this.value;
            const classSearch = document.getElementById('class-search');
            const studentSearch = document.getElementById('student-search');
            const studentSelect = document.getElementById('student-select');
            const selectStudentBtn = document.getElementById('select-student-btn');
            
            if (className) {
                // Update search input with selected class and hide dropdown
                if (classSearch) {
                    classSearch.value = this.options[this.selectedIndex].text;
                    classSelect.style.display = 'none';
                }
                // Reset student selection
                if (studentSearch) {
                    studentSearch.value = '';
                }
                if (studentSelect) {
                    studentSelect.value = '';
                    studentSelect.style.display = 'none';
                }
                // Load students for the selected class
                loadStudents(className);
                studentSelect.disabled = false;
                studentSearch.disabled = false;
                selectStudentBtn.disabled = true;
            } else {
                studentSelect.disabled = true;
                studentSearch.disabled = true;
                selectStudentBtn.disabled = true;
            }
        });
    }

    if (studentSelect) {
        studentSelect.addEventListener('change', function() {
            const studentSearch = document.getElementById('student-search');
            const selectStudentBtn = document.getElementById('select-student-btn');
            if (this.value) {
                if (studentSearch) {
                    studentSearch.value = this.options[this.selectedIndex].text;
                }
                if (selectStudentBtn) {
                    selectStudentBtn.disabled = false;
                }
            } else {
                if (selectStudentBtn) {
                    selectStudentBtn.disabled = true;
                }
            }
        });
    }

    if (studentSelect) {
        studentSelect.addEventListener('change', function() {
            const studentSearch = document.getElementById('student-search');
            if (this.value) {
                if (studentSearch) {
                    studentSearch.value = this.options[this.selectedIndex].text;
                }
                studentSelect.style.display = 'none';
            }
            selectStudentBtn.disabled = !this.value;
        });
    }

    if (selectStudentBtn) {
        selectStudentBtn.addEventListener('click', function() {
            const studentId = studentSelect.value;
            if (studentId) {
                // Load student details
                loadStudentInfo(studentId);

                // Hide the modal
                const classModal = bootstrap.Modal.getInstance(document.getElementById('class-modal'));
                classModal.hide();
            }
        });
    }

    if (hideStudentInfoBtn) {
        hideStudentInfoBtn.addEventListener('click', hideStudentInfoSection);
    }

    if (openReportsBtn) {
        openReportsBtn.addEventListener('click', function() {
            console.log("Reports button clicked");
            // Open the reports modal
            const reportsModal = new bootstrap.Modal(document.getElementById('reports-modal'));
            reportsModal.show();
        });

        // Ensure Reports button is enabled when a student is loaded
        if (document.getElementById('student-info-section').style.display !== 'none') {
            openReportsBtn.disabled = false;
        }
    }

    // Set up report button handlers
    const studentFeeReportBtn = document.getElementById('student-fee-report-btn');
    const classFeeReportBtn = document.getElementById('class-fee-report-btn');
    const feeSummaryReportBtn = document.getElementById('fee-summary-report-btn');

    if (studentFeeReportBtn) {
        studentFeeReportBtn.addEventListener('click', function() {
            const studentId = document.getElementById('student-id').value;
            const studentName = document.getElementById('student-name').textContent;

            if (!studentId) {
                showAlert('Please select a student first', 'warning');
                return;
            }

            showAlert(`Generating fee report for ${studentName}...`, 'info');
            // In a real app, this would call a backend API to generate the report
            setTimeout(() => {
                showAlert('Student fee report generated successfully!', 'success');
            }, 1000);
        });
    }

    if (classFeeReportBtn) {
        classFeeReportBtn.addEventListener('click', function() {
            const className = document.getElementById('student-class').textContent;

            if (className === '-') {
                showAlert('Please select a student first', 'warning');
                return;
            }

            showAlert(`Generating fee report for Class ${className}...`, 'info');
            // In a real app, this would call a backend API to generate the report
            setTimeout(() => {
                showAlert('Class fee report generated successfully!', 'success');
            }, 1000);
        });
    }

    if (feeSummaryReportBtn) {
        feeSummaryReportBtn.addEventListener('click', function() {
            showAlert('Generating overall fee collection summary...', 'info');
            // In a real app, this would call a backend API to generate the report
            setTimeout(() => {
                showAlert('Fee collection summary generated successfully!', 'success');
            }, 1000);
        });
    }

    // Add Fee button click handler
    if (addFeeBtn) {
        addFeeBtn.addEventListener('click', function() {
            // Always show class selection modal first
            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('class-modal'));
            if (modal) {
                modal.show();
                if (openReportsBtn) {
                    openReportsBtn.disabled = false;
                }
            }
        });
    }

    // Show fee types button click handler
    const showAllFeeTypesBtn = document.getElementById('show-all-fee-types');
    if (showAllFeeTypesBtn) {
        showAllFeeTypesBtn.addEventListener('click', function() {
            feeTypesModal.show();
        });
    }

    if (feeTypeInput) {
        feeTypeInput.addEventListener('focus', function() {
            showFeeTypeList();
        });

        feeTypeInput.addEventListener('input', function() {
            filterFeeTypes();
        });

        feeTypeInput.addEventListener('keydown', function(e) {
            navigateFeeTypeList(e);
        });
    }

    // Click outside to close fee type list
    document.addEventListener('click', function(e) {
        const feeTypeList = document.getElementById('fee-type-list');
        const feeTypeInput = document.getElementById('fee-type-search');
        if (feeTypeList && feeTypeInput && e.target !== feeTypeInput && !feeTypeList.contains(e.target)) {
            feeTypeList.style.display = 'none';
        }
    });

    if (addFeeItemBtn) {
        addFeeItemBtn.addEventListener('click', function() {
            const feeType = feeTypeInput.value;
            const amount = feeAmount.value;

            if (!feeType || !amount) {
                showAlert('Please select a fee type and enter an amount', 'warning');
                return;
            }

            // Create a fee item element
            const feeItemId = Date.now(); // Use timestamp as a unique ID
            const feeItem = document.createElement('div');
            feeItem.className = 'card mb-2';
            feeItem.dataset.id = feeItemId;

            feeItem.innerHTML = `
                <div class="card-body py-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${feeType}</strong>
                        </div>
                        <div class="d-flex align-items-center">
                            <div class="mx-3">
                                ₹${parseFloat(amount).toFixed(2)}
                            </div>
                            <button class="btn btn-sm btn-outline-danger fee-delete-btn">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Add the fee item to the list
            feeItemsList.appendChild(feeItem);

            // Add delete button event listener
            const deleteBtn = feeItem.querySelector('.fee-delete-btn');
            deleteBtn.addEventListener('click', function() {
                feeItem.remove();
                updateFeeTotal();
            });

            // Clear inputs
            feeTypeInput.value = '';
            feeAmount.value = '';

            // Hide fee type list
            feeTypeList.style.display = 'none';

            // Update total
            updateFeeTotal();

            // Show fee section
            showFeeSection();
        });
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllFeeItems);
    }

    if (paymentMethodSelect) {
        paymentMethodSelect.addEventListener('change', togglePaymentDetails);
    }

    if (processPaymentBtn) {
        processPaymentBtn.addEventListener('click', processPayment);
    }
}

function loadClasses() {
    fetch('/api/get-classes')
        .then(response => response.json())
        .then(classes => {
            const classSelect = document.getElementById('class-select');
            if (classSelect) {
                // Clear existing options except the first one
                while (classSelect.options.length > 1) {
                    classSelect.remove(1);
                }

                // Add new options
                classes.forEach(cls => {
                    const option = document.createElement('option');
                    option.value = cls.class_name; // Use full class name as value
                    option.textContent = `${cls.class_name} - ${cls.section}`;
                    classSelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error loading classes:', error);
            showAlert('Error loading classes', 'danger');
        });
}

function loadStudents(className) {
    // Fetch students for the selected class
    fetch(`/api/get-students/${className}`)
        .then(response => response.json())
        .then(data => {
            console.log(`Loading students for class: ${className}`);
            console.log(`Found ${data.length} students`);

            const studentSelect = document.getElementById('student-select');
            if (studentSelect) {
                // Clear existing options except the first one
                while (studentSelect.options.length > 1) {
                    studentSelect.remove(1);
                }

                // Add new options
                data.forEach(student => {
                    const option = document.createElement('option');
                    option.value = student.id;
                    option.textContent = `${student.name} (${student.roll_no})`;
                    studentSelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error loading students:', error);
        });
}

function loadStudentInfo(studentId) {
    try {
        // Check if student ID input exists, if not create it
        let studentIdInput = document.getElementById('student-id');
        if (!studentIdInput) {
            studentIdInput = document.createElement('input');
            studentIdInput.type = 'hidden';
            studentIdInput.id = 'student-id';
            document.body.appendChild(studentIdInput);
        }
        studentIdInput.value = studentId;

        console.log("Loading student info for ID:", studentId);

        // Fetch student details
        fetch(`/api/get-student-details/${studentId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(student => {
                // Update student info section
                const studentName = document.getElementById('student-name');
                const studentClass = document.getElementById('student-class');
                const studentAdmissionNo = document.getElementById('student-admission-no');
                const parentName = document.getElementById('parent-name');

                if (studentName) studentName.textContent = `${student.first_name} ${student.last_name}`;
                if (studentClass) studentClass.textContent = student.class;
                if (studentAdmissionNo) studentAdmissionNo.textContent = student.admission_no;
                if (parentName) parentName.textContent = student.parent_name;

                // Show student info section
                const studentInfoSection = document.getElementById('student-info-section');
                if (studentInfoSection) {
                    studentInfoSection.style.display = 'block';
                }

                // Show fee section
                const feeSection = document.getElementById('fee-section');
                if (feeSection) {
                    feeSection.style.display = 'block';
                }

                // Enable Reports button
                const openReportsBtn = document.getElementById('open-reports-modal');
                if (openReportsBtn) {
                    openReportsBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error loading student details:', error);
                showAlert('Error loading student details. Please try again.', 'danger');
            });
    } catch (error) {
        console.error('Error in loadStudentInfo:', error);
        showAlert('An unexpected error occurred', 'danger');
    }
}

function loadFeeTypes() {
    // Fetch fee types from the server
    fetch('/api/get-fee-types')
        .then(response => response.json())
        .then(data => {
            // Store the fee types in a global variable
            window.feeTypes = data;
        })
        .catch(error => {
            console.error('Error loading fee types:', error);
        });
}

function showFeeTypeList() {
    const feeTypeList = document.getElementById('fee-type-list');
    if (feeTypeList) {
        populateAllFeeTypes();
        feeTypeList.style.display = 'block';
    }
}

function filterFeeTypes() {
    const searchTerm = document.getElementById('fee-type-input').value.toLowerCase();
    const feeTypeList = document.getElementById('fee-type-list');

    if (feeTypeList && window.feeTypes) {
        const filteredTypes = window.feeTypes.filter(type => 
            type.name.toLowerCase().includes(searchTerm)
        );

        // Clear current list
        feeTypeList.innerHTML = '';

        // Add filtered items
        filteredTypes.forEach(type => {
            const item = document.createElement('div');
            item.className = 'fee-type-item';
            item.textContent = type.name;
            item.dataset.amount = type.amount;

            item.addEventListener('click', function() {
                document.getElementById('fee-type-search').value = type.name;
                document.getElementById('fee-amount').value = type.amount;
                feeTypeList.style.display = 'none';
            });

            feeTypeList.appendChild(item);
        });

        // Add "Custom Fee" option
        const customItem = document.createElement('div');
        customItem.className = 'fee-type-item custom-fee';
        customItem.textContent = '+ Add Custom Fee';

        customItem.addEventListener('click', function() {
            document.getElementById('fee-type-search').value = 'Custom Fee';
            document.getElementById('fee-amount').value = '';
            document.getElementById('fee-amount').focus();
            feeTypeList.style.display = 'none';
        });

        feeTypeList.appendChild(customItem);
    }
}

function navigateFeeTypeList(e) {
    const feeTypeList = document.getElementById('fee-type-list');

    if (feeTypeList && feeTypeList.style.display === 'block') {
        const items = feeTypeList.querySelectorAll('.fee-type-item');

        if (items.length > 0) {
            // Find the currently selected item
            const selectedItem = feeTypeList.querySelector('.fee-type-item.selected');
            let index = -1;

            if (selectedItem) {
                // Get the index of the selected item
                const itemsArray = Array.from(items);
                index = itemsArray.indexOf(selectedItem);

                // Remove the selected class
                selectedItem.classList.remove('selected');
            }

            if (e.key === 'ArrowDown') {
                // Move selection down
                index = (index + 1) % items.length;
                items[index].classList.add('selected');
                items[index].scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'ArrowUp') {
                // Move selection up
                index = (index - 1 + items.length) % items.length;
                items[index].classList.add('selected');
                items[index].scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'Enter') {
                // Select the highlighted item
                if (index !== -1) {
                    const selectedItem = items[index];
                    document.getElementById('fee-type-search').value = selectedItem.textContent;

                    if (selectedItem.classList.contains('custom-fee')) {
                        document.getElementById('fee-amount').value = '';
                        document.getElementById('fee-amount').focus();
                    } else {
                        document.getElementById('fee-amount').value = selectedItem.dataset.amount;
                    }

                    feeTypeList.style.display = 'none';
                }
                e.preventDefault();
            } else if (e.key === 'Escape') {
                // Close the dropdown
                feeTypeList.style.display = 'none';
                e.preventDefault();
            }
        }
    }
}

function updateFeeItemsList() {
    const feeItems = document.querySelectorAll('#fee-items-list .card');

    if (feeItems.length > 0) {
        document.getElementById('empty-fee-message').style.display = 'none';
        document.getElementById('fee-total-section').style.display = 'block';
        document.getElementById('payment-section').style.display = 'block';
    } else {
        document.getElementById('empty-fee-message').style.display = 'block';
        document.getElementById('fee-total-section').style.display = 'none';
        document.getElementById('payment-section').style.display = 'none';
    }
}

function updateFeeTotal() {
    const feeItems = document.querySelectorAll('#fee-items-list .card');
    let total = 0;

    feeItems.forEach(item => {
        const amountText = item.querySelector('.d-flex.align-items-center div').textContent;
        const amount = parseFloat(amountText.replace('₹', ''));
        total += amount;
    });

    document.getElementById('fee-total-amount').textContent = `₹${total.toFixed(2)}`;

    // Update the fee items list view
    updateFeeItemsList();
}

function clearAllFeeItems() {
    if (confirm('Are you sure you want to clear all fee items?')) {
        const feeItemsList = document.getElementById('fee-items-list');
        feeItemsList.innerHTML = '';
        updateFeeTotal();
    }
}

function togglePaymentDetails() {
    const paymentMethod = document.getElementById('payment-method').value;
    const chequeDetails = document.getElementById('cheque-details');

    if (paymentMethod === 'cheque') {
        chequeDetails.style.display = 'block';
    } else {
        chequeDetails.style.display = 'none';
    }
}

function processPayment() {
    const studentId = document.getElementById('student-id').value;
    const studentName = document.getElementById('student-name').textContent;
    const studentClass = document.getElementById('student-class').textContent;
    const feeItems = document.querySelectorAll('#fee-items-list .card');
    const paymentMethod = document.getElementById('payment-method').value;

    if (feeItems.length === 0) {
        showAlert('Please add at least one fee item', 'warning');
        return;
    }

    // Gather fee items
    const items = [];
    let totalAmount = 0;

    feeItems.forEach(item => {
        const feeType = item.querySelector('strong').textContent;
        const amountText = item.querySelector('.d-flex.align-items-center div').textContent;
        const amount = parseFloat(amountText.replace('₹', ''));

        items.push({
            fee_type: feeType,
            amount: amount
        });

        totalAmount += amount;
    });

    // Check for cheque details if payment method is cheque
    if (paymentMethod === 'cheque') {
        const chequeNumber = document.getElementById('cheque-number').value;
        const chequeDate = document.getElementById('cheque-date').value;
        const bankName = document.getElementById('bank-name').value;

        if (!chequeNumber || !chequeDate || !bankName) {
            showAlert('Please fill in all cheque details', 'warning');
            return;
        }
    }

    // Show processing message
    showAlert('Processing payment...', 'info');

    // Create payment data object
    const paymentData = {
        student_id: studentId,
        student_name: studentName,
        class: studentClass,
        payment_method: paymentMethod,
        amount: totalAmount,
        items: items,
        date: new Date().toISOString().split('T')[0]
    };

    // If payment method is cheque, add cheque details
    if (paymentMethod === 'cheque') {
        paymentData.cheque_number = document.getElementById('cheque-number').value;
        paymentData.cheque_date = document.getElementById('cheque-date').value;
        paymentData.bank_name = document.getElementById('bank-name').value;
    }

    // Send payment data to server
    fetch('/api/process-fee-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('Payment processed successfully', 'success');

            // Generate receipt number
            const receiptNumber = data.receipt_number || `RCPT-${Date.now()}`;

            // Show receipt modal or redirect to receipt page
            // For demo, we'll just show a confirmation
            alert(`Receipt Generated Successfully!\nReceipt Number: ${receiptNumber}\nAmount: ₹${totalAmount.toFixed(2)}`);

            // Clear the form
            resetForm();

            // If there's a transaction history function, refresh it
            if (typeof loadTransactionHistory === 'function') {
                loadTransactionHistory(studentId);
            }
        } else {
            showAlert('Error processing payment: ' + data.message, 'danger');
        }
    })
    .catch(error => {
        console.error('Payment processing error:', error);
        showAlert('Error processing payment', 'danger');
    });
}

function resetForm() {
    // Clear fee items
    document.getElementById('fee-items-list').innerHTML = '';

    // Reset form fields
    document.getElementById('fee-type-search').value = '';
    document.getElementById('fee-amount').value = '';
    document.getElementById('payment-method').value = 'cash';
    document.getElementById('cheque-number').value = '';
    document.getElementById('cheque-date').value = '';
    document.getElementById('bank-name').value = '';

    // Hide sections
    document.getElementById('cheque-details').style.display = 'none';

    // Update totals
    updateFeeTotal();
}

function populateAllFeeTypes() {
    const feeTypeList = document.getElementById('fee-type-list');

    if (feeTypeList && window.feeTypes) {
        // Clear current list
        feeTypeList.innerHTML = '';

        // Add all fee types
        window.feeTypes.forEach(type => {
            const item = document.createElement('div');
            item.className = 'fee-type-item';
            item.textContent = type.name;
            item.dataset.amount = type.amount;

            item.addEventListener('click', function() {
                document.getElementById('fee-type-search').value = type.name;
                document.getElementById('fee-amount').value = type.amount;
                feeTypeList.style.display = 'none';
            });

            feeTypeList.appendChild(item);
        });

        // Add "Custom Fee" option
        const customItem = document.createElement('div');
        customItem.className = 'fee-type-item custom-fee';
        customItem.textContent = '+ Add Custom Fee';

        customItem.addEventListener('click', function() {
            document.getElementById('fee-type-search').value = 'Custom Fee';
            document.getElementById('fee-amount').value = '';
            document.getElementById('fee-amount').focus();
            feeTypeList.style.display = 'none';
        });

        feeTypeList.appendChild(customItem);
    }
}

function loadTransactionHistory(studentId) {
    console.log("Loading transaction history for student:", studentId);

    // In a real application, you would fetch transaction history from the server
    // For demo purposes, we'll create some sample data
    const sampleTransactions = [
        {
            receipt_no: 'RCPT-001',
            date: '2023-03-15',
            amount: 12500,
            payment_method: 'Cash'
        },
        {
            receipt_no: 'RCPT-002',
            date: '2023-06-10',
            amount: 8500,
            payment_method: 'Bank Transfer'
        },
        {
            receipt_no: 'RCPT-003',
            date: '2023-09-05',
            amount: 10000,
            payment_method: 'Cheque'
        }
    ];

    const transactionHistoryBody = document.getElementById('transaction-history-body');

    if (transactionHistoryBody) {
        // Clear current history
        transactionHistoryBody.innerHTML = '';

        // Add sample transactions
        sampleTransactions.forEach(transaction => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${transaction.receipt_no}</td>
                <td>${transaction.date}</td>
                <td>₹${transaction.amount.toFixed(2)}</td>
                <td>${transaction.payment_method}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary">
                        <i class="fas fa-file-alt me-1"></i> View
                    </button>
                </td>
            `;

            transactionHistoryBody.appendChild(row);
        });

        // Show transaction history section
        document.getElementById('transaction-history-section').style.display = 'block';
    }
}

function showStudentInfoSection() {
    document.getElementById('student-info-section').style.display = 'block';
}

function hideStudentInfoSection() {
    document.getElementById('student-info-section').style.display = 'none';
    document.getElementById('fee-btn-section').style.display = 'none';

    // Clear student data
    document.getElementById('student-id').value = '';
    document.getElementById('student-name').textContent = '-';
    document.getElementById('student-class').textContent = '-';
    document.getElementById('student-admission-no').textContent = '-';
    document.getElementById('parent-name').textContent = '-';

    // Clear fee items
    document.getElementById('fee-items-list').innerHTML = '';
    updateFeeTotal();

    // Hide fee section
    hideFeeSection();

    // Hide transaction history
    if (document.getElementById('transaction-history-section')) {
        document.getElementById('transaction-history-section').style.display = 'none';
    }

    // Disable Reports button
    const openReportsBtn = document.getElementById('open-reports-modal');
    if (openReportsBtn) {
        openReportsBtn.disabled = true;
    }
}

function showFeeSection() {
    document.getElementById('fee-collection-section').style.display = 'block';
    updateFeeItemsList();
}

function hideFeeSection() {
    document.getElementById('fee-collection-section').style.display = 'none';
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');

    if (!alertContainer) {
        // Create alert container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'alert-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.maxWidth = '300px';
        document.body.appendChild(container);
    }

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    document.getElementById('alert-container').appendChild(alert);

    // Auto-close after 5 seconds
    setTimeout(() => {
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}