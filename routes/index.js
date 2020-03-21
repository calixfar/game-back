const express = require('express');
const usuarioController = require('../controller/usuarioController');
const authController = require('../controller/authController');
const proyectosController = require('../controller/proyectosController');
const tareaController = require('../controller/tareaController');
const salaController = require('./../controller/salaController');
const pagosController = require("../controller/pagosController");
const router = express.Router();
const {check} = require('express-validator');

const auth = require('../middleware/auth');
module.exports = () => {

    router.post('/api/usuarios', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser minimo de 8 caracteres').isLength({min: 6})
    ] ,usuarioController.crearUsuario);

    router.post('/', [
        check('email', 'Email inválido').isEmail(),
        check('password', 'El password debe ser minimo de 8 caracteres').isLength({min: 6})
    ], authController.authUsuario)
    router.get('/api/auth', auth, authController.usuarioAutenticado);
    //PROYECTOS

    router.post('/api/proyectos', auth, 
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ], 
    proyectosController.crearProyecto);
    router.get('/api/proyectos', auth, proyectosController.obtenerProyectos);
    router.get('/api/proyectosById', auth, proyectosController.obtenerProyectosById);
    router.put('/api/proyectos/:id', auth, [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ] , proyectosController.actualizarProyecto);
    router.delete('/api/proyectos/:id', auth, proyectosController.eliminarProyecto);

    //TAREAS

    router.post('/api/tareas', auth, [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ], tareaController.nuevaTarea);
    router.get('/api/tareas', auth, tareaController.obtenerTareas);
    router.put('/api/tareas/:id', auth, tareaController.actualizarTarea);
    router.delete('/api/tareas/:id', auth, tareaController.eliminarTarea);

    //SALAS
    router.post('/api/salas', auth, salaController.crearSala);
    router.put('/api/salas/agregar-usuario', auth, salaController.agregarUsuario);
    router.get('/api/salas', auth, salaController.obtenerSalas);

    //PAGOS
    router.post('/api/pagos', auth, pagosController.insertarPago);
    return router;
}

    // router.post('/api/usuarios', usuarioController.crearUsuario);
    // router.get('/api/usuarios', usuarioController.mostrarUsuarios);

