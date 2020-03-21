const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    persona: {
        type: mongoose.Schema.Types.ObjectId
    },
    isLogged: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'jugador'
    },
    registro: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Usuario', usuarioSchema);