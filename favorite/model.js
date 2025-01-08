const { Schema, model } = require('mongoose');

const FavoriteSchema = Schema({
    uid: {
        type: String,
        required: true
    },
    tipe: {
        type: String,
        required: true
    },
    reciveId: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: new Date(),
    },

});


FavoriteSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})



module.exports = model( 'Favorite', FavoriteSchema );
