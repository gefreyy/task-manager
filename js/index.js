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
const nameProject = document.querySelector('.name-project');
const addNewProject = document.querySelector('.add-project');


const tareaElemento = document.querySelector('.tarea-elemento');
const listaTareas = document.getElementById('lista-tareas');
const borrarBtn = document.querySelector('.btn-borrar');
const tareaCreada = document.querySelector('.item-task');

const listaProyectos = document.querySelector('.proyectos');

let noTasks = document.querySelector('.no-tasks');

// Aqui estará la lista de proyectos y adentro de ella la lista de tareas.
let proyectosLista = [];

// // Contador que servirá como ID para las tareas
// let taskIdCounter = 1;
// Expresión regular para validar que el campo no esté vacío
const regex = /^\s*$/;
// Variable para almacenar el ID de la tarea que se está editando
let currentEditTaskId = null;

let date = new Date()

window.addEventListener('load', () => {
    if (!location.hash) {
        location.hash = '#/';
    }
});

function addProject() {
    let proyecto = nameProject.value;
    let maxId = proyectosLista.length > 0 ? Math.max(...proyectosLista.map(p => p.idProyecto)) : 0

    let nuevoProyecto = {
        idProyecto: maxId+1,
        nombre: proyecto,
        tareas: []
    }
    proyectosLista.push(nuevoProyecto)
    // console.log(`Proyecto creado con id: ${nuevoProyecto.idProyecto}`)
    localStorage.setItem('proyectos', JSON.stringify(proyectosLista));
    mostrarProyectos(nuevoProyecto)
}

function addTask() {
    let tarea = addDescTarea.value;
    let fechaLimite = addLimitDate.value; 
    let prioridad = addPriorityTask.value;

    const nombreProyecto = location.hash.split("/")[2];
    const proyecto = proyectosLista.find(p => p.nombre.toLowerCase().replace(/\s+/g, '-') === nombreProyecto.toLowerCase().replace(/\s+/g, '-'));

    // console.log(nombreProyecto)
    
    if (proyecto) {
        let maxId = proyecto.tareas.length > 0 ? Math.max(...proyecto.tareas.map(t => t.idTarea)) : 0;

        let nuevaTarea = {
            idTarea: maxId + 1,
            desc: tarea,
            priority: prioridad,
            dateLimit: fechaLimite,
            isChecked: false
        };

        proyecto.tareas.push(nuevaTarea);

        localStorage.setItem('proyectos', JSON.stringify(proyectosLista));

        mostrarTareas(nuevaTarea);

        // console.log("Tarea añadida con éxito", nuevaTarea);
    } else {
        alert("Proyecto no encontrado");
    }
}

function editTask() {
    let fechaIntroducida = new Date(editLimitDate.value);
    if (!regex.test(editDescTarea.value) && fechaIntroducida > date) {
        const nombreProyecto = location.hash.split("/")[2];
        const proyecto = proyectosLista.find(p => p.nombre.toLowerCase().replace(/\s+/g, '-') === nombreProyecto.toLowerCase().replace(/\s+/g, '-'));

        if (proyecto) {
            const tareaIndex = proyecto.tareas.findIndex(t => t.idTarea === currentEditTaskId);
            
            if (tareaIndex !== -1) {
                proyecto.tareas[tareaIndex].desc = editDescTarea.value;
                proyecto.tareas[tareaIndex].priority = editPriorityTask.value;
                proyecto.tareas[tareaIndex].dateLimit = editLimitDate.value;

                localStorage.setItem('proyectos', JSON.stringify(proyectosLista));

                const taskItem = document.querySelector(`.item-task[data-id="${currentEditTaskId}"]`);
                if (taskItem) {
                    const label = taskItem.querySelector('label');
                    const priority = taskItem.querySelector('.prioridad');
                    const date = taskItem.querySelector('.fecha');
                    
                    label.textContent = editDescTarea.value;
                    priority.textContent = editPriorityTask.value;
                    let fechaSplit = editLimitDate.value.split('-');
                    let fechaFormateada = `${fechaSplit[2]}/${fechaSplit[1]}/${fechaSplit[0]}`
                    date.textContent = fechaFormateada;
                }

                modalEditTasks.close();
                // console.log(`Tarea actualizada con ID: ${currentEditTaskId}`);
            }
        } else {
            alert("Proyecto no encontrado");
        }
    } else {
        alert("Por favor, no deje el campo vacío o introduzca una fecha válida.");
    }
}

