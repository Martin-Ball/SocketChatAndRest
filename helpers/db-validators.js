const { Usuario, Categoria, Producto } = require('../models')
const Role = require('../models/role')

const esRoleValido = async( rol = '' ) => {
    const existeRol = await Role.findOne({ rol } )
    if(!existeRol){
        throw new Error(`El rol ${ rol } no esta registrado en la DB`)
    }
}

const emailExiste = async( correo = '') => {
    const mailExiste= await Usuario.findOne({ correo })
    if(mailExiste){
        throw new Error(`El correo ${ correo } ya esta registrado`)
    }
}

const existeUsuarioPorID = async( id ) => {
    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

const existeCategoriaPorId = async( id ) => {
    // Verificar si el correo existe
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

const existeProductoPorId = async( id ) => {
    // Verificar si el correo existe
    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

//Validar colecciones permitidas
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion)
    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
    }

    return true
}

module.exports = {
    esRoleValido, 
    emailExiste, 
    existeUsuarioPorID, 
    existeCategoriaPorId, 
    existeProductoPorId,
    coleccionesPermitidas,
}