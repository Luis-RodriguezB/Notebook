const addContact  = document.getElementById('add-contact');
const deleteContact  = document.querySelectorAll('#notebook .delete-button');
const cancelButton = document.querySelector('#container_modal .btn-modal-cancel');

const sectionForm = document.getElementById('container_modal_form');
const sectionConfirm = document.getElementById('container_modal');

const form = document.querySelector('#container_modal_form form');
const inputs = document.querySelectorAll('input');

const isValidInput = {
    name: false,
    lastName: false,
    telephone: false,
    email: false,
}

const inputsExpression = {
    name: /^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/,
    lastName: /^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/,
    telephone: /^\d{8,11}$/,
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
}

const contactsArray = [];

const validateInput = (e) => {
    switch (e.target.name) {
        case 'name':
            inputValidator(inputsExpression.name, e.target.value, 'name');
            break;
        case 'lastName':
            inputValidator(inputsExpression.lastName, e.target.value, 'lastName');
            break;
        case 'telephone':
            inputValidator(inputsExpression.telephone, e.target.value, 'telephone');
            break;
        case 'email':
            inputValidator(inputsExpression.email, e.target.value, 'email');
            break;
    }
}

const inputValidator = ( expression, value, id ) => {
    document.querySelector('#error-message').style.display = 'none';
    if (expression.test(value)) {
        document.querySelector(`.form-group #${id}`).classList.remove('invalid-input');
        document.querySelector(`.form-group #${id}`).classList.add('valid-input');
        document.querySelector(`#error-message_${id}`).style.display = 'none';
        isValidInput[id] = true;
    } else {
        document.querySelector(`.form-group #${id}`).classList.remove('valid-input');
        document.querySelector(`.form-group #${id}`).classList.add('invalid-input');
        document.querySelector(`#error-message_${id}`).style.display = 'block';
        isValidInput[id] = false;
    }
}

inputs.forEach(input => {
    input.addEventListener('blur', validateInput);
    input.addEventListener('keyup', validateInput);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (isValidInput.name && 
        isValidInput.lastName &&  
        isValidInput.telephone && 
        isValidInput.email
    ) {
        const formData = new FormData(e.target);
        const formProps = Object.fromEntries(formData);
        contactsArray.push(formProps);
        addContactToTable(formProps);
        clearClass();
        closeOpenModal(sectionForm, 'none');
    } else {
        document.querySelector('#error-message').style.display = 'block';
    }
});

const addContactToTable = ( { name, lastName, telephone, email } ) => {
    const table = document.querySelector('#notebook table');
    const tr = document.createElement('tr');

    const nameColumn = document.createElement('td');
    nameColumn.textContent = name;
    const lastNameColumn = document.createElement('td');
    lastNameColumn.textContent = lastName;
    const telephoneColumn = document.createElement('td');
    telephoneColumn.textContent = telephone;
    const emailColumn = document.createElement('td');
    emailColumn.textContent = email;

    const deleteColumn = document.createElement('td');
    const btnDelete = document.createElement('button');
    btnDelete.type = 'button';
    btnDelete.title = 'Eliminar contacto';
    btnDelete.classList.add('delete-button');
    const iconDelete = document.createElement('i');
    iconDelete.classList.add("fa-solid", "fa-trash-can");
    deleteColumn.appendChild(btnDelete);
    btnDelete.appendChild(iconDelete);

    tr.append(nameColumn, lastNameColumn, telephoneColumn, emailColumn, deleteColumn);
    table.appendChild(tr);
}



addContact.addEventListener("click", () => closeOpenModal(sectionForm, 'block'));
deleteContact.forEach( button => button.addEventListener('click', () => closeOpenModal(sectionConfirm, 'block')));
cancelButton.addEventListener('click', () => closeOpenModal(sectionConfirm, 'none'));
sectionForm.addEventListener('click', (e) => {
     
    if (!form.contains(e.target)) {
        sectionForm.style.display = 'none';
        form.reset();
        clearClass();
    }
});

const closeOpenModal = (element, type) => {
    element.style.display = type;
}
const clearClass = () => {
    inputs.forEach( button => button.classList.remove('invalid-input', 'valid-input') );
}