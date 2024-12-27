const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../user/model');
const { generarJWT } = require('../helpers/jwt');


const getUsers = async(req, res) => {
    const desde = Number(req.query.desde) || 0;

    try {
        const [ usuarios, total ] = await Promise.all([
            User
                .find({ active: true }, 'name email lastname img rol createAt city country')
                .skip( desde )
                .limit( 5 ),
    
            User.countDocuments()
        ]);
    
        res.json({
            ok: true,
            usuarios,
            total
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Hable con el administrador'
        })
    }
    
}
const getUsersProtected = async (req, res = response) => {
    const desde = Number(req.query.desde) || 0;

    try {
        const [ usuarios ] = await Promise.all([
            User
                .find({ active: true, tipe: "1" }, ' tipe name email lastname img rol createAt city country'),
        ]);
    
        res.json({
            ok: true,
            protected:usuarios
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Hable con el administrador'
        })
    }
}
const getUser = async (req, res = response) => {
    // TODO: Validar token y comprobar si es el usuario correcto
    const uid = req.params.id;
    try {
        const usuarioDB = await User.find( {_id:uid} );
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }
        const user = await User.findById(uid, 'name lastname email img tipe createAt city country');

        res.json({
            ok: true,
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const crearUser = async(req, res = response) => {
    const { email, password } = req.body;
    try {
        const existeEmail = await User.findOne({ email });
        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }
        const usuario = new User( req.body );
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
        usuario.active = true
        // Guardar usuario
        await usuario.save();
        // Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );
        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}


const actualizarUser = async (req, res = response) => {
    // TODO: Validar token y comprobar si es el usuario correcto
    const uid = req.params.id;
    try {
        const usuarioDB = await User.findById( uid );
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }
        // Actualizaciones
        const { password, google, email,  ...campos } = req.body;
        if ( usuarioDB.email !== email ) {
            const existeEmail = await User.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        if ( !usuarioDB.google ){
            campos.email = email;
        } else if ( usuarioDB.email !== email ) {
            return res.status(400).json({
                ok: false,
                msg: 'User de google no pueden cambiar su correo'
            });
        }
        const usuarioActualizado = await User.findByIdAndUpdate( uid, campos, { new: true } );
        res.json({
            ok: true,
            user: usuarioActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarUser = async(req, res = response ) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await User.findById( uid );
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }
        await User.findByIdAndDelete( uid );
        res.json({
            ok: true,
            msg: 'User eliminado'
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
    getUsers,
    crearUser,
    actualizarUser,
    borrarUser,
    getUser,
    getUsersProtected
}