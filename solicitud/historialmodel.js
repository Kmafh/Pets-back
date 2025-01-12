const { Schema, model } = require('mongoose');

const HistorialSolicitudSchema = Schema({
    sid: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        required: true,
        default:new Date()
    },
    status: {
        type: String,
        default: 'Pendiente'
    },
});


HistorialSolicitudSchema.method('toJSON', function() {
    const { __v, _id,  ...object } = this.toObject();
    object.id = _id;
    return object;
})



module.exports = model( 'HistorialSolicitud', HistorialSolicitudSchema );
