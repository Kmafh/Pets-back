const { Schema, model } = require('mongoose');

const PetSchema = Schema({
    uid: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    specie: {
        type: String,
        required: true
    },
    dog: {
        type: String,
    },
    cat: {
        type: String,
    },
    age: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        required: true
    },
    adoptionAt: {
        type: Date,
        default: new Date()
    },
    sex: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    send: {
        type: String,
    },
    telf: {
        type: String,
    },
    subject: {
        type: String,
    },
    history: {
        type: String,
    },
    alergia: {
        type: Boolean,
        default:false
    },
    tratamiento: {
        type: Boolean,
        default:false
    },
    leishmania: {
        type: Boolean,
        default:false
    },
    inmunodeficiencia: {
        type: Boolean,
        default:false
    },
    leucemia: {
        type: Boolean,
        default:false
    },
    ppp: {
        type: Boolean,
        default:false
    },
    dogs: {
        type: Boolean,
        default:false
    },
    cats: {
        type: Boolean,
        default:false
    },
    niños: {
        type: Boolean,
        default:false
    },
    car: {
        type: Boolean,
        default:false
    },
    active: {
        type: Boolean,
        default:true
    },
    cartilla: {
        type: Boolean,
        default:false
    },
    despa: {
        type: Boolean,
        default:false
    },
    ester: {
        type: Boolean,
        default:false
    },
    vacuna: {
        type: Boolean,
        default:false
    },
    chip: {
        type: Boolean,
        default:false
    },
    images: {
        type: [String],
    }  

});


PetSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.id = _id;
    return object;
})



module.exports = model( 'Pet', PetSchema );
