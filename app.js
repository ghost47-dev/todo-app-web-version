function toDict(title, priority, date, status) {
    let task = {
        "title": title,
        "priority": priority,
        "date": date,
        "status": status
    }
    return task;
}
let updatedIndex = null;
let tasks = [];
const storedTasks = localStorage.getItem("tasks")
if (storedTasks)
    tasks = JSON.parse(storedTasks);
displayTasks();

function checkForm() {
    const title = document.getElementById("task-title").value.trim();
    const priority = document.getElementById("task-priority").value;
    const date = document.getElementById("task-date").value;

    isFormFilled = title && priority && date;

    const button = document.getElementById("add-task-btn");
    const hint = document.getElementById("enter-hint");
    button.disabled = !isFormFilled;

    hint.style.opacity = isFormFilled ? "1" : "0";
}

function validateInput(title, date) {
    if (!title || title.trim().length == 0) {
        alert("Please enter a task's title!");
        return false;
    }

    if (!date) {
        alert("Please enter a date!");
        return false;
    }

    return true;
}

function resetForm() {
    document.getElementById("task-title").value = "";
    document.getElementById("task-priority").value = "1";
    document.getElementById("task-date").value = "";
}

function addTask() {
    const title = document.getElementById("task-title").value;
    const priority = document.getElementById("task-priority").value;
    const date = document.getElementById("task-date").value;
    
    if (!validateInput(title, date)) return;

    const task = toDict(title, priority, date, false);
    tasks.push(task);
    save();
    displayTasks();

    resetForm();
    document.getElementById("enter-hint").style.opacity = "0";

    document.getElementById("task-title").focus();

}

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks() {
    const ulElement = document.getElementById("task-list");
    ulElement.innerHTML = "";

    tasks.forEach((element, index) => {
        const newLi = document.createElement('li');
        const checkbox = document.createElement('input');
        const span = document.createElement('span');
        const deleteButton = document.createElement('button');
        const editButton = document.createElement('button');

        checkbox.type = "checkbox";
        checkbox.setAttribute("data-index", index);
        checkbox.checked = element.status;

        deleteButton.innerHTML = "Delete";
        deleteButton.setAttribute("data-index", index);
        deleteButton.setAttribute("class", "delete-btn");

        editButton.innerHTML = "Edit";
        editButton.setAttribute("data-index", index);
        editButton.setAttribute("class", "edit-btn");

        span.innerHTML = ` ${element['title']} - <b>P${element['priority']}</b> due for ${element['date']}`;
        span.style.textDecoration = element.status ? "line-through" : "none";
        span.style.opacity = element.status ? "0.6" : "1";

        checkbox.addEventListener("change", (e) => {
            const index = e.target.getAttribute("data-index");
            tasks[index].status = e.target.checked;
            const span = e.target.nextSibling;
            span.style.textDecoration = e.target.checked ? "line-through" : "none";
            span.style.opacity = e.target.checked ? "0.6" : "1";
            save();
        })

        deleteButton.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            tasks.splice(index, 1);
            save();
            displayTasks();
        })

        editButton.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            const title = tasks[index].title;
            const date = tasks[index].date;
            const priority = tasks[index].priority;

            document.getElementById("task-title").value = title;
            document.getElementById("task-date").value = date;
            document.getElementById("task-priority").value = priority;

            document.getElementById("update-task-btn").style.display = "inline-block";
            document.getElementById("cancel-update-btn").style.display = "inline-block";
            document.getElementById("add-task-btn").style.display = "none";

            updatedIndex = index;
            

        })

        newLi.appendChild(checkbox);
        newLi.appendChild(span);
        newLi.appendChild(editButton);
        newLi.appendChild(deleteButton);


        ulElement.appendChild(newLi);

    });
}

function cancelUpdate() {
    document.getElementById("update-task-btn").style.display = "none";
    document.getElementById("cancel-update-btn").style.display = "none";
    document.getElementById("add-task-btn").style.display = "inline-block";
    document.getElementById("task-title").focus();
    resetForm();
}

function showFeedback(msg) {
    const el = document.getElementById("feedback-msg");
    el.innerHTML = msg;
    setTimeout(() => {el.innerHTML = "";}, 1500);
}

function updateTask() {
    const title = document.getElementById("task-title").value;
    const date = document.getElementById("task-date").value;
    const priority = document.getElementById("task-priority").value;

    if (!validateInput(title, date)) return;

    tasks[updatedIndex].title = title;
    tasks[updatedIndex].date = date;
    tasks[updatedIndex].priority = priority;

    document.getElementById("update-task-btn").style.display = "none";
    document.getElementById("cancel-update-btn").style.display = "none";
    document.getElementById("add-task-btn").style.display = "inline-block";
    document.getElementById("task-title").focus();

    resetForm();
    save();
    displayTasks();
    showFeedback("Task updated!")
}

document.getElementById("add-task-btn").addEventListener("click", addTask);
document.getElementById("task-title").addEventListener("input", checkForm)
document.getElementById("task-date").addEventListener("change", checkForm)

document.addEventListener("keydown", (e) => {
    if (e.key == 'Enter' && isFormFilled) {
        addTask();
    }
})

document.getElementById("update-task-btn").addEventListener("click", updateTask);
document.getElementById("cancel-update-btn").addEventListener("click", cancelUpdate);