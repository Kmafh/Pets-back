const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
        await mongoose.connect(process.env.DB_CNN);
            console.log("Conection BD OK")
    } catch (error) {
        console.log("ERROR al conectar con BD. "+error)
        // throw new Error("ERROR al conectar con BD")
        }

}

module.exports = {
    dbConnection,
}