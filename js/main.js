//console.log("hola, brc")
//! Edit mode variables
let editMode = false; // Düzenleme modunu belirleyen değişken
let editItem; // Düzenleme elemanını belirleyen değişken
let editItemId; // Düzenleme elmanı 'id'
//! Call an element from html
const form = document.querySelector(".form-wrapper");
const input = document.querySelector("#input");
const itemList = document.querySelector(".item-list");
const alert = document.querySelector(".alert");
const addButton = document.querySelector(".submit-btn");
const clearButton = document.querySelector(".clear-btn");

// console.log(form, input);

//! Functions
// * Function to run when form is submitted
const addItem = (e) => {
    // Cancel page refresh
    e.preventDefault();
    const value = input.value;
    if (value !== "" && !editMode) {
        // Id created for deletions
        const id = new Date().getTime().toString();
        createElement(id, value);
        setToDefault();
        showAlert("Element Added", "success");
        addToLocalStorage(id, value);
      } else if (value !== "" && editMode) {
        editItem.innerHTML = value;
        updateLocalStorage(editItemId, value);
        showAlert("Element Updated", "success");
        setToDefault();
      }
    };

// * Alert functions
const showAlert = (text, action) => {
     // * Determines alert content
     alert.textContent = ` ${text}`;
    // * Adds class to the warning section
    alert.classList.add(`alert-${action}`);
    // Updates the alert content and removes the added class
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
      }, 2000);
};
// * Function that deletes elements
const deleteItem = (e) => {
    // Access the element to be deleted
    const element = e.target.parentElement.parentElement.parentElement;
    const id = element.dataset.id;
    // Remove this element
    itemList.removeChild(element);
    removeFromLocalStorage(id);
    showAlert("Element Deleted", "danger");
    console.log(itemList);
    // Remove the reset button if there are no elements
    if (!itemList.children.length) {
        clearButton.style.display = "none";
      }
};
// * Function that updates elements
const editItems = (e) => {
    const element = e.target.parentElement.parentElement.parentElement;
    editItem = e.target.parentElement.parentElement.previousElementSibling;
    input.value = editItem.innerText;
    editMode = true;
    editItemId = element.dataset.id;
    addButton.textContent = "Edit";
  };
// * Function that returns default values
const setToDefault = () => {
    input.value = "";
    editMode = false;
    editItemId = "";
    addButton.textContent = "Add";
};
// * Function that render elements when the page is loaded
const renderItems = () => {
    let items = getFromLocalStorage();
    console.log(items);
    if (items.length > 0) {
      items.forEach((item) => createElement(item.id, item.value));
    }
};
// * Function that forms the elements
const createElement = (id, value) => {
    // Create a new 'div'
    const newDiv = document.createElement("div");
    // Add 'div' attribute
    newDiv.setAttribute("data-id", id);
    // Add class to Div
    newDiv.classList.add("items-list-item");
    // Determine the Html content of the div
    newDiv.innerHtml =
    newDiv.innerHTML = `
           <p class="item-name">${value} </p>
            <div class="btn-container">
              <button class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
  `;
    // Access to the 'Delete' button
    const deleteBtn = newDiv.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    // Access to the 'Edit' button
    const editBtn = newDiv.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItems);
    itemList.appendChild(newDiv);
    showAlert("Element added", "success");
};
// * Resetting function
const clearItems = () => {
    const items = document.querySelectorAll(".items-list-item");
    if (items.length > 0) {
        items.forEach((item) => {
            itemList.removeChild(item);
        });
    clearButton.style.display = "none";
    showAlert("List empty", "danger")

    // Clear localstorage
    localStorage.removeItem("items");
    }
};

// * Function that saves to localstorage
const addToLocalStorage = (id, value) => {
    const item = {id, value};
    let items = getFromLocalStorage();
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
};

// * Function that retrieves data from localstorage
const getFromLocalStorage = () => {
    return localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    :[];
};

// * Function that removes data from localstorage
const removeFromLocalStorage = (id) => {
    let items = getFromLocalStorage();
    items = items.filter((item) => item.id !== id);
    localStorage.setItem("items", JSON.stringify(items));
};

// * Function that updates localstorage
const updateLocalStorage = (id, newValue) => {
    let items = getFromLocalStorage();
    items = items.map((item) => {
        if (item.id === id) {
            return {...item, value: newValue};
        }
        return item;
    });
    localStorage.setItem("items", JSON.stringify(items));
};
// ! Event Trackers
// * Capture the moment the form is submitted
form.addEventListener("submit", addItem);
// * Capture the moment the page loads
window.addEventListener("DOMContentLoaded", renderItems);
// Resetting elements when Clear Button is clicked
clearButton.addEventListener("click", clearItems);
