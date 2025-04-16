document.addEventListener('DOMContentLoaded', function() {
    // Exam table search/filter
    const examSearch = document.getElementById('examSearch');
    const examTable = document.getElementById('examTable');
    const examRows = examTable ? examTable.querySelectorAll('tbody tr') : [];
    
    // Filter by class
    const classFilter = document.getElementById('classFilter');
    
    // Alert container
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    
    // Add Exam form
    const addExamForm = document.getElementById('addExamForm');
    
    // Add Exam Results form
    const addExamResultsForm = document.getElementById('addExamResultsForm');
    
    // Initialize event listeners
    if (examSearch) {
        examSearch.addEventListener('input', filterExamTable);
    }
    
    if (classFilter) {
        classFilter.addEventListener('change', filterExamTable);
    }
    
    if (addExamForm) {
        addExamForm.addEventListener('submit', function(e) {
            // Form validation is handled by browser
            showAlert('Exam added successfully!', 'success');
        });
    }
    
    if (addExamResultsForm) {
        // Mark all with same grade buttons
        document.querySelectorAll('.mark-grade-btn').forEach(button => {
            button.addEventListener('click', function() {
                const grade = this.dataset.grade;
                document.querySelectorAll('select[name^="grade_"]').forEach(select => {
                    select.value = grade;
                });
            });
        });
        
        addExamResultsForm.addEventListener('submit', function(e) {
            // Form validation is handled by browser
            showAlert('Exam results added successfully!', 'success');
        });
    }
    
    // Filter exam table based on search input and class filter
    function filterExamTable() {
        const searchText = examSearch ? examSearch.value.toLowerCase() : '';
        const selectedClass = classFilter ? classFilter.value : 'all';
        
        examRows.forEach(row => {
            const examName = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
            const examClass = row.querySelector('td:nth-child(2)').textContent;
            const examSubject = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const examDate = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            
            const searchMatch = examName.includes(searchText) || 
                               examSubject.includes(searchText) || 
                               examDate.includes(searchText);
                               
            const classMatch = selectedClass === 'all' || examClass === selectedClass;
            
            if (searchMatch && classMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    // Generate subject options
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
        const classSelect = document.getElementById('class');
        if (classSelect) {
            classSelect.addEventListener('change', function() {
                const selectedClass = this.value;
                
                // Clear existing options
                subjectSelect.innerHTML = '<option value="">Select Subject</option>';
                
                if (!selectedClass) return;
                
                // Add subjects based on class
                const subjects = {
                    'Class 1': ['English', 'Mathematics', 'Environmental Science', 'Hindi', 'Art & Craft'],
                    'Class 2': ['English', 'Mathematics', 'Environmental Science', 'Hindi', 'Art & Craft'],
                    'Class 3': ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Art & Craft'],
                    'Class 4': ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Computer Science'],
                    'Class 5': ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Computer Science'],
                    'Class 6': ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Sanskrit', 'Computer Science'],
                    'Class 7': ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Sanskrit', 'Computer Science'],
                    'Class 8': ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Sanskrit', 'Computer Science'],
                    'Class 9': ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi/Sanskrit', 'Computer Science'],
                    'Class 10': ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi/Sanskrit', 'Computer Science'],
                    'Class 11': ['English', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science'],
                    'Class 12': ['English', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science']
                };
                
                if (subjects[selectedClass]) {
                    subjects[selectedClass].forEach(subject => {
                        const option = document.createElement('option');
                        option.value = subject;
                        option.textContent = subject;
                        subjectSelect.appendChild(option);
                    });
                }
            });
        }
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
