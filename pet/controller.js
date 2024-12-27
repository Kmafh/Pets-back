const { response } = require('express');

const Pet = require('../pet/model');
const User = require('../user/model');
const Solicitud = require('../solicitud/model');
const Notification = require('../notifications/model');

const { generarJWT } = require('../helpers/jwt');

const getPetsAll = async(req, res) => {

    try {
        const [ pets ] = await Promise.all([
            Pet.find({ active: true})
        ]);
    
        res.json({
            ok: true,
            pets,
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Hable con el administrador'
        })
    }
    
}
const getPets = async(req, res) => {
    const uid = req.params.uid;

    try {
        const [pets] = await Promise.all([
            Pet.find({ active: true, uid }) // Obtén todas las mascotas activas del usuario
          ]);
          
          // Itera sobre cada mascota y asocia las solicitudes correspondientes
          const petsConSolicitudes = await Promise.all(
            pets.map(async (pet) => {
              const solicitudes = await Solicitud.find({ petId: pet.id, active: true });
          
              // Para cada solicitud, agrega el usuario correspondiente
              const solicitudesConUsuarios = await Promise.all(
                solicitudes.map(async (solicitud) => {
                  const user = await User.findById(solicitud.uid).select('name email img');
                  return {
                    ...solicitud._doc, // Datos de la solicitud
                    user, // Datos del usuario
                  };
                })
              );
          
              // Retorna la mascota con sus solicitudes
              return {
                ...pet._doc, // Datos de la mascota
                solicitudes: solicitudesConUsuarios, // Solicitudes con usuarios
              };
            })
          );
          const [ notification ] = await Promise.all([
            Notification.find({ active: true,uid })
        ]);
          // Estructura de datos a enviar
          const data = { pets: petsConSolicitudes, notification };
          
          res.json({
            ok: true,
            data,
          });
          
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Hable con el administrador'
        })
    }
    
}

const getPet = async (req, res = response) => {
    // TODO: Validar token y comprobar si es el pet correcto
    const id = req.params.id;
    try {
        const petDB = await Pet.find( {_id:id} );
        if ( !petDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un pet por ese id'
            });
        }
        const pet = await Pet.findById(id);
        const user = await User.findOne({_id:pet.uid});
        const solicitud = await Solicitud.find({ petId: pet.id, active: true })
        const solicitudesConUsuarios = await Promise.all(
            solicitud.map(async (solicitud) => {
              const user = await User.findById(solicitud.uid).select('name email img'); // Trae solo los campos necesarios
              return {
                ...solicitud._doc, // Incluye los datos originales de la solicitud
                user, // Agrega los datos del usuario
              };
            })
          );
        const data = {pet,user,solicitud:solicitudesConUsuarios}
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

const crearPet = async(req, res = response) => {
    try {
        
        const pet = new Pet( req.body );
        // Guardar pet
        await pet.save();
        res.json({
            ok: true,
            pet,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}


const actualizarPet = async (req, res = response) => {
    // TODO: Validar token y comprobar si es el pet correcto
    const uid = req.params.id;
    try {
        const petDB = await Pet.findById( uid );
        if ( !petDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un pet por ese id'
            });
        }
        // Actualizaciones
        const { password, google, email,  ...campos } = req.body;
        if ( petDB.email !== email ) {
            const existeEmail = await Pet.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un pet con ese email'
                });
            }
        }
        if ( !petDB.google ){
            campos.email = email;
        } else if ( petDB.email !== email ) {
            return res.status(400).json({
                ok: false,
                msg: 'Pet de google no pueden cambiar su correo'
            });
        }
        const petActualizado = await Pet.findByIdAndUpdate( uid, campos, { new: true } );
        res.json({
            ok: true,
            pet: petActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarPet = async(req, res = response ) => {
    const uid = req.params.id;
    try {
        const petDB = await Pet.findById( uid );
        if ( !petDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un pet por ese id'
            });
        }
        await Pet.findByIdAndDelete( uid );
        res.json({
            ok: true,
            msg: 'Pet eliminado'
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
    getPets,
    crearPet,
    actualizarPet,
    borrarPet,
    getPet,
    getPetsAll
}