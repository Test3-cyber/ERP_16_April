document.addEventListener('DOMContentLoaded', function() {
    // Initialize DataTable for students
    if (document.getElementById('studentsTable')) {
        $('#studentsTable').DataTable({
            responsive: true,
            "order": [[0, "asc"]],
            "pageLength": 10,
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
        });
    }
    
    // Filter students by class
    const classFilter = document.getElementById('classFilter');
    if (classFilter) {
        classFilter.addEventListener('change', function() {
            const selectedClass = this.value;
            const rows = document.querySelectorAll('#studentsTable tbody tr');
            
            rows.forEach(row => {
                const studentClass = row.querySelector('td:nth-child(6)').textContent;
                if (selectedClass === 'all' || studentClass === selectedClass) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Student form validation
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', function(event) {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const className = document.getElementById('class').value;
            const section = document.getElementById('section').value;
            const dob = document.getElementById('dob').value;
            const parentName = document.getElementById('parentName').value;
            const contact = document.getElementById('contact').value;
            
            if (!firstName || !lastName || !className || !section || !dob || !parentName || !contact) {
                event.preventDefault();
                showAlert('Please fill all required fields.', 'danger');
            }
        });
    }
    
    // Generate admission number
    const generateAdmissionNo = document.getElementById('generateAdmissionNo');
    const admissionNoInput = document.getElementById('admissionNo');
    
    if (generateAdmissionNo && admissionNoInput) {
        generateAdmissionNo.addEventListener('click', function() {
            const currentYear = new Date().getFullYear().toString().substr(-2);
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            admissionNoInput.value = `ADM${currentYear}${randomNum}`;
        });
    }
    
    // Generate roll number
    const generateRollNo = document.getElementById('generateRollNo');
    const rollNoInput = document.getElementById('rollNo');
    const classSelect = document.getElementById('class');
    const sectionSelect = document.getElementById('section');
    
    if (generateRollNo && rollNoInput && classSelect && sectionSelect) {
        generateRollNo.addEventListener('click', function() {
            const classValue = classSelect.value.replace(/\D/g, '');
            const sectionValue = sectionSelect.value;
            const randomNum = Math.floor(10 + Math.random() * 90);
            rollNoInput.value = `${classValue}${sectionValue}${randomNum}`;
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
