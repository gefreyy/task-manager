const openAddTarea = document.querySelector('.open-add-tarea');

const modalAddTasks = document.querySelector('.modal-add-tasks');
const addDescTarea = document.querySelector('.add-desc-task');
const addPriorityTask = document.getElementById('add-prioridad');
const addLimitDate = document.getElementById('add-limit-date');
const addNewTask = document.querySelector('.add-task');
const closeAddTaskForm = document.querySelector('.close-add-task-form');

const modalEditTasks = document.querySelector('.modal-edit-tasks');
const editDescTarea = document.querySelector('.edit-desc-task');
const editPriorityTask = document.getElementById('edit-prioridad');
const editLimitDate = document.getElementById('edit-limit-date');
const editCreatedTask = document.querySelector('.edit-task');
const closeEditTaskForm = document.querySelector('.close-edit-task-form');

const openAddProyecto = document.querySelector('.open-add-proyecto');
const closeProjectForm = document.querySelector('.close-project-form');
const modalProjects = document.querySelector('.modal-projects');
const addNewProject = document.querySelector('.add-project');
const nameProject = document.querySelector('.name-project');


const tareaElemento = document.querySelector('.tarea-elemento');
const listaTareas = document.getElementById('lista-tareas');
const borrarBtn = document.querySelector('.btn-borrar');
const tareaCreada = document.querySelector('.item-task');



// Aqui estará la lista de proyectos y adentro de ella la lista de tareas.
let proyectosLista = [];

// Aqui guardare las tareas a manera de objetos.
let tareasLista = [];


// Contador que servirá como ID para las tareas
let taskIdCounter = 1;
const regex = /^\s*$/;
let currentEditTaskId = null;

let date = new Date()

function addTask() {
    let tarea = addDescTarea.value;
    let fechaLimite = addLimitDate.value; 
    let prioridad = addPriorityTask.value;
    
    let maxId = tareasLista.length > 0 ? Math.max(...tareasLista.map(t => t.id)) : 0; // Busca el mayor 

    let nuevaTarea = {
        id: maxId+1,
        desc: tarea,
        priority: prioridad,
        dateLimit: fechaLimite,
        isChecked: false
    };

    tareasLista.push(nuevaTarea);
    localStorage.setItem('tareas', JSON.stringify(tareasLista));
    taskIdCounter++;

    mostrarTareas(nuevaTarea);
    console.log(fechaLimite)
}

// Delegación de eventos para eliminar una tarea

listaTareas.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.btn-borrar'); // Selecciona la clase del boton
    const checkbox = event.target.closest('input[type="checkbox"]'); // Selecciona el ID del checkbox
    const editButton = event.target.closest('.btn-edit');

    if(checkbox) {
        const taskItem = checkbox.closest('.item-task');
        const valueId = parseInt(taskItem.getAttribute('data-id'));

        for(let i = 0; i<tareasLista.length; i++) {
            if(tareasLista[i].id === valueId) {
                if(checkbox.checked) {
                    tareasLista[i].isChecked = true;
                    localStorage.setItem('tareas', JSON.stringify(tareasLista));
                    break;
                } else {
                    tareasLista[i].isChecked = false;
                    localStorage.setItem('tareas', JSON.stringify(tareasLista));
                }
            }
        }
    }

    if(editButton) {
        event.preventDefault();
        // If we found a delete button, find its parent task and remove it
        const taskItem = editButton.closest('.item-task');
        const valueId = parseInt(taskItem.getAttribute('data-id'));

        for(let i = 0; i<tareasLista.length; i++) {
            if(tareasLista[i].id === valueId) {
                // Guardo el id de la tarea ACTUAL :)
                currentEditTaskId = valueId;

                modalEditTasks.showModal();
                editDescTarea.value = tareasLista[i].desc;
                editPriorityTask.value = tareasLista[i].priority;
                editLimitDate.value = tareasLista[i].dateLimit;
                console.log(`editando tarea con el id: ${tareasLista[i].id}`)
                break;
            }
        }
    }
    
    if (deleteButton) {
        // If we found a delete button, find its parent task and remove it
        const taskItem = deleteButton.closest('.item-task');
        const valueId = parseInt(taskItem.getAttribute('data-id'));

        for(let i = 0; i<tareasLista.length; i++) {
            if(tareasLista[i].id === valueId) {
                console.log('Tarea eliminada', tareasLista[i]);
                taskItem.remove();
                tareasLista.splice(i, 1);
                localStorage.setItem('tareas', JSON.stringify(tareasLista));
                if(tareasLista == 0) {
                    noTasks.classList.add('no-tasks-enabled');
                }
                break;
            }
        }
    }
});

