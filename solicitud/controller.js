const { response } = require('express');

const Solicitud = require('../solicitud/model');
const Notifications = require('../notifications/model');
const User = require('../user/model');
const Pet = require('../pet/model');
const { generarJWT } = require('../helpers/jwt');

const getSolicitudsAll = async(req, res) => {

    try {
        const [ solicituds ] = await Promise.all([
            Solicitud.find({ active: true})
        ]);
    
        res.json({
            ok: true,
            solicituds,
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Hable con el administrador'
        })
    }
    
}
const getSolicituds = async(req, res) => {
    const uid = req.params.uid;

    try {
        const [ solicituds, total ] = await Promise.all([
            Pet.find({ active: true,uid })
        ]);
    
        res.json({
            ok: true,
            solicituds,
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Hable con el administrador'
        })
    }
    
}

const getSolicitud = async (req, res = response) => {
    // TODO: Validar token y comprobar si es el solicitud correcto
    const id = req.params.id;
    try {
        const solicitudDB = await Solicitud.find( {_id:id} );
        if ( !solicitudDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un solicitud por ese id'
            });
        }
        const solicitud = await Solicitud.findById(id);
        const user = await User.findOne({_id:solicitud.uid});
        const data = {solicitud,user}
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

const crearSolicitud = async(req, res = response) => {
    try {
        
        const solicitud = new Solicitud( req.body );
        // Guardar solicitud
        const solici = await solicitud.save();
        const [ pets ] = await Pet.find({ active: true,_id:req.body.petId  });
        const notification = new Notifications( );
        notification.sid = solici._id, notification.petId = solicitud.petId, notification.uid = pets.uid, notification.text = "Tienes una solicitud de adopción" 
        await notification.save();
        
        res.json({
            ok: true,
            solicitud,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}


const actualizarSolicitud = async (req, res = response) => {
    // TODO: Validar token y comprobar si es el solicitud correcto
    const uid = req.params.id;
    try {
        const solicitudDB = await Solicitud.findById( uid );
        if ( !solicitudDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un solicitud por ese id'
            });
        }
        const campos = req.body;
        const solicitudActualizado = await Solicitud.findByIdAndUpdate( uid, campos, { new: true } );
        const notification = await Notifications.findOne( {sid: solicitudActualizado.id});
        let notificationActualizado = notification
        if (notification) {
          notification.active = false;
        
          notificationActualizado = await Notifications.findByIdAndUpdate(
            notification.id, // Usar el ID directamente
            { active: notification.active }, // Especificar el campo a actualizar
            { new: true } // Retornar el documento actualizado
          );
        }
        const pet = await Pet.findById( {_id: solicitudActualizado.petId});
        let petActualizado = pet

        if (pet) {
            pet.status = solicitudActualizado.status;
            petActualizado = await Pet.findByIdAndUpdate(
                pet.id, // Usar el ID directamente
              { status: pet.status }, // Especificar el campo a actualizar
              { new: true } // Retornar el documento actualizado
            );
          }
          res.json({
            ok: true,
            solicitud: notificationActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarSolicitud = async(req, res = response ) => {
    const uid = req.params.id;
    try {
        const solicitudDB = await Solicitud.findById( uid );
        if ( !solicitudDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un solicitud por ese id'
            });
        }
        await Solicitud.findByIdAndDelete( uid );
        res.json({
            ok: true,
            msg: 'Solicitud eliminado'
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
    getSolicituds,
    crearSolicitud,
    actualizarSolicitud,
    borrarSolicitud,
    getSolicitud,
    getSolicitudsAll
}