/*
    Ruta: /api/solicitud
*/
const { Router } = require('express');
const { validarCampos } = require('../middlewares/validar-campos');

const { getSolicituds, crearSolicitud, actualizarSolicitud, borrarSolicitud, getSolicitud, getSolicitudsAll } = require('../solicitud/controller');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


router.get( '/:uid', validarJWT , getSolicituds );
router.get( '/', getSolicitudsAll );
router.get( '/details/:id', getSolicitud );
router.post( '/',crearSolicitud);

router.put( '/:id',
    [
        validarJWT,
        validarCampos,
    ],
    actualizarSolicitud
);

router.delete( '/:id',
    validarJWT,
    borrarSolicitud
);



module.exports = router;