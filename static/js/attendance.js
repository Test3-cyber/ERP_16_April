document.addEventListener('DOMContentLoaded', function() {
    // Class select for filtering
    const classFilterSelect = document.getElementById('classFilter');
    const sectionFilterSelect = document.getElementById('sectionFilter');
    const attendanceTable = document.getElementById('attendanceTable');
    const attendanceCards = document.querySelectorAll('.attendance-card');
    
    // Mark attendance buttons
    const markAttendanceButtons = document.querySelectorAll('.mark-attendance-btn');
    
    // Alert container
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    
    // Initialize classes object to store classes and sections
    const classes = {};
    
    // Populate classes object from attendance cards
    attendanceCards.forEach(card => {
        const classId = card.dataset.classId;
        if (!classId) return;
        
        const [className, section] = classId.split('-');
        
        if (!classes[className]) {
            classes[className] = new Set();
        }
        
        classes[className].add(section);
    });
    
    // Populate class filter select
    if (classFilterSelect) {
        classFilterSelect.innerHTML = '<option value="all">All Classes</option>';
        
        Object.keys(classes).sort().forEach(className => {
            const option = document.createElement('option');
            option.value = className;
            option.textContent = `Class ${className}`;
            classFilterSelect.appendChild(option);
        });
        
        // Event listener for class filter
        classFilterSelect.addEventListener('change', function() {
            const selectedClass = this.value;
            
            // Reset section filter
            sectionFilterSelect.innerHTML = '<option value="all">All Sections</option>';
            
            // Populate section filter based on selected class
            if (selectedClass !== 'all' && classes[selectedClass]) {
                Array.from(classes[selectedClass]).sort().forEach(section => {
                    const option = document.createElement('option');
                    option.value = section;
                    option.textContent = `Section ${section}`;
                    sectionFilterSelect.appendChild(option);
                });
            }
            
            // Filter attendance
            filterAttendance();
        });
        
        // Event listener for section filter
        sectionFilterSelect.addEventListener('change', filterAttendance);
    }
    
    // Mark attendance buttons event listeners
    markAttendanceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const classId = this.dataset.classId;
            if (!classId) return;
            
            // Redirect to mark attendance page
            window.location.href = `/mark-attendance/${classId}`;
        });
    });
    
    // Attendance form management
    const attendanceForm = document.getElementById('attendanceForm');
    const selectAllButton = document.getElementById('selectAllPresent');
    const markAbsentButton = document.getElementById('selectAllAbsent');
    
    if (attendanceForm) {
        if (selectAllButton) {
            selectAllButton.addEventListener('click', function(e) {
                e.preventDefault();
                const radioButtons = attendanceForm.querySelectorAll('input[type="radio"][value="Present"]');
                radioButtons.forEach(radio => {
                    radio.checked = true;
                });
            });
        }
        
        if (markAbsentButton) {
            markAbsentButton.addEventListener('click', function(e) {
                e.preventDefault();
                const radioButtons = attendanceForm.querySelectorAll('input[type="radio"][value="Absent"]');
                radioButtons.forEach(radio => {
                    radio.checked = true;
                });
            });
        }
        
        attendanceForm.addEventListener('submit', function(e) {
            // Validate form
            const unmarkedStudents = attendanceForm.querySelectorAll('.student-row').length - 
                                    attendanceForm.querySelectorAll('input[type="radio"]:checked').length;
            
            if (unmarkedStudents > 0) {
                e.preventDefault();
                showAlert(`Please mark attendance for all students. ${unmarkedStudents} student(s) unmarked.`, 'danger');
            } else {
                // Show success message
                showAlert('Attendance submitted successfully!', 'success');
            }
        });
    }
    
    // Function to filter attendance cards
    function filterAttendance() {
        const selectedClass = classFilterSelect.value;
        const selectedSection = sectionFilterSelect.value;
        
        attendanceCards.forEach(card => {
            const cardClassId = card.dataset.classId;
            if (!cardClassId) return;
            
            const [cardClass, cardSection] = cardClassId.split('-');
            
            const classMatch = selectedClass === 'all' || cardClass === selectedClass;
            const sectionMatch = selectedSection === 'all' || cardSection === selectedSection;
            
            if (classMatch && sectionMatch) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Function to show alerts
    function showAlert(message, type = 'info') {
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
