
let input = document.querySelector("#note-input");
let addButton = document.querySelector("#add-button");
let notes = document.querySelector("#notes");

let count = 0;

//change the size of "+" button
addButton.addEventListener("mouseover",(event)=>{
    event.target.style.transform="scale(1.5)";

});

addButton.addEventListener("mouseout",(event)=>{
    event.target.style.transform="scale(1)";

});

addButton.addEventListener("click", () => {
    let text = input.value;
     
    if (text === "") return ;//don't add anything

    let nextNote = document.createElement("div");
    nextNote.classList.add("note");
    nextNote.textContent = text;

    //alternate cell colour assignment
    if (count % 2 === 0) {
        nextNote.style.backgroundColor = "#d1e1ff";
    }
    else {
        nextNote.style.backgroundColor = "#effffe";
    }

    count++;
    
    //add delete button to existing note
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("delete-button");

    nextNote.appendChild(deleteButton);

    deleteButton.addEventListener("click", () => {
        nextNote.remove();
    });

    notes.appendChild(nextNote);
    input.value = "";
});
