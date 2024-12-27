const { Schema, model } = require('mongoose');

const NotificationSchema = Schema({
    uid: {
        type: String,
    },
    sid: {
        type: String,
        required: true
    },
    petId: {
        type: String,
        required: true
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


NotificationSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.id = _id;
    return object;
})



module.exports = model( 'Notification', NotificationSchema );