function deleteTask(taskId) {
    const taskItem = document.querySelector(`.item-task[data-id="${taskId}"]`);
    
    if (taskItem) {
        const nombreProyecto = location.hash.split("/")[2];
        const proyecto = proyectosLista.find(p => p.nombre.toLowerCase().replace(/\s+/g, '-') === nombreProyecto.toLowerCase().replace(/\s+/g, '-'));

        if (proyecto) {
            const tareaIndex = proyecto.tareas.findIndex(t => t.idTarea === taskId);

            if (tareaIndex !== -1) {
                // console.log(`Se eliminará la tarea con ID: ${taskId}`);
                
                proyecto.tareas.splice(tareaIndex, 1);
                
                localStorage.setItem('proyectos', JSON.stringify(proyectosLista));

                taskItem.remove();

                if (proyecto.tareas.length === 0 && noTasks) {
                    noTasks.classList.add('no-tasks-enabled');
                }
                
                // console.log("Tarea eliminada con éxito");
            }
        } else {
            alert("Proyecto no encontrado");
        }
    } else {
        console.error(`No se encontró el elemento con ID: ${taskId}`);
    }
}

// Delegación de eventos para eliminar una tarea
listaTareas.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.btn-borrar'); // Selecciona la clase del boton
    const checkbox = event.target.closest('input[type="checkbox"]'); // Selecciona el ID del checkbox
    const editButton = event.target.closest('.btn-edit');

    if(checkbox) {
        const taskItem = checkbox.closest('.item-task');
        const valueId = parseInt(taskItem.getAttribute('data-id'));

        const nombreProyecto = location.hash.split("/")[2];
        const proyecto = proyectosLista.find(p => p.nombre.toLowerCase() === nombreProyecto.toLowerCase());
        const tarea = proyecto.tareas.find(t => t.idTarea === valueId);


        if(checkbox.checked) {
            tarea.isChecked = true;
            localStorage.setItem('proyectos', JSON.stringify(proyectosLista))
            // console.log(`Estas marcando ${tarea}`)

        } else {
            tarea.isChecked = false
            localStorage.setItem('proyectos', JSON.stringify(proyectosLista))
            // console.log(`Estas desmarcando ${tarea}`)
        }
    }

    if(editButton) {
        // Encuentra el item-task que contiene al botón de editar
        const taskItem = editButton.closest('.item-task');
        // if (!taskItem) return;
        
        const valueId = parseInt(taskItem.getAttribute('data-id'));
        currentEditTaskId = valueId; // Guarda el ID de la tarea actual
        
        const nombreProyecto = location.hash.split("/")[2];
        const proyecto = proyectosLista.find(p => p.nombre.toLowerCase() === nombreProyecto.toLowerCase());
        
        if (proyecto) {
            const tarea = proyecto.tareas.find(t => t.idTarea === valueId);
            
            if (tarea) {
                modalEditTasks.showModal();
                editDescTarea.value = tarea.desc;
                editPriorityTask.value = tarea.priority;
                editLimitDate.value = tarea.dateLimit;
            }
        }
    }
    
    if (deleteButton) {
        const taskItem = deleteButton.closest('.item-task');
        const taskId = parseInt(taskItem.getAttribute('data-id'));
        deleteTask(taskId);
    }
});

