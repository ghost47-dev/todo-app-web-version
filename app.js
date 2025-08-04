function to_dict(title, priority, date, status) {
    let task = {
        "title": title,
        "priority": priority,
        "date": date,
        "status": status
    }
    return task;
}
tasks = []
function add_task() {
    let title = document.getElementById("task-title").value;
    let priority = document.getElementById("task-priority").value;
    let date = document.getElementById("task-date").value;
    
    if (!title || !date) {
        alert("Please fill in all fields!");
        return;
    }

    console.log(title, priority, date);
    task = to_dict(title, priority, date, false);
    tasks.push(task);
    display_tasks();
}

function display_tasks() {
    const ulElement = document.getElementById("task-list");
    ulElement.innerHTML = "";
    tasks.forEach(element => {
        const newLi = document.createElement('li');
        newLi.innerHTML = `${element['title']} - <b>P${element['priority']}</b> due for ${element['date']}`;
        ulElement.appendChild(newLi);
    });
}

document.getElementById("add-task-btn").addEventListener("click", add_task);
