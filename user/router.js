/*
    Ruta: /api/user
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getUsers, crearUser, actualizarUser, borrarUser, getUser, getUsersProtected } = require('../user/controller');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


router.get( '/', validarJWT , getUsers );
router.get('/protec', getUsersProtected);
router.get( '/:id', getUser );
router.get( '/data/:id', getUser );
router.post( '/',
    [
        check('name', 'El name es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ], 
    crearUser 
);

router.put( '/:id',
    [
        validarJWT,
        validarCampos,
    ],
    actualizarUser
);

router.delete( '/:id',
    validarJWT,
    borrarUser
);



module.exports = router;