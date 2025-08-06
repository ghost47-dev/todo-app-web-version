(() => {
    const taskTitleInput = document.getElementById("task-title");
    const taskPriorityInput = document.getElementById("task-priority");
    const taskDateInput = document.getElementById("task-date");
    const addTaskBtn = document.getElementById("add-task-btn");
    const updateTaskBtn = document.getElementById("update-task-btn");
    const cancelUpdateBtn = document.getElementById("cancel-update-btn");
    const enterHint = document.getElementById("enter-hint");
    const feedbackMsg = document.getElementById("feedback-msg");
    const taskList = document.getElementById("task-list");

    let tasks = [];
    let updatedIndex = null;
    let isFormFilled = false;

    function createTaskObject(title, priority, date, status = false) {
        return { title, priority, date, status };
    }

    function loadTasks() {
        try {
            const stored = localStorage.getItem("tasks");
            tasks = stored ? JSON.parse(stored) : [];
        } catch (e) {
            tasks = [];
        }
    }

    function saveTasks() {
        try {
            localStorage.setItem("tasks", JSON.stringify(tasks));
        } catch (e) {
            showFeedback("Error saving tasks!");
        }
    }

    function validateInput(title, date) {
        if (!title.trim()) {
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
        taskTitleInput.value = "";
        taskPriorityInput.value = "1";
        taskDateInput.value = "";
        checkForm();
    }

    function checkForm() {
        isFormFilled = taskTitleInput.value.trim() && taskPriorityInput.value && taskDateInput.value;
        addTaskBtn.disabled = !isFormFilled;
        enterHint.style.opacity = isFormFilled ? "1" : "0";
    }

    function showFeedback(msg) {
        feedbackMsg.innerHTML = msg;
        setTimeout(() => { feedbackMsg.innerHTML = ""; }, 1500);
    }

    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.checked = task.status;
            checkbox.dataset.index = index;

            const span = document.createElement('span');
            span.innerHTML = ` ${task.title} - <b>P${task.priority}</b> due for ${task.date}`;
            span.style.textDecoration = task.status ? "line-through" : "none";
            span.style.opacity = task.status ? "0.6" : "1";

            const editBtn = document.createElement('button');
            editBtn.textContent = "Edit";
            editBtn.className = "edit-btn";
            editBtn.dataset.index = index;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";
            deleteBtn.dataset.index = index;

            li.append(checkbox, span, editBtn, deleteBtn);
            taskList.appendChild(li);
        });
    }

    function addTask() {
        const title = taskTitleInput.value;
        const priority = taskPriorityInput.value;
        const date = taskDateInput.value;
        if (!validateInput(title, date)) return;
        tasks.push(createTaskObject(title, priority, date));
        saveTasks();
        renderTasks();
        resetForm();
        enterHint.style.opacity = "0";
        taskTitleInput.focus();
    }

    function updateTask() {
        const title = taskTitleInput.value;
        const date = taskDateInput.value;
        const priority = taskPriorityInput.value;
        if (!validateInput(title, date)) return;
        Object.assign(tasks[updatedIndex], { title, date, priority });
        saveTasks();
        renderTasks();
        resetForm();
        toggleUpdateMode(false);
        showFeedback("Task updated!");
    }

    function cancelUpdate() {
        resetForm();
        toggleUpdateMode(false);
        taskTitleInput.focus();
    }

    function toggleUpdateMode(isUpdating) {
        updateTaskBtn.style.display = isUpdating ? "inline-block" : "none";
        cancelUpdateBtn.style.display = isUpdating ? "inline-block" : "none";
        addTaskBtn.style.display = isUpdating ? "none" : "inline-block";
    }

    // Event Listeners
    addTaskBtn.addEventListener("click", addTask);
    updateTaskBtn.addEventListener("click", updateTask);
    cancelUpdateBtn.addEventListener("click", cancelUpdate);
    taskTitleInput.addEventListener("input", checkForm);
    taskDateInput.addEventListener("change", checkForm);

    document.addEventListener("keydown", (e) => {
        if (e.key === 'Enter' && isFormFilled && addTaskBtn.style.display !== "none") {
            addTask();
        }
    });

    taskList.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains("delete-btn")) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        } else if (e.target.classList.contains("edit-btn")) {
            const task = tasks[index];
            taskTitleInput.value = task.title;
            taskDateInput.value = task.date;
            taskPriorityInput.value = task.priority;
            updatedIndex = index;
            toggleUpdateMode(true);
            taskTitleInput.focus();
        }
    });

    taskList.addEventListener("change", (e) => {
        if (e.target.type === "checkbox") {
            const index = e.target.dataset.index;
            tasks[index].status = e.target.checked;
            saveTasks();
            renderTasks();
        }
    });

    // Initialize
    loadTasks();
    renderTasks();
    checkForm();
})();