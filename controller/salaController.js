
const Sala = require('./../models/sala');
const Usuario = require('./../models/usuario');
const Persona = require('./../models/persona');




exports.crearSala = async (req, res) => {
    const { usuario } = req;
    try {
        const searchUser = await Usuario.findById(usuario.id);
        if(searchUser.type !== 'administrador') {
            const error = new Error();
            error.name = 'no permitido';
            error.message = "Usuario no valido";
            throw error;
        }
        console.log(req.body);
        const newSala = new Sala(req.body);
        newSala.creador = usuario.id;
        await newSala.save();
        res.json({sala: newSala});
    } catch (error) {
        console.log(error);
        if(error.name === 'no permitido'){
            res.status(401).json({message: error.message});
        }
    }
}

exports.agregarUsuario = async (req, res) => {
    const { usuario } = req;
    try {
        const { id } = req.body;
        console.log(id);
        const searchUsuario = await Usuario.findById({_id: usuario.id});
        console.log(searchUsuario);
        const searchSala = await Sala.findById(id);
        console.log(searchSala);
        let isUserInRoom = validateUserInRoom(searchUsuario.persona, searchSala);
        console.log(isUserInRoom);
        if(isUserInRoom){
            const error = new Error;
            error.message = "User is registed";
            throw error;
        }
        const searchPerson = await Persona.findById({_id: searchUsuario.persona});
        if(searchPerson.monedas < searchSala.valor) {
            const error = new Error;
            error.message = "Coins insuficientes";
            throw error;
        }
        const sala = await Sala.findOneAndUpdate({_id: id}, {$push: {miembros: {person: searchUsuario.persona}}}, {new: true});
        console.log(sala)
        await Persona.findByIdAndUpdate({_id: searchUsuario.persona}, 
            {
                $push: {salas: {sala: searchSala._id}},
                monedas: searchPerson.monedas - searchSala.valor
            
            });
        res.json({
            status: true,
            sala
        });
    } catch (error) {
        res.json({
            status: false,
            error
        })
    }
}

const validateUserInRoom = (idPerson, sala) => {
    let isUserInRoom = false;
    console.log(sala);
    for(let i = 0; i < sala.miembros.length; i++) {
        console.log(sala.miembros[i].person, idPerson);
        if(sala.miembros[i].person.toString() === idPerson.toString()){
            console.log('object')
           isUserInRoom = true;
            break;
        }
    }
    return isUserInRoom;
}

exports.obtenerSalas = async (req, res) => {
    try {
        const salas = await Sala.find();
        res.json({salas});
    } catch (error) {
        console.log(error)
        res.json({msg: "Ocurrio un error"})
    }
}