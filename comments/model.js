const { Schema, model } = require('mongoose');

const CommentSchema = Schema({
    emisorId: {
        type: String,
        required: true
    },
    receptorId: {
        type: String,
        required: true
    },
    petId: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    text: {
        type: String,
    }
});


CommentSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})



module.exports = model( 'Comment', CommentSchema );
