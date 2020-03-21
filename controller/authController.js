const mongoose = require('mongoose');
const Usuario = require('./../models/usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const Persona = require('./../models/persona');

exports.authUsuario = async (req, res) => {
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        res.status(400).json({errores: errores.array()});
    }

    const {email, password} = req.body;
    try {
        const usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({msg: "Usuario no existe"})
        }

        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return res.status(400).json({msg: "Password incorrecto"})
        }
        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        jwt.sign(payload, process.env.SECRET, {expiresIn: 3600},
            (error, token) => {
                if(error) throw error;

                res.json({token});
            });
    } catch (error) {
        console.log(error);
    }
}

exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        const searchPersona = await Persona.findById(usuario.persona);
        console.log(searchPersona);
        res.json({persona: searchPersona});
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Hubo un error"});
    }
}