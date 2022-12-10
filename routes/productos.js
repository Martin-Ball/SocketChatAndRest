const { Router } = require('express')
const { check } = require('express-validator')
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos')
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')
const { esAdminRole } = require('../middlewares/validar-roles')

const router = Router()

/**
 * {{url}}/api/productos
 */

//Obtener todos las productos - publico
router.get('/', obtenerProductos)

//Obtener todas las categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto)

//Crear productos - private - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos,
], crearProducto)

//Actualizar - privado - cualquier persona con token valido
router.put('/:id',[
    validarJWT,
    check('id').custom( existeProductoPorId ),
    validarCampos
] ,actualizarProducto)

//Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto)


module.exports = router