/*
    Ruta: /api/favorite
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getFavorites, crearFavorite, actualizarFavorite, borrarFavorite, getFavorite, getFavoritesAll } = require('../favorite/controller');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


router.get( '/:uid', validarJWT , getFavorites );
router.get( '/', getFavoritesAll );
router.get( '/details/:id', getFavorite );
router.post( '/',crearFavorite);

router.put( '/:id',
    [
        validarJWT,
        validarCampos,
    ],
    actualizarFavorite
);

router.delete( '/:id',
    validarJWT,
    borrarFavorite
);



module.exports = router;