openAddTarea.addEventListener('click', (e)=>{
    e.preventDefault();
    modalAddTasks.showModal();
})

closeAddTaskForm.addEventListener('click', (e)=>{
    e.preventDefault();
    modalAddTasks.close();
    addDescTarea.value = "";
})

closeEditTaskForm.addEventListener('click', ()=> {
    modalEditTasks.close();
})

openAddProyecto.addEventListener('click', (e)=>{
    e.preventDefault();
    modalProjects.showModal();
})

closeProjectForm.addEventListener('click', (e)=>{
    e.preventDefault();
    modalProjects.close();
    nameProject.value = "";
})

addNewTask.addEventListener('click', (e) => {
    e.preventDefault();
    let fechaIntroducida = new Date(addLimitDate.value)
    if(!regex.test(addDescTarea.value) && fechaIntroducida > date) {
        addTask();
        addDescTarea.value = "";
        addLimitDate.value = "";
        modalAddTasks.close();
        noTasks.classList.remove('no-tasks-enabled');
    } else {
        alert("Por favor, no deje el campo vacío o introduzca una fecha válida.");
        console.log(Date(addLimitDate.value));
    }
});

editCreatedTask.addEventListener('click', (e) => {
    e.preventDefault();
    let fechaIntroducida = new Date(editLimitDate.value)
    if(!regex.test(editLimitDate.value) && fechaIntroducida > date) {
        // Busca y actualiza la tarea EN EL ARRAY "tareasLista"
        for(let i = 0; i<tareasLista.length; i++) {
            if(tareasLista[i].id === currentEditTaskId) {
                tareasLista[i].desc = editDescTarea.value;
                tareasLista[i].priority = editPriorityTask.value;
                tareasLista[i].dateLimit = editLimitDate.value;

                localStorage.setItem('tareas', JSON.stringify(tareasLista));

                // Actualizo la VISTA usando data-id y el CURRENT ID que definí.
                const taskItem = document.querySelector(`.item-task[data-id="${currentEditTaskId}"]`);
                if(taskItem) {
                    const label = taskItem.querySelector('label');
                    const priority = taskItem.querySelector('.prioridad');
                    const date = taskItem.querySelector('.fecha');
                    
                    label.textContent = tareasLista[i].desc;
                    priority.textContent = tareasLista[i].priority;
                    date.textContent = tareasLista[i].dateLimit;
                }

                modalEditTasks.close();
                break;
            }
        }
    } else {
        alert("Por favor, no deje el campo vacío o introduzca una fecha válida.");
    }
})

window.onload = function(){ // en caso se encuentren tareas almacenadas, uso la funcion mostrarTareas para que se cree cada componente.
    let tareasGuardadas = localStorage.getItem('tareas');
    if(tareasGuardadas) {
        tareasLista = JSON.parse(tareasGuardadas);
        tareasLista.forEach(tarea => { // Por cada tarea, ejecuta la funcion mostrarTareas recibiendo las tareas almacenadas.
            mostrarTareas(tarea);
        });
    } else {
        tareasLista = []
    }

    if(tareasLista == 0) {
        noTasks.classList.add('no-tasks-enabled');
        console.log('works')
    }
    
    document.querySelectorAll(".item-task").forEach(addDragAndDropEvents);
    console.log(tareasGuardadas);
};

