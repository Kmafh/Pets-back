const { Schema, model } = require('mongoose');

const SolicitudSchema = Schema({
    uid: {
        type: String,
        required: true
    },
    petId: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        required: true,
        default:new Date()
    },
    active: {
        type: Boolean,
        default:true
    },
    vivienda: {
        type: String,
        required: true
    },
    espacio: {
        type: String,
        required: true
    },
    tiempo: {
        type: String,
        required: true
    },
    viaje: {
        type: String,
        required: true
    },
    gastos: {
        type: String,
        required: true
    },
    nocuidar: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Pendiente'
    },
});


SolicitudSchema.method('toJSON', function() {
    const { __v, _id,  ...object } = this.toObject();
    object.id = _id;
    return object;
})



module.exports = model( 'Solicitud', SolicitudSchema );
