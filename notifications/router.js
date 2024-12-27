/*
    Ruta: /api/notification
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getNotifications, crearNotification, actualizarNotification, borrarNotification, getNotification, getNotificationsAll } = require('../notifications/controller');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


router.get( '/:uid', validarJWT , getNotifications );
router.get( '/', getNotificationsAll );
router.get( '/details/:id', getNotification );
router.post( '/',crearNotification);

router.put( '/:id',
    [
        validarJWT,
        validarCampos,
    ],
    actualizarNotification
);

router.delete( '/:id',
    validarJWT,
    borrarNotification
);



module.exports = router;