const { Schema, model } = require('mongoose');

const FeedbackSchema = Schema({
    uid: {
        type: String,
        required: true
    },
    toId: {
        type: String,
        required: true
    },
    point: {
        type: Number,
        default: 5
    },
    text: {
        type: String,
        required: true
    },
    createAd: {
        type: Date,
        default:new Date()
    },
    active: {
        type: Boolean,
        default:true
    },

});


FeedbackSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})



module.exports = model( 'Feedback', FeedbackSchema );
