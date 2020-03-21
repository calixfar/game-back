const Proyectos  = require('../models/proyecto');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    const  errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errors: errores.array()});
    }

    try {
        const newProyect = new Proyectos(req.body);
        newProyect.creador = req.usuario.id;
        newProyect.save();
        res.json({newProyect});
        
    } catch (error) {
        res.status(400).json({msg: "Error al guardar"});
    }
}

exports.obtenerProyectos = async ( req, res ) => {
    try {   
        const proyectos = await Proyectos.find();
        res.json({proyectos});
    } catch (error) {
        res.status(400).json({msg: "Error al obtener los proyectos"});
    }
}

exports.obtenerProyectosById = async ( req, res ) => {
    try {   
        const proyectos = await Proyectos.find({creador: req.usuario.id});
        res.json({proyectos});
    } catch (error) {
        res.status(400).json({msg: "Error al obtener los proyectos"});
    }
}

exports.actualizarProyecto = async (req, res) => {
    const errores = validationResult(req);
    if(!errores.isEmpty()) return res.status(400).json({errores: errores.array()});
    const { nombre } = req.body;
    let  nuevoProyecto = {};
    if(nombre) {
        nuevoProyecto.nombre = nombre;
    }
    try {
        let proyecto = await Proyectos.findById(req.params.id);
        if(!proyecto) {
            return res.status(404).json({msg: "El proyecto no existe"});
        }
        if( proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: "Usuario no autorizado"});

        }
        proyecto = await Proyectos.findByIdAndUpdate({_id: req.params.id}, {$set: nuevoProyecto} , {new: true});
        res.json({proyecto});
    } catch (error) {
        res.status(400).json({msg: "Error al actualizar el proyecto"});
        
    }
}

exports.eliminarProyecto= async (req, res) => {
    console.log(req.params.id)
    try {
        let proyecto = await Proyectos.findById(req.params.id);
        if(!proyecto) {
            return res.status(404).json({msg: "El proyecto no existe"});
        }
        if( proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: "Usuario no autorizado"});
        }
        await Proyectos.findOneAndRemove({_id: req.params.id});
        res.json({msg: "Proyecto eliminado"});
    } catch (error) {
        res.status(500).json({msg: "Error al eliminar el proyecto"});
        
    }
}   