const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');


// Crear una tarea
// api/tasks
router.post('/',
    auth,
    [
        check('name', 'El Nombre es obligatorio').not().isEmpty(),
        check('projectId', 'El Proyecto es obligatorio').not().isEmpty()
    ],
    taskController.createTask
);

// Obtener las tareas por proyecto
router.get('/',
    auth,
    taskController.getTasks
);

// Actualizar tarea
router.put('/:id',
    auth,
    taskController.updTask
)

// Eliminar una tarea
router.delete('/:id',
    auth,
    taskController.dltTask
)

module.exports = router;