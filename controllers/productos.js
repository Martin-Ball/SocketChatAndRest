const { response } = require("express");
const { Producto } = require('../models')

//ObtenerCategorias - paginado - total
const obtenerProductos = async(req, res = response) => {

    // const {q, nombre = '', apikey, page, limit} = req.query
    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    //promise.all permite mandar un arreglo con todas las promesas que quiero que se ejecuten
    //total es el resultado de la primer promesa y usuarios la segunda, no importa el tiempo de ejecucion
    const [ total, productos ]  = await Promise.all([
        //Promise 1
        Producto.count(query),
        //Promise 2
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
         .limit(Number(limite))
         .skip(Number(desde))
    ])

    res.json({
        total,
        productos
    })
}

//ObtenerCategoria - paginado - total
const obtenerProducto = async(req, res = response) => {

    const { id } = req.params
    const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre')

    res.json(producto)
}

const crearProducto = async(req, res = response) => {

    try {
        const {estado, usuario, ...body} = req.body

        const productoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() })
    
        if(productoDB){
            return res.status(400).json({
                msg: `El producto ${productoDB.nombre}, ya existe`
            })
        }
    
        //Generar la data a guardar
        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(), 
            usuario: req.usuario._id
        }
    
        const producto = new Producto(data)
        await producto.save() 
        res.status(200).json(producto)

    } catch (error) {
        console.log(error)
    }
    
}

//ActualizarCategoria - populate
const actualizarProducto = async(req, res = response) => {

    try {
        const { id } = req.params
        const { estado, usuario, ...data } = req.body

        if(data.nombre){
            data.nombre = data.nombre.toUpperCase()
        }
    
        data.usuario = req.usuario._id

        const producto = await Producto.findByIdAndUpdate(id, data, { new: true })

        res.status(200).json(producto)
    } catch (error) {
        console.log(error)
    }
    
}

//BorrarCategoria - populate
const borrarProducto = async(req, res = response) => {
    try {
        const { id } = req.params

        const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, { new: true })

        res.status(200).json(productoBorrado)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto
}