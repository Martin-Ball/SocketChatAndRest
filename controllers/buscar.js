const { response } = require("express");
const { ObjectId } = require('mongoose').Types
const { Usuario, Categoria, Producto, Role } = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
]

const buscarUsuarios = async(termino = '', res = response) =>{

    const esMongoID = ObjectId.isValid(termino)

    if(esMongoID){
        const usuario = await Usuario.findById(termino)
        return res.status(200).json({
            results: (usuario) ? [ usuario ] : [] //si el usuario existe lo mando sino devuelvo un array vacio
        })
    }

    const regex = new RegExp( termino, 'i') //Busqueda no sensible a mayusculas, aparece todo lo que tenga relacion al termino

    const usuarios = await Usuario.find({ 
        $or: [ { nombre : regex }, { correo: regex } ], //El correo o el nombre coincida con la expresion regular
        $and: [{ estado: true }]
    })

    const cantidad = await Usuario.count({ 
        $or: [ { nombre : regex }, { correo: regex } ], //El correo o el nombre coincida con la expresion regular
        $and: [{ estado: true }]
    })

    res.json({
        cantidad: cantidad,
        results: usuarios
    })

}

const buscarCategoria = async(termino = '', res = response) =>{

    const esMongoID = ObjectId.isValid(termino)

    if(esMongoID){
        const categoria = await Categoria.findById(termino)
        return res.status(200).json({
            results: (categoria) ? [ categoria ] : [] //si el usuario existe lo mando sino devuelvo un array vacio
        })
    }

    const regex = new RegExp( termino, 'i') //Busqueda no sensible a mayusculas, aparece todo lo que tenga relacion al termino

    const categoria = await Categoria.find({ 
        $and: [{ estado: true }, { nombre : regex }] //El correo o el nombre coincida con la expresion regular 
    })

    const cantidad = await Categoria.count({ 
        $and: [{ estado: true }, { nombre : regex }]
    })

    res.json({
        cantidad: cantidad,
        results: categoria
    })

}

const buscarProducto = async(termino = '', res = response) =>{

    const esMongoID = ObjectId.isValid(termino)

    if(esMongoID){
        const producto = await Producto.findById(termino).populate('categoria', 'nombre')
        return res.status(200).json({
            results: (producto) ? [ producto ] : [] //si el usuario existe lo mando sino devuelvo un array vacio
        })
    }

    const regex = new RegExp( termino, 'i') //Busqueda no sensible a mayusculas, aparece todo lo que tenga relacion al termino

    const producto = await Producto.find({ 
        $or: [{ nombre : regex }],
        $and: [{ estado: true }] //El correo o el nombre coincida con la expresion regular 
    }).populate('categoria', 'nombre')

    const cantidad = await Producto.count({ 
        $or: [{ nombre : regex }],
        $and: [{ estado: true }] //El correo o el nombre coincida con la expresion regular 
    })

    res.json({
        cantidad: cantidad,
        results: producto
    })

}

const buscarRol = async(termino = '', res = response) =>{

    const esMongoID = ObjectId.isValid(termino)

    if(esMongoID){
        const rol = await Role.findById(termino)
        return res.status(200).json({
            results: (rol) ? [ rol ] : [] //si el usuario existe lo mando sino devuelvo un array vacio
        })
    }

    const regex = new RegExp( termino, 'i') //Busqueda no sensible a mayusculas, aparece todo lo que tenga relacion al termino

    const rol = await Role.find({ 
        $or: [{ nombre : regex }],
        $and: [{ estado: true }] //El correo o el nombre coincida con la expresion regular 
    })

    const cantidad = await Role.count({ 
        $or: [{ nombre : regex }],
        $and: [{ estado: true }] //El correo o el nombre coincida con la expresion regular 
    })

    res.json({
        cantidad: cantidad,
        results: rol
    })

}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
        break
        case 'categoria':
            buscarCategoria(termino, res)
        break
        case 'productos':
            buscarProducto(termino, res)
        break
        case 'roles':
            buscarRol(termino, res)
        break
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            })
    }
}

module.exports = {
    buscar
}