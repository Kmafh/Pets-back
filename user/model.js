const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    tipe: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        default:"https://res.cloudinary.com/dxjcjee8f/image/upload/v1734820543/qc8glest13rxo2eq2kio.png"
    },
    google: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    createAt: {
        type: Date,
        required: false,
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
});


UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})



module.exports = model( 'Usuario', UsuarioSchema );
