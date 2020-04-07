const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// Crear una nueva tarea
exports.createTask = async (req, res) => {

    // Revisar si hay errores
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        // Extraer el proyecto y comprobar si existe
        const { projectId } = req.body;

        const project = await Project.findById(projectId);

        if(!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(project.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Creamos la tarea
        const task = new Task(req.body);
        await task.save();
        res.json({ task });

        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Obtiene las tareas por proyecto
exports.getTasks = async (req, res) => {

    try {
        
        // Extraer el proyecto y comprobar si existe
        const { projectId } = req.query;

        const project = await Project.findById(projectId);

        if(!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(project.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Obtener tareas por proyecto
        const tasks = await Task.find({ projectId: projectId }).sort({ created: -1 });
        res.json({ tasks: tasks });

    } catch (error) {
        
        console.log(error);
        res.status(500).send('Hubo un error');

    }
}

// Actualizar una tarea
exports.updTask = async (req, res) => {

    try {

        // Extraer el proyecto y comprobar si existe
        const { projectId, name, status } = req.body;

        // Si la tarea existe o no
        let task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({ msg: 'No existe esa tarea' });
        }

        const project = await Project.findById(projectId);

        if(!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(project.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Crear un objeto con la nueva información
        const newTask = {};
        if(name) { newTask.name = name; newTask.status = status; }

        // Guardar la tarea
        task = await Task.findOneAndUpdate(
            { _id: req.params.id },
            newTask,
            { new: true }
        );

        res.json({ task: task });
        
    } catch (error) {
        
        console.log(error);
        res.status(500).send('Hubo un error');

    }

}

exports.dltTask = async (req, res) => {

    try {

        // Extraer el proyecto y comprobar si existe
        const { projectId } = req.query;

        // Si la tarea existe o no
        let task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({ msg: 'No existe esa tarea' });
        }

        const project = await Project.findById(projectId);

        if(!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(project.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Eliminar
        await Task.findOneAndRemove(
            { _id: req.params.id }
        );
        res.json({ msg: 'Tarea Eliminada' });
        
    } catch (error) {
        
        console.log(error);

    }

}






















