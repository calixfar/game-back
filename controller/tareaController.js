const mongoose = require('mongoose');
const Tarea = require('../models/tarea');
const Proyecto = require('../models/proyecto');
const { validationResult } = require('express-validator');


exports.nuevaTarea = async (req, res) => {
    const  errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errors: errores.array()});
    }
    try {
        const { proyecto } = req.body;
        const existProyecto = await Proyecto.findById(proyecto);
        if(!existProyecto) {
            return res.status(404).json({msg: "Proyecto no encontrado"});
        }
        if(existProyecto.creador.toString() !== req.usuario.id) {
            return res.status(400).json({msg: "Usuario no autorizado"});
        }
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }

}

exports.obtenerTareas = async (req, res) => {
    try {
        const { proyecto } = req.body;
        const existProyecto = await Proyecto.findById(proyecto);
        if(!existProyecto) {
            return res.status(404).json({msg: "Proyecto no encontrado"});
        }
        if(existProyecto.creador.toString() !== req.usuario.id) {
            return res.status(400).json({msg: "Usuario no autorizado"});
        }
        const tareas = await Tarea.find({proyecto});
        res.json({tareas});
    } catch (error) {
        res.status(500).json({msg: 'Hubo un error'});
    }
}

exports.actualizarTarea = async (req, res) => {
    try {
        const { proyecto, nombre, estado } = req.body;
        
        const existTarea = await Tarea.findById(req.params.id);

        if(!existTarea) {
            return res.status(404).json({msg: "No existe esta tarea"});
        }
        const existProyecto = await Proyecto.findById(proyecto);
        if(existProyecto.creador.toString() !== req.usuario.id) {
            return res.status(400).json({msg: "Usuario no autorizado"});
        }
        const newTarea = {};

        if(nombre) newTarea.nombre = nombre;
        if(estado) newTarea.estado = estado;

        const tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, newTarea, {new: true});

        res.json({tarea});
    } catch (error) {
        res.status(500).json({msg: 'Hubo un error'});
    }
}

exports.eliminarTarea = async ( req, res ) => {
    try {
        const { proyecto } = req.body;
        
        const existTarea = await Tarea.findById(req.params.id);

        if(!existTarea) {
            return res.status(404).json({msg: "No existe esta tarea"});
        }
        const existProyecto = await Proyecto.findById(proyecto);
        if(existProyecto.creador.toString() !== req.usuario.id) {
            return res.status(400).json({msg: "Usuario no autorizado"});
        }
        await Tarea.findOneAndDelete({_id: req.params.id});
        res.json({msg: "Tarea eliminada"});
    } catch (error) {
        res.status(500).json({msg: 'Hubo un error'});
    }   
}