openAddTarea.addEventListener('click', (e)=>{
    e.preventDefault();
    const nombreProyecto = location.hash.split("/")[2];

    if(nombreProyecto !== undefined) {
        modalAddTasks.showModal();
    } else {
        alert("You are NOT in a current project. Please create a project first.");
    }
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

addNewProject.addEventListener('click', (e) => {
    e.preventDefault();
    if(!regex.test(nameProject.value)){
        addProject();
        nameProject.value = "";
        modalProjects.close();
    } else {
        alert("Introduzca un nombre válido");
    }
});

addNewTask.addEventListener('click', (e) => {
    e.preventDefault();
    let fechaIntroducida = new Date(addLimitDate.value);
        if(!regex.test(addDescTarea.value) && fechaIntroducida > date) {
            addTask();
            addDescTarea.value = "";
            addLimitDate.value = "";
            modalAddTasks.close();
            noTasks.classList.remove('no-tasks-enabled');
        } else {
            alert("Por favor, no deje el campo vacío o introduzca una fecha válida.");
            // console.log((addLimitDate.value).split("-"));
        }
});

editCreatedTask.addEventListener('click', (e) => {
    e.preventDefault();
    editTask();
})

function obtenerProyectoDesdeUrl() {
    const nombreProyecto = location.hash.split("/")[2];
    // console.log(nombreProyecto)

    if (nombreProyecto) {
        const proyecto = proyectosLista.find(p => p.nombre.toLowerCase().replace(/\s+/g, '-') === nombreProyecto.toLowerCase().replace(/\s+/g, '-'));
        return proyecto || null;
    } 
    return null;
}

window.onload = function() {
    let proyectosGuardados = localStorage.getItem('proyectos');
    if (proyectosGuardados) {
        proyectosLista = JSON.parse(proyectosGuardados);
        proyectosLista.forEach(proyecto => {
            mostrarProyectos(proyecto);
        });

        const proyectoActual = obtenerProyectoDesdeUrl();
        if (proyectoActual) {
            currentProjectId = proyectoActual.idProyecto;
            mostrarTareas();
        }
    } else {
        proyectosLista = [];
    }
};


function mostrarProyectos(proyecto) {
    const li = document.createElement('li');
    li.setAttribute('class', 'proyecto');
    li.setAttribute('data-id', proyecto.idProyecto);

    // let originalName = proyecto.nombre;

    let a = document.createElement('a');
    a.textContent = proyecto.nombre;
    let nameModified = proyecto.nombre.replace(/\s+/g, '-');
    a.href = `#/project/${nameModified}`;

    a.addEventListener('click', (e) => {
        e.preventDefault()
        // console.log(`accediendo a: ${nameModified} con ID ${proyecto.idProyecto}`)
        // console.log(window.location)
        cambiarUrl(`#/project/${nameModified}`)
        mostrarTareas();
    });
    
    listaProyectos.appendChild(li);
    li.appendChild(a);
}

// Función para cambiar la URL sin recargar la página
function cambiarUrl(url) {
    history.pushState(null, '', url);  // Esto cambia la URL en la barra de direcciones
}

function mostrarTareas() {
    const proyecto = obtenerProyectoDesdeUrl();
    // console.log(proyecto)

    if (proyecto) {
        const tareasDelProyecto = proyecto.tareas;

        listaTareas.innerHTML = "";

        if (tareasDelProyecto.length === 0) {
            // console.log("Este proyecto no tiene tareas.");
            noTasks.classList.add('no-tasks-enabled')
            return;
        }
        noTasks.classList.remove('no-tasks-enabled')
        tareasDelProyecto.forEach(tarea => {
            // Crear la estructura de cada tarea
            const li = document.createElement('li');
            li.setAttribute('class', "item-task");
            li.setAttribute('draggable', "true");
            li.setAttribute('data-id', tarea.idTarea);

            const tareaElemento = document.createElement('div');
            tareaElemento.setAttribute('class', "tarea-elemento");

            const tareaNum = document.createElement('p');
            tareaNum.setAttribute('class', "task-number");
            tareaNum.textContent = `${tarea.idTarea}.`;

            const tareas = document.createElement('div');
            tareas.setAttribute('class', "tareas");

            const checkbox = document.createElement('div');
            checkbox.setAttribute('class', "checkbox");

            const inputCheckbox = document.createElement('input');
            inputCheckbox.setAttribute('id', tarea.idTarea);
            inputCheckbox.setAttribute('type', "checkbox");
            inputCheckbox.checked = tarea.isChecked;

            const labelCheckbox = document.createElement('label');
            labelCheckbox.setAttribute('for', tarea.idTarea);
            labelCheckbox.textContent = tarea.desc;

            const prioridad = document.createElement('span');
            prioridad.setAttribute('class', "prioridad");
            prioridad.textContent = tarea.priority;

            const fecha = document.createElement('span');
            fecha.setAttribute('class', "fecha");
            let fechaSplit = tarea.dateLimit.split("-");
            let fechaFormateada = `${fechaSplit[2]}/${fechaSplit[1]}/${fechaSplit[0]}`
            fecha.textContent = fechaFormateada;

            const opcionesTarea = document.createElement('div');
            opcionesTarea.setAttribute('class', "opciones-tarea");

            const editBtn = document.createElement('button');
            editBtn.setAttribute('class', 'btn-edit');

            const borrarBtn = document.createElement('button');
            borrarBtn.setAttribute('class', `btn-borrar`);

            const imgTrash = document.createElement('img');
            imgTrash.setAttribute('src', '../img/basura.png');
            imgTrash.setAttribute('width', '20');

            const imgEdit = document.createElement('img');
            imgEdit.setAttribute('src', '../img/editar.png');
            imgEdit.setAttribute('width', '20');

            listaTareas.appendChild(li);
            li.appendChild(tareaElemento);
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
        });
    } else {
        console.log("No se encontró el proyecto en la URL.");
    }
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
    const proyectoPath = window.location.hash.split("/")[2];
    const proyecto = proyectosLista.find(p => p.nombre.toLowerCase().replace(/\s+/g, '-') === proyectoPath.toLowerCase().replace(/\s+/g, '-'));

    // Creo un nuevo array basado en el orden que tiene el DOM
    const newTareasLista = taskElements.map((element, index) => {
        const id = parseInt(element.getAttribute('data-id'));
        // Encontramos la tarea correspondiente en tareasLista y la agregamos con su nuevo orden
        const originalTask = proyecto.tareas.find(t => t.idTarea === id);
        // console.log(originalTask)
        return { ...originalTask, order: index }; // Agregamos un campo de orden
    });

    // Ordenamos el nuevo array por el campo order
    newTareasLista.sort((a, b) => a.order - b.order);

    // console.log(newTareasLista)

    // Limpiamos el array original y agregamos los nuevos elementos
    proyecto.tareas.length = 0;
    proyecto.tareas.push(...newTareasLista);

    // Guardar los cambios en localStorage
    localStorage.setItem('proyectos', JSON.stringify(proyectosLista));
}

// Visual stuff
const barraIzq = document.querySelector('.barra-lateral-izq');
const menuHamburguesa = document.querySelector('.menu-hamburguesa');
const floatingMenuHamburguesa = document.querySelector('.floating-menu-hamburguesa');
const fecha = document.getElementById('fecha');

menuHamburguesa.addEventListener('click', () => {
    barraIzq.style.width = 0;
    floatingMenuHamburguesa.classList.add('enabled');
});

floatingMenuHamburguesa.addEventListener('click', () => {
    barraIzq.classList.add('active');
    barraIzq.style.width = '300px';
})

fecha.textContent = 'Fecha: ' + date.getDate() + '/' + date.getDay() + '/' + date.getFullYear();