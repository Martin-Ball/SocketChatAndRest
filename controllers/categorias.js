const { response } = require("express");
const { Categoria } = require('../models')

//ObtenerCategorias - paginado - total
const obtenerCategorias = async(req, res = response) => {

    // const {q, nombre = '', apikey, page, limit} = req.query
    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    //promise.all permite mandar un arreglo con todas las promesas que quiero que se ejecuten
    //total es el resultado de la primer promesa y usuarios la segunda, no importa el tiempo de ejecucion
    const [ total, categorias ]  = await Promise.all([
        //Promise 1
        Categoria.count(query),
        //Promise 2
        Categoria.find(query)
        .populate('usuario', 'nombre')
         .limit(Number(limite))
         .skip(Number(desde))
    ])

    res.json({
        total,
        categorias
    })
}

//ObtenerCategoria - paginado - total
const obtenerCategoria = async(req, res = response) => {

    const { id } = req.params
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre')

    res.json(categoria)
}

const crearCategoria = async(req, res = response) => {

    try {
        const nombre = req.body.nombre.toUpperCase()

        const categoriaDB = await Categoria.findOne({nombre})
    
        if(categoriaDB){
            return res.status(400).json({
                msg: `La categoria ${categoriaDB.nombre}, ya existe`
            })
        }
    
        //Generar la data a guardar
        const data = {
            nombre, 
            usuario: req.usuario._id
        }
    
        const categoria = new Categoria(data)
        await categoria.save() 
        res.status(200).json(categoria)

    } catch (error) {
        console.log(error)
    }
    
}

//ActualizarCategoria - populate
const actualizarCategorias = async(req, res = response) => {

    try {
        const { id } = req.params
        const { estado, usuario, ...data } = req.body

        data.nombre = data.nombre.toUpperCase()
        data.usuario = req.usuario._id

        const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true })

        res.status(200).json(categoria)
    } catch (error) {
        console.log(error)
    }
    
}

//BorrarCategoria - populate
const borrarCategoria = async(req, res = response) => {
    try {
        const { id } = req.params

        const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, { new: true })

        res.status(200).json(categoriaBorrada)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategorias,
    borrarCategoria
}