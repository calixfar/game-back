const mongoose = require('mongoose');
const Usuario = require('./../models/usuario');
const Persona = require('./../models/persona');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    console.log(req.body);
    const {email, password, nombre, pais} = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log('entro');
        return res.status(400).json({errors: errors.array()})
    }
    try {
        let usuario = await Usuario.find({email});
        if(usuario.length > 0) {
            return res.status(400).json({
                status: false,
                message: "El usuario ya existe"
            })
        }
        let newUsuario = new Usuario(req.body);
        const dataPersona = {
            nombre,
            pais,
            user: newUsuario._id
        }
        const newPersona = new Persona(dataPersona);
        console.log(newPersona);
        const salt = await bcryptjs.genSalt(10);
        newUsuario.password = await bcryptjs.hash(password, salt);
        newUsuario.persona = newPersona._id;
        await newUsuario.save();
        await newPersona.save();
        const payload = {
            usuario: {
                id: newUsuario.id
            }
        };
        jwt.sign(payload, process.env.SECRET, {expiresIn: 3600},
            (error, token) => {
                if(error) throw error;

                res.json({token});
            });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: false,
            message: "Error"
        })
    }
}

exports.mostrarUsuarios = (req,res) => {
    res.send("get");
}