function mostrarTareas(tarea) { // Funcion para crear la estructura.
    const li = document.createElement('li');
    li.setAttribute('class', "item-task");
    li.setAttribute('draggable', "true");
    li.setAttribute('data-id', tarea.id);

    const tareaElemento = document.createElement('div');
    tareaElemento.setAttribute('class', "tarea-elemento");

    const tareaNum = document.createElement('p');
    tareaNum.setAttribute('class', "task-number");

    const tareas = document.createElement('div');
    tareas.setAttribute('class', "tareas")

    const checkbox = document.createElement('div');
    checkbox.setAttribute('class', "checkbox");

    const inputCheckbox = document.createElement('input');
    inputCheckbox.setAttribute('id', tarea.id);
    inputCheckbox.setAttribute('type', "checkbox");
    inputCheckbox.checked = tarea.isChecked;

    const labelCheckbox = document.createElement('label');
    labelCheckbox.setAttribute('for', tarea.id);

    const prioridad = document.createElement('span');
    prioridad.setAttribute('class', "prioridad");
    prioridad.textContent = tarea.priority;

    const fecha = document.createElement('span');
    fecha.setAttribute('class', "fecha");
    fecha.textContent = tarea.dateLimit;

    const opcionesTarea = document.createElement('div');
    opcionesTarea.setAttribute('class', "opciones-tarea");

    const editBtn = document.createElement('button');
    editBtn.setAttribute('class', 'btn-edit')

    const borrarBtn = document.createElement('button');
    borrarBtn.setAttribute('class', `btn-borrar`);

    const imgTrash = document.createElement('img');
    imgTrash.setAttribute('src', '../img/basura.png');
    imgTrash.setAttribute('width', '20');

    const imgEdit = document.createElement('img');
    imgEdit.setAttribute('src', '../img/editar.png');
    imgEdit.setAttribute('width', '20');

    labelCheckbox.textContent = tarea.desc;
    tareaNum.textContent = `${tarea.id}.`;

    listaTareas.appendChild(li);
    li.appendChild(tareaElemento);
    // tareaElemento.appendChild(tareaNum);
    tareaElemento.appendChild(tareas);
    tareas.appendChild(checkbox);
    checkbox.appendChild(inputCheckbox);
    tareas.appendChild(labelCheckbox);
    tareas.appendChild(prioridad);
    tareas.appendChild(fecha);
    tareaElemento.appendChild(opcionesTarea);
    opcionesTarea.appendChild(editBtn);
    opcionesTarea.appendChild(borrarBtn);
    editBtn.append(imgEdit);
    borrarBtn.appendChild(imgTrash);

    addDragAndDropEvents(li);

}

// Reordenar las tareas con drag and drop
let tareas = document.querySelectorAll(".item-task");
let draggedItem = null; // Elemento arrastrado
let idDraggedItem = null; // Id del elemento arrastrado
let originalIndex = null; // Indice original del array
let targetItem = null; // Elemento objetivo

function addDragAndDropEvents(item) {
    item.addEventListener('dragstart', (event) => {
        draggedItem = event.target;
        event.target.classList.add("dragging");
        idDraggedItem = event.target.getAttribute('data-id');
        originalIndex = [...draggedItem.parentNode.children].indexOf(draggedItem); // Guardo el índice original
    });

    item.addEventListener('dragend', () => {
        if (draggedItem) {
            draggedItem.classList.remove("dragging");
            // Verifico si la posición ha cambiado
            const newIndex = [...draggedItem.parentNode.children].indexOf(draggedItem); // Nuevamente obtengo el índice
            if (originalIndex !== newIndex) {
                updateTaskListOrder(); // Añadido aquí
            }
            draggedItem = null;
        }
    });
}


listaTareas.addEventListener('dragover', (event) => {
    event.preventDefault();

    const afterElement = getDragAfterElement(listaTareas, event.clientY);

    if (afterElement == null) {
        listaTareas.appendChild(draggedItem);  // Se soltó al final de la lista
        targetItem = null;  // No hay siguiente, por lo que no asignamos ningún target
    } else {
        listaTareas.insertBefore(draggedItem, afterElement);  // Se soltó antes del siguiente
        targetItem = afterElement.getAttribute('data-id');  // Guardamos el siguiente elemento como el target
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".item-task:not(.dragging)")];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateTaskListOrder() {
    const taskElements = [...document.querySelectorAll('.item-task')]; // Todos los elementos de tareas en el DOM

    // Creo un nuevo array basado en el orden que tiene el DOM
    const newTareasLista = taskElements.map((element, index) => {
        const id = parseInt(element.getAttribute('data-id'));
        // Encontramos la tarea correspondiente en tareasLista y la agregamos con su nuevo orden
        const originalTask = tareasLista.find(t => t.id === id);
        return { ...originalTask, order: index }; // Agregamos un campo de orden
    });

    // Ordenamos el nuevo array por el campo order
    newTareasLista.sort((a, b) => a.order - b.order);

    // Limpiamos el array original y agregamos los nuevos elementos
    tareasLista.length = 0;
    tareasLista.push(...newTareasLista);

    // Guardar los cambios en localStorage
    localStorage.setItem('tareas', JSON.stringify(tareasLista));
}

let noTasks = document.querySelector('.no-tasks');
