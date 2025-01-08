/*
    Ruta: /api/comment
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getComments, crearComment, actualizarComment, borrarComment, getComment, getCommentsAll } = require('../comment/controller');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


router.get( '/:uid', validarJWT , getComments );
router.get( '/', getCommentsAll );
router.get( '/details/:id', getComment );
router.post( '/',crearComment);

router.put( '/:id',
    [
        validarJWT,
        validarCampos,
    ],
    actualizarComment
);

router.delete( '/:id',
    validarJWT,
    borrarComment
);



module.exports = router;