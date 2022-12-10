const { Router } = require('express')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads')
const { coleccionesPermitidas } = require('../helpers/db-validators')
const { validarArchivoSubir } = require('../middlewares/validar-archivo')

const router = Router()

router.post('/', cargarArchivo)

router.put('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
    validarArchivoSubir,
    validarCampos
//], actualizarImagen)
], actualizarImagenCloudinary)

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)

module.exports = router