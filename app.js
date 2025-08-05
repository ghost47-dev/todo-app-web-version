function toDict(title, priority, date, status) {
    let task = {
        "title": title,
        "priority": priority,
        "date": date,
        "status": status
    }
    return task;
}
tasks = []
function addTask() {
    let title = document.getElementById("task-title").value;
    let priority = document.getElementById("task-priority").value;
    let date = document.getElementById("task-date").value;
    
    if (!title || !date) {
        alert("Please fill in all fields!");
        return;
    }

    console.log(title, priority, date);
    task = toDict(title, priority, date, false);
    tasks.push(task);
    displayTasks();
}

function displayTasks() {
    const ulElement = document.getElementById("task-list");
    ulElement.innerHTML = "";

    tasks.forEach((element, index) => {
        const newLi = document.createElement('li');
        const checkbox = document.createElement('input');
        const span = document.createElement('span');

        checkbox.type = "checkbox";
        checkbox.setAttribute("data-index", index);
        checkbox.checked = element.status;

        span.innerHTML = ` ${element['title']} - <b>P${element['priority']}</b> due for ${element['date']}`;
        span.style.textDecoration = element.status ? "line-through" : "none";

        newLi.appendChild(checkbox);
        newLi.appendChild(span);

        ulElement.appendChild(newLi);

        document.querySelectorAll("ul li input").forEach(input => {
            input.addEventListener("change", (e) => {
                const index = e.target.getAttribute("data-index");
                console.log(index);
                tasks[index].status = e.target.checked;

                const span = e.target.nextSibling;
                if (e.target.checked) 
                    span.style.textDecoration = "line-through";
                else
                    span.style.textDecoration = "none";
                
            })
        })
    });
}

document.getElementById("add-task-btn").addEventListener("click", addTask);

