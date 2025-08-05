function toDict(title, priority, date, status) {
    let task = {
        "title": title,
        "priority": priority,
        "date": date,
        "status": status
    }
    return task;
}

storedTasks = localStorage.getItem("tasks")
if (storedTasks)
    tasks = JSON.parse(storedTasks);
else
    tasks = []
displayTasks();

function addTask() {
    let title = document.getElementById("task-title").value;
    let priority = document.getElementById("task-priority").value;
    let date = document.getElementById("task-date").value;
    
    if (!title || !date) {
        alert("Please fill in all fields!");
        return;
    }

    task = toDict(title, priority, date, false);
    tasks.push(task);
    save();
    displayTasks();
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
        const deleteButoon = document.createElement('button');

        checkbox.type = "checkbox";
        checkbox.setAttribute("data-index", index);
        checkbox.checked = element.status;

        deleteButoon.innerHTML = "Delete";
        deleteButoon.setAttribute("data-index", index);

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

        deleteButoon.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            tasks.splice(index, 1);
            displayTasks();
            save();
        })

        newLi.appendChild(checkbox);
        newLi.appendChild(span);
        newLi.appendChild(deleteButoon);

        ulElement.appendChild(newLi);

    });
}

document.getElementById("add-task-btn").addEventListener("click", addTask);

