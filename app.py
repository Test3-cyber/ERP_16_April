
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', 
                         stats={
                             'students_count': 0,
                             'staff_count': 0,
                             'total_revenue': 0,
                             'attendance_percentage': 0
                         },
                         recent_activities=[],
                         notices=[],
                         events=[],
                         charts={})

@app.route('/students')
def students():
    return render_template('students.html', students=[])

@app.route('/staff')
def staff():
    return render_template('staff.html', staff=[])

@app.route('/attendance')
def attendance():
    return render_template('attendance.html', classes={})

@app.route('/academics')
def academics():
    return render_template('academics.html')

@app.route('/fee-collection')
def fee_collection():
    return render_template('fee-collection.html')

@app.route('/inventory')
def inventory():
    return render_template('inventory.html')

@app.route('/finance')
def finance():
    return render_template('finance.html')

@app.route('/reports')
def reports():
    return render_template('reports.html')

@app.route('/events')
def events():
    return render_template('events.html', events=[])

@app.route('/notices')
def notices():
    return render_template('notices.html')

@app.route('/download-zip')
def download_zip():
    return "Download functionality coming soon"

@app.route('/api/get-classes')
def get_classes():
    try:
        import pandas as pd
        df = pd.read_csv('data/Master_list/Student_Master_List.csv')
        # Get unique combinations of Class and Section
        unique_classes = df[['Class', 'Section']].drop_duplicates()
        classes = []
        for _, row in unique_classes.iterrows():
            classes.append({
                'id': f"{row['Class']}-{row['Section']}", 
                'class_name': row['Class'],
                'section': row['Section']
            })
        return jsonify(classes)
    except Exception as e:
        print(f"Error loading classes: {str(e)}")
        return jsonify([])

@app.route('/api/get-students/<class_name>')
def get_students(class_name):
    try:
        import pandas as pd
        df = pd.read_csv('data/Master_list/Student_Master_List.csv')
        print(f"Loading students for class: {class_name}")
        
        # Filter students by exact class match
        filtered_df = df[df['Class'] == class_name]
        students = []
        
        for _, row in filtered_df.iterrows():
            students.append({
                'id': str(row['Student ID']),
                'name': f"{row['First Name']} {row['Last Name']}",
                'roll_no': str(row['Roll Number'])
            })
            
        print(f"Found {len(students)} students")
        print("Available classes:", df['Class'].unique())
        return jsonify(students)
    except Exception as e:
        print(f"Error loading students: {str(e)}")
        return jsonify([])

@app.route('/api/get-student-details/<student_id>')
def get_student_details(student_id):
    try:
        import pandas as pd
        df = pd.read_csv('data/Master_list/Student_Master_List.csv')
        
        # Find student by ID
        student_data = df[df['Student ID'] == int(student_id)].iloc[0]
        
        student = {
            'id': str(student_data['Student ID']),
            'first_name': student_data['First Name'],
            'last_name': student_data['Last Name'],
            'class': student_data['Class'],
            'section': student_data['Section'],
            'admission_no': student_data['Admission Number'],
            'roll_no': str(student_data['Roll Number']),
            'parent_name': student_data['Father Name'],
            'contact': str(student_data['Primary Contact'])
        }
        return jsonify(student)
    except Exception as e:
        print(f"Error getting student details: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-fee-types')
def get_fee_types():
    try:
        # Sample fee types data
        fee_types = [
            {'id': '1', 'name': 'Tuition Fee', 'amount': 5000},
            {'id': '2', 'name': 'Library Fee', 'amount': 1000},
            {'id': '3', 'name': 'Lab Fee', 'amount': 1500},
            {'id': '4', 'name': 'Sports Fee', 'amount': 800}
        ]
        return jsonify(fee_types)
    except Exception as e:
        return jsonify([])
    try:
        # Read from CSV file
        with open('data/csv/fee_types.csv', 'r') as f:
            fee_types = []
            for line in f.readlines()[1:]:  # Skip header
                name, amount = line.strip().split(',')
                fee_types.append({
                    'name': name,
                    'amount': float(amount)
                })
        return jsonify(fee_types)
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
