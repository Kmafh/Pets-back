const { response } = require('express');

const Notification = require('../notifications/model');
const User = require('../user/model');
const { generarJWT } = require('../helpers/jwt');

const getNotificationsAll = async(req, res) => {

    try {
        const [ notifications ] = await Promise.all([
            Notification.find({ active: true})
        ]);
    
        res.json({
            ok: true,
            notifications,
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Hable con el administrador'
        })
    }
    
}
const getNotifications = async(req, res) => {
    const uid = req.params.uid;

    try {
        const [ notifications ] = await Promise.all([
            Notification.find({ uid }).sort({ createAt: 1 })
        ]);
    
        res.json({
            ok: true,
            notifications,
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Hable con el administrador'
        })
    }
    
}

const getNotification = async (req, res = response) => {
    // TODO: Validar token y comprobar si es el notification correcto
    const id = req.params.id;
    try {
        const notificationDB = await Notification.find( {_id:id} );
        if ( !notificationDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un notification por ese id'
            });
        }
        const notification = await Notification.findById(id);
        const user = await User.findOne({_id:notification.uid});
        const data = {notification,user}
        res.json({
            ok: true,
            data
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const crearNotification = async(req, res = response) => {
    try {
        
        const notification = new Notification( req.body );
        // Guardar notification
        await notification.save();
        res.json({
            ok: true,
            notification,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}


const actualizarNotification = async (req, res = response) => {
    // TODO: Validar token y comprobar si es el notification correcto
    const uid = req.params.id;
    try {
        const notificationDB = await Notification.findById( uid );
        if ( !notificationDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un notification por ese id'
            });
        }
        const { ...campos } = req.body;

        const notificationActualizado = await Notification.findByIdAndUpdate( uid, campos, { new: true } );
        
        res.json({
            ok: true,
            notification: notificationActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarNotification = async(req, res = response ) => {
    const uid = req.params.id;
    try {
        const notificationDB = await Notification.findById( uid );
        if ( !notificationDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un notification por ese id'
            });
        }
        await Notification.findByIdAndDelete( uid );
        res.json({
            ok: true,
            msg: 'Notification eliminado'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    getNotifications,
    crearNotification,
    actualizarNotification,
    borrarNotification,
    getNotification,
    getNotificationsAll
}