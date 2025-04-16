document.addEventListener('DOMContentLoaded', function() {
    // Initialize DataTable for staff
    if (document.getElementById('staffTable')) {
        $('#staffTable').DataTable({
            responsive: true,
            "order": [[0, "asc"]],
            "pageLength": 10,
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
        });
    }
    
    // Filter staff by department or role
    const departmentFilter = document.getElementById('departmentFilter');
    const roleFilter = document.getElementById('roleFilter');
    
    function filterStaff() {
        const selectedDepartment = departmentFilter ? departmentFilter.value : 'all';
        const selectedRole = roleFilter ? roleFilter.value : 'all';
        const rows = document.querySelectorAll('#staffTable tbody tr');
        
        rows.forEach(row => {
            const department = row.querySelector('td:nth-child(8)').textContent;
            const role = row.querySelector('td:nth-child(7)').textContent;
            
            const departmentMatch = selectedDepartment === 'all' || department === selectedDepartment;
            const roleMatch = selectedRole === 'all' || role === selectedRole;
            
            if (departmentMatch && roleMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    if (departmentFilter) {
        departmentFilter.addEventListener('change', filterStaff);
    }
    
    if (roleFilter) {
        roleFilter.addEventListener('change', filterStaff);
    }
    
    // Staff form validation
    const staffForm = document.getElementById('staffForm');
    if (staffForm) {
        staffForm.addEventListener('submit', function(event) {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const gender = document.getElementById('gender').value;
            const dob = document.getElementById('dob').value;
            const role = document.getElementById('role').value;
            const department = document.getElementById('department').value;
            const qualification = document.getElementById('qualification').value;
            const contact = document.getElementById('contact').value;
            
            if (!firstName || !lastName || !gender || !dob || !role || !department || !qualification || !contact) {
                event.preventDefault();
                showAlert('Please fill all required fields.', 'danger');
            }
        });
    }
    
    // Generate employee ID
    const generateEmployeeId = document.getElementById('generateEmployeeId');
    const employeeIdInput = document.getElementById('employeeId');
    const roleSelect = document.getElementById('role');
    
    if (generateEmployeeId && employeeIdInput && roleSelect) {
        generateEmployeeId.addEventListener('click', function() {
            const role = roleSelect.value;
            let prefix = 'STAFF';
            
            if (role === 'Teacher') prefix = 'TCH';
            else if (role === 'Admin') prefix = 'ADM';
            else if (role === 'Support Staff') prefix = 'SUP';
            
            const currentYear = new Date().getFullYear().toString().substr(-2);
            const randomNum = Math.floor(100 + Math.random() * 900);
            employeeIdInput.value = `${prefix}${currentYear}${randomNum}`;
        });
    }
    
    // Calculate age from DOB
    const dobInput = document.getElementById('dob');
    const ageDisplay = document.getElementById('ageDisplay');
    
    if (dobInput && ageDisplay) {
        dobInput.addEventListener('change', function() {
            const dob = new Date(this.value);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            
            ageDisplay.textContent = `${age} years`;
        });
    }
    
    // Set join date to today by default
    const joinDateInput = document.getElementById('joinDate');
    if (joinDateInput && !joinDateInput.value) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        joinDateInput.value = `${yyyy}-${mm}-${dd}`;
    }
    
    // Role-based salary suggestion
    const roleSalaryMap = {
        'Principal': '80000',
        'Vice Principal': '70000',
        'Teacher': '50000',
        'Admin': '45000',
        'Librarian': '40000',
        'Support Staff': '30000',
        'Driver': '25000',
        'Security': '20000'
    };
    
    const roleInputForSalary = document.getElementById('role');
    const salaryInput = document.getElementById('salary');
    
    if (roleInputForSalary && salaryInput) {
        roleInputForSalary.addEventListener('change', function() {
            const suggestedSalary = roleSalaryMap[this.value];
            if (suggestedSalary) {
                salaryInput.value = suggestedSalary;
            }
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
