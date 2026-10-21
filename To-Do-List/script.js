const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const taskTime = document.getElementById("task-time");
const taskForm = document.getElementById("task-form");
const searchInput = document.getElementById("search-input");
const dueTasks = document.getElementById("due-tasks");
const upcomingTasks = document.getElementById("upcoming-tasks");
const upcomingSection = document.getElementById("upcoming-section");
const errorMessage = document.getElementById("error-message");

//load saved task
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = -1 //for checking lready existing tasks

//create and display all individual tasks with their buttons
const showTasks=(taskList, section, today)=> {
    let currentDate = "";

    taskList.forEach((task) =>{
        if (task.date !== currentDate) {
            currentDate = task.date;

            const heading = document.createElement("h3");

            if (task.date === today) {
                heading.textContent = "Today";
            } else {
                heading.textContent = task.date.split("-").reverse().join("/");
            }

            section.appendChild(heading);
        }

        const taskItem = document.createElement("div");

        const taskText = document.createElement("span");
        
        //convert time into 12 hour form
        let timePartition = task.time.split(":");
        let hours = Number(timePartition[0]);
        let minutes = timePartition[1];
        let setAmPm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        let formattedTime = hours + ":" + minutes + " " + setAmPm;

        taskText.textContent = task.description;

        const timeBlock = document.createElement("span");
        timeBlock.textContent = " at " + formattedTime;
        timeBlock.style.display = "block";

        //  Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-button");

        editButton.addEventListener("click", function() {
            editIndex = tasks.indexOf(task);

            taskInput.value = task.description;
            taskDate.value = task.date;
            taskTime.value = task.time;

            document.getElementById("add-task").textContent = "Update Task";
        });

        //Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");

        deleteButton.addEventListener("click", function() {
            tasks = tasks.filter(function(item) {
                return item !== task;
            });

            localStorage.setItem("tasks", JSON.stringify(tasks));
            displayTasks();
        });
         
        taskItem.appendChild(taskText);
        taskItem.appendChild(timeBlock);
        

        const buttonContainer = document.createElement("div");
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        taskItem.appendChild(buttonContainer);
        section.appendChild(taskItem);

        
    });
}

  //Apply filter and then dispaly based on date/search filter
    const displayTasks=() =>{
  
        dueTasks.innerHTML = "";
        upcomingTasks.innerHTML = "";

        const current=new Date();

        const today = current.getFullYear() + "-" +
        String(current.getMonth() + 1).padStart(2, "0") + "-" +
        String(current.getDate()).padStart(2, "0");

    

        //  Search tasks
        const searchText = searchInput.value.toLowerCase().trim();

        const filteredTasks = tasks.filter((task) =>
            task.description.toLowerCase().includes(searchText)
        );

        const dueList = filteredTasks
            .filter((task) => task.date <= today)
            .sort((a, b) => a.date > b.date ? 1 : -1);

        const upcomingList = filteredTasks
            .filter((task) => task.date > today)
            .sort((a, b) => a.date > b.date ? 1 : -1);

        showTasks(dueList, dueTasks, today);
        showTasks(upcomingList, upcomingTasks, today);

        upcomingSection.style.display =(upcomingList.length>0)? "block":"none";
        
    }


displayTasks();

//handles input
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const description = taskInput.value.trim();
    const date = taskDate.value;
    const time = taskTime.value;


    if (description === "" || date === "" || time === "") {
        errorMessage.hidden = false;
        return;
    }

    if (editIndex === -1) {
        tasks.push({
            description: description,
            date: date,
            time: time
        });
    } else {
        tasks[editIndex].description = description;
        tasks[editIndex].date = date;
        tasks[editIndex].time = time;

        editIndex = -1;
        document.getElementById("add-task").textContent = "Add Task";
    }


    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();
    taskForm.reset();
});

//display matching tasks
searchInput.addEventListener("input", displayTasks);

//alert handling
document.getElementById("close-error").addEventListener("click", ()=> {
    errorMessage.hidden = true;
});

document.getElementById("ok-error").addEventListener("click", ()=> {
    errorMessage.hidden = true;
});
