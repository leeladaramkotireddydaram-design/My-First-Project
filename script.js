const nameInput = document.getElementById("studentName");
const dateInput = document.getElementById("attendanceDate");
const tableBody = document.querySelector("#attendanceTable tbody");

let students = [];
let rollno = 1;

window.onload = function () {
    const savedData = localStorage.getItem("students");

    if (savedData) {
        students = JSON.parse(savedData);
        rollno = students.length > 0 
            ? students[students.length - 1].roll + 1 
            : 1;
    }

    setTodayDate();
    displayStudents();
};

function setTodayDate() {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
    dateInput.addEventListener("change", displayStudents);
}

function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
}

function addStudent() {
    const name = nameInput.value.trim();

    if (name === "") {
        alert("Student name is required");
        return;
    }

    const student = {
        roll: rollno,
        name: name,
        attendance: {}
    };

    students.push(student);
    rollno++;
    nameInput.value = "";

    saveData();
    displayStudents();
}

function displayStudents() {
    tableBody.innerHTML = "";
    let selectedDate = dateInput.value;

    students.forEach((student) => {
        let status = student.attendance[selectedDate] || "Not Marked";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.roll}</td>
            <td>${student.name}</td>
            <td>
                <span>${status}</span>
                <button class="status-btn" onclick="markAttendance(${student.roll}, 'present')">Present</button>
                <button class="status-btn" onclick="markAttendance(${student.roll}, 'absent')">Absent</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function markAttendance(roll, status) {
    const selectedDate = dateInput.value;
    const student = students.find(s => s.roll === roll);

    if (student) {
        student.attendance[selectedDate] = status;
    }

    saveData();
    displayStudents();
}