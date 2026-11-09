
// ดึงข้อมูล HTML ที่ต้องใช้งาน
const assignmentForm = document.getElementById("assignmentForm");
const assignmentList = document.getElementById("assignmentList");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

// โหลดข้อมูลเก่าจาก LocalStorage
let assignments = JSON.parse(localStorage.getItem("assignments")) || [];

// บันทึกข้อมูลลงใน LocalStorage
function saveAssignments() {
    localStorage.setItem("assignments", JSON.stringify(assignments));
}

// แสดงรายการการบ้าน
function displayAssignments() {
    assignmentList.innerHTML = "";

    if (assignments.length === 0) {
        assignmentList.innerHTML =
            '<p class="empty">ยังไม่มีรายการการบ้าน</p>';
    }

    assignments.forEach((assignment) => {
        const item = document.createElement("div");
        item.className = assignment.completed
            ? "assignment-item completed"
            : "assignment-item";

        item.innerHTML = `
            <div>
                <h3>${escapeHTML(assignment.title)}</h3>
                <p>วิชา: ${escapeHTML(assignment.subject)}</p>
                <p>กำหนดส่ง: ${assignment.dueDate}</p>
                <span class="status ${assignment.completed ? "done" : ""}">
                    ${assignment.completed ? "ส่งแล้ว" : "ยังไม่ส่ง"}
                </span>
            </div>

            <div class="actions">
                <button class="complete-btn" data-action="toggle">
                    ${assignment.completed ? "ยกเลิกการส่ง" : "ส่งงานแล้ว"}
                </button>
                <button class="delete-btn" data-action="delete">
                    ลบ
                </button>
            </div>
        `;

        item.querySelectorAll("button").forEach((button) => {
            button.addEventListener("click", () => {
                if (button.dataset.action === "toggle") {
                    assignment.completed = !assignment.completed;
                }

                if (button.dataset.action === "delete") {
                    assignments = assignments.filter(
                        (a) => a.id !== assignment.id
                    );
                }

                saveAssignments();
                displayAssignments();
            });
        });

        assignmentList.appendChild(item);
    });

    // อัปเดตจำนวนการบ้าน
    totalCount.textContent = assignments.length;

    pendingCount.textContent = assignments.filter(
        (a) => !a.completed
    ).length;

    completedCount.textContent = assignments.filter(
        (a) => a.completed
    ).length;
}

// ป้องกันข้อความที่ผู้ใช้กรอกกลายเป็น HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
}

// เพิ่มการบ้านใหม่
assignmentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const subject = document.getElementById("subject").value.trim();
    const title = document.getElementById("title").value.trim();
    const dueDate = document.getElementById("dueDate").value;

    if (!subject || !title || !dueDate) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
    }

    assignments.push({
        id: Date.now(),
        subject: subject,
        title: title,
        dueDate: dueDate,
        completed: false
    });

    saveAssignments();
    displayAssignments();

    assignmentForm.reset();

    alert("เพิ่มการบ้านเรียบร้อยแล้ว!");
});

// แสดงข้อมูลเมื่อเปิดเว็บไซต์
displayAssignments();
