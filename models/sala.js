const mongoose = require('mongoose');

const SalaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    valor: {
        type: Number,
        required: true,
        trim: true
    },
    ganancia: {
        type: Number,
        required: true,
        trim: true
    },
    miembros: {
        type: Array
    },
    type: {
        type: String
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId
    },
    creado: {
        type: Date,
        default: Date.now().toString()
    }
});

module.exports = mongoose.model('Salas', SalaSchema);
