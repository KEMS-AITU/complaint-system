import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
input_file = os.path.join(BASE_DIR, "students.json")

with open(input_file, "r", encoding="utf-8") as file:
    students = json.load(file)

for student in students:
    grades = student["grades"]
    student["average_grade"] = sum(grades) / len(grades)

output_folder = os.path.join(BASE_DIR, "output_for_task2")
os.makedirs(output_folder, exist_ok=True)

output_file = os.path.join(output_folder, "students_updated.json")
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(students, file, indent=4, ensure_ascii=False)

print(f"Updated data has been written to {output_file}")
