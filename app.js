function toDict(title, priority, date, status) {
    let task = {
        "title": title,
        "priority": priority,
        "date": date,
        "status": status
    }
    return task;
}
let tasks = [];
const storedTasks = localStorage.getItem("tasks")
if (storedTasks)
    tasks = JSON.parse(storedTasks);
displayTasks();

function addTask() {
    const title = document.getElementById("task-title").value;
    const priority = document.getElementById("task-priority").value;
    const date = document.getElementById("task-date").value;
    
    if (!title || !date) {
        alert("Please fill in all fields!");
        return;
    }

    const task = toDict(title, priority, date, false);
    tasks.push(task);
    save();
    displayTasks();

    document.getElementById("task-title").value = "";
    document.getElementById("task-priority").value = "1";
    document.getElementById("task-date").value = "";
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

        checkbox.type = "checkbox";
        checkbox.setAttribute("data-index", index);
        checkbox.checked = element.status;

        deleteButton.innerHTML = "Delete";
        deleteButton.setAttribute("data-index", index);

        span.innerHTML = ` ${element['title']} - <b>P${element['priority']}</b> due for ${element['date']}`;
        span.style.textDecoration = element.status ? "line-through" : "none";

        checkbox.addEventListener("change", (e) => {
            const index = e.target.getAttribute("data-index");
            tasks[index].status = e.target.checked;
            const span = e.target.nextSibling;
            if (e.target.checked) 
                span.style.textDecoration = "line-through";
            else
                span.style.textDecoration = "none";
            save();
        })

        deleteButton.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            tasks.splice(index, 1);
            save();
            displayTasks();
        })

        newLi.appendChild(checkbox);
        newLi.appendChild(span);
        newLi.appendChild(deleteButton);

        ulElement.appendChild(newLi);

    });
}

document.getElementById("add-task-btn").addEventListener("click", addTask);

