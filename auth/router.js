/*
    Path: '/api/login'
*/
const { Router } = require('express');
const { login, googleSignIn, renewToken,sendMail } = require('../auth/controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.post( '/',
    [
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    login
);

router.post( '/google',
    [
        check('token', 'El token de Google es obligatorio').not().isEmpty(),
        validarCampos
    ],
    googleSignIn
)

router.get( '/renew',
    validarJWT,
    renewToken
)

router.post( '/sendMail',
    [
        check('email', 'El email es obligatorio').isEmail(),
       validarCampos
    ],
    sendMail
);




module.exports = router;
