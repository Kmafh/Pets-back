/*
    Ruta: /api/pet
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getPets, crearPet, actualizarPet, borrarPet, getPet, getPetsAll } = require('../pet/controller');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


router.get( '/:uid', validarJWT , getPets );
router.get( '/', getPetsAll );
router.get( '/details/:id', getPet );
router.post( '/',crearPet);

router.put( '/:id',
    [
        validarJWT,
        validarCampos,
    ],
    actualizarPet
);

router.delete( '/:id',
    validarJWT,
    borrarPet
);



module.exports = router;