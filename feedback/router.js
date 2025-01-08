/*
    Ruta: /api/feedback
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getFeedbacks, crearFeedback, actualizarFeedback, borrarFeedback, getFeedback, getFeedbacksAll, adoptarFeedback } = require('../feedback/controller');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


router.get( '/:uid', getFeedbacks );
router.get( '/', getFeedbacksAll );
router.get( '/details/:id', getFeedback );
router.post( '/',validarJWT,crearFeedback);

router.put( '/:id',
    [
        validarJWT,
        validarCampos,
    ],
    actualizarFeedback
);
router.put( '/adopta/:id',
    [
        validarJWT,
        validarCampos,
    ],
    adoptarFeedback
);
router.delete( '/:id',
    validarJWT,
    borrarFeedback
);



module.exports = router;