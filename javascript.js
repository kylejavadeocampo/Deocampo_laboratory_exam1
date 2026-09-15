fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('nav-placeholder').innerHTML = data;
    }
);

// table logics
const taskForm = document.getElementById("task-form")
const tableBody = document.getElementById("tableTaskBody");


function getTasksFromLocalStorage() {
    const rawData = localStorage.getItem("tasks");

    if (!rawData || rawData === "undefined") {
        return [];
    }

    try {
        const parsed = JSON.parse(rawData);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch (error) {}

}

function saveTasksToLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {

    const tasks = getTasksFromLocalStorage();

    if (tasks.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No tasks available.</td></tr>`;
        return;
    }

    tableBody.innerHTML = tasks.map((task, index) => `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${task.title}</td>
            <td>${task.dueDate}</td>
            <td>${task.priority}</td>
            <td>
                <span class="badge ${task.status === 'Done' ? 'bg-success' : 'bg-secondary'}">
                    ${task.status}
                </span>
            </td>
            <td class="text-nowrap">
                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-success" onclick="toggleStatus(${task.id})">Done</button>
                    <button type="button" class="btn btn-primary">Edit</button>
                    <button type="button" class="btn btn-danger" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join("");
}

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const tasks = getTasksFromLocalStorage();

    const newTask = {
        id: tasks.length + 1,
        title: document.getElementById("task-input").value,
        dueDate: document.getElementById("task-date").value,
        priority: document.getElementById("task-priority").value,
        status: "Pending"
    };

    console.log(newTask);

    tasks.push(newTask);
    saveTasksToLocalStorage(tasks);

    taskForm.reset();
    renderTasks();
    renderKpis();
});

function toggleStatus(id) {
    console.log("1");
    const tasks = getTasksFromLocalStorage();
    const task = tasks.find(t => t.id === id);

    console.log("2");
    if (task) {
        console.log("3");
        task.status = task.status === "Done" ? "Pending" : "Done";
        saveTasksToLocalStorage(tasks);
        renderTasks();
    }
}

function deleteTask(id) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.id !== id);
    saveTasksToLocalStorage(tasks);
    renderTasks();
}

// kpi renderings
function renderKpis() {
    const total = document.getElementById("total-tasks");
    const completed = document.getElementById("completed-tasks");
    const pending = document.getElementById("pending-tasks");

    const tasks = getTasksFromLocalStorage();

    total.textContent = tasks.length;
    completed.textContent = countKeys("Done")
    pending.textContent = countKeys("Pending")

}

function countKeys(keyValue) {
    const tasks = getTasksFromLocalStorage();
    let count = 0;

    for (const [key, value] of Object.entries(tasks)) {
        console.log(value)
        if (keyValue == value.status) {
            count += 1;
        }
    }

    console.log(count);
    return count;
}

renderTasks();
renderKpis();
