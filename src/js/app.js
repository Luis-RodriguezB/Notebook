(function () {
  const addContact = document.getElementById("add-contact");
  const cancelButton = document.querySelector("#container_modal .btn-modal-cancel");
  const deleteButton = document.querySelector("#container_modal .btn-modal-success");

  const modalForm = document.getElementById("container_modal_form");
  const modalConfirm = document.getElementById("container_modal");

  const form = document.querySelector("#container_modal_form form");
  const inputs = document.querySelectorAll("input");

  const errorMessage = document.querySelector("#error-message");

  let contactsArray = [];
  let contactForDelete;

  window.onload = () => {
    contactsArray = JSON.parse(localStorage.getItem("contacts")) || [];

    if (contactsArray.length > 0) {
      contactsArray.forEach(addContactToTable);
    }
  };

  const isValidInput = {
    name: false,
    lastName: false,
    telephone: false,
    email: false,
  };

  const inputsExpression = {
    name: /^[a-zA-ZÀ-ÿ\s]{2,30}$/,
    lastName: /^[a-zA-ZÀ-ÿ\s]{2,70}$/,
    telephone: /^\d{8,11}$/,
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  };

  const validateInput = (e) => {
    switch (e.target.name) {
      case "name":
        inputValidator(inputsExpression.name, e.target.value, "name");
        break;
      case "lastName":
        inputValidator(inputsExpression.lastName, e.target.value, "lastName");
        break;
      case "telephone":
        inputValidator(inputsExpression.telephone, e.target.value, "telephone");
        break;
      case "email":
        inputValidator(inputsExpression.email, e.target.value, "email");
        break;
    }
  };

  const inputValidator = (expression, value, id) => {
    errorMessage.style.display = "none";
    if (expression.test(value)) {
      document
        .querySelector(`.form-group #${id}`)
        .classList.remove("invalid-input");
      document.querySelector(`.form-group #${id}`).classList.add("valid-input");
      document.querySelector(`#error-message_${id}`).style.display = "none";
      isValidInput[id] = true;
    } else {
      document
        .querySelector(`.form-group #${id}`)
        .classList.remove("valid-input");
      document
        .querySelector(`.form-group #${id}`)
        .classList.add("invalid-input");
      document.querySelector(`#error-message_${id}`).style.display = "block";
      isValidInput[id] = false;
    }
  };

  inputs.forEach((input) => {
    input.addEventListener("blur", validateInput);
    input.addEventListener("keyup", validateInput);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearClass();
    
    if (
      isValidInput.name &&
      isValidInput.lastName &&
      isValidInput.telephone &&
      isValidInput.email
    ) {
      const formData = new FormData(e.target);
      const formProps = {
        id: `contact-${uniqueID()}`,
        ...Object.fromEntries(formData),
      };

      contactsArray.push(formProps);
      localStorage.setItem("contacts", JSON.stringify(contactsArray));

      addContactToTable(formProps);

      closeOpenModal(modalForm, "none");
      form.reset();
    } else {
      errorMessage.style.display = "block";
    }
  });

  const addContactToTable = ({ id, name, lastName, telephone, email }) => {
    const table = document.querySelector("#notebook table");
    const tr = document.createElement("tr");
    tr.id = id;

    const nameColumn = document.createElement("td");
    nameColumn.textContent = name;
    const lastNameColumn = document.createElement("td");
    lastNameColumn.textContent = lastName;
    const telephoneColumn = document.createElement("td");
    telephoneColumn.textContent = telephone;
    const emailColumn = document.createElement("td");
    emailColumn.textContent = email;

    const deleteColumn = document.createElement("td");
    const btnDelete = document.createElement("button");
    btnDelete.type = "button";
    btnDelete.title = "Eliminar contacto";
    btnDelete.onclick = () => closeOpenModal( modalConfirm, 'block', id );
    btnDelete.classList.add("delete-button");

    const iconDelete = document.createElement("i");
    iconDelete.classList.add("fa-solid", "fa-trash-can");

    deleteColumn.appendChild(btnDelete);
    btnDelete.appendChild(iconDelete);

    tr.append(
      nameColumn,
      lastNameColumn,
      telephoneColumn,
      emailColumn,
      deleteColumn
    );
    table.appendChild(tr);
  };

  addContact.addEventListener("click", () =>
    closeOpenModal(modalForm, "block")
  );

  cancelButton.addEventListener("click", () =>
    closeOpenModal(modalConfirm, "none")
  );

  deleteButton.addEventListener("click", () => {
    if (contactForDelete) {
      contactsArray = contactsArray.filter(contact => contact.id !== contactForDelete);
      document.getElementById(contactForDelete).remove();
      localStorage.setItem("contacts", JSON.stringify(contactsArray));

      closeOpenModal(modalConfirm, 'none')
      contactForDelete = undefined;
    }
  })

  modalForm.addEventListener("click", (e) => {
    if (!form.contains(e.target)) {
      modalForm.style.display = "none";
      form.reset();
      clearClass();
    }
  });

  const closeOpenModal = (element, type, ...arg) => {
    element.style.display = type;

    if (arg.length === 1) {
      const [ id ] = arg;
      contactForDelete = id;
    }
  };

  const clearClass = () => {
    inputs.forEach((button) =>
      button.classList.remove("invalid-input", "valid-input")
    );
    document
      .querySelectorAll(".text-error")
      .forEach((text) => (text.style.display = "none"));
    errorMessage.style.display = "none";
  };

  const uniqueID = () => {
    return Math.floor(Math.random() * Date.now());
  };
})();
