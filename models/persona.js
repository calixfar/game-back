const mongoose = require('mongoose');

const PersonaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    pais: {
        type: String,
        required: true,
        trim: true
    },
    tipo: {
        type: String,
        default: 'principiante',
        trim: true
    },
    monedas: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    salas: {
        type: Array
    }
});

module.exports = mongoose.model('Persona', PersonaSchema);