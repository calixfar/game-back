const mongoose = require('mongoose');

const PagosSchema = new mongoose.Schema({
    email: {
        type: Boolean,
        required: true
    },
    monto: {
        type: String,
        require: true
    },
    fecha: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Pagos', PagosSchema);