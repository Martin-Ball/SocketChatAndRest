const path = require('path');
const fs   = require('fs');
const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require('../models')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const cargarArchivo = async (req, res = response) => {

    try {

        const nombreCortado = req.files.archivo.name.split('.')
        const extension = nombreCortado[ nombreCortado.length - 1]
        var tipos = undefined
        var carpeta = undefined

       //txt, md
       if(['txt', 'md'].includes(extension)){
        tipos = extension
        carpeta = 'textos'
       }else{
        carpeta = 'img'
       }

       const nombre = await subirArchivo( req.files, tipos, carpeta )

       res.json({
        nombre
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
}

const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }    

        break;

        case 'productos':
            modelo = await Producto.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }    

        break;
    
        default:
            return res.status(500).json({msg: 'No se publico la validacion'})
    }

    //Limpiar imagenes previas
    if(modelo.img){
        //Hay que borrar la img del servidor
        const pathImagen = path.join( __dirname, '../uploads/', coleccion, modelo.img)

        if( fs.existsSync(pathImagen)){
            fs.unlinkSync( pathImagen)
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion)
    modelo.img = nombre

    await modelo.save()

    res.json({
        modelo
    })
}

const mostrarImagen = async (req, res = response) => {
    const{ id, coleccion } = req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }    

        break;

        case 'productos':
            modelo = await Producto.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }    

        break;
    
        default:
            return res.status(500).json({msg: 'No se publico la validacion'})
    }

    //Limpiar imagenes previas
    if(modelo.img){
        //Hay que borrar la img del servidor
        const pathImagen = path.join( __dirname, '../uploads/', coleccion, modelo.img)

        if( fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen)  //Este path lo puedo enviar para ser renderizado en front sin enviar el archivo
        }
    }

    const pathImagen = path.join( __dirname, '../assets/no-image.jpg')

    res.sendFile(pathImagen)
}

//Implementacion con cloudinary
const actualizarImagenCloudinary = async (req, res = response) => {

    const { id, coleccion } = req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }    

        break;

        case 'productos':
            modelo = await Producto.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }    

        break;
    
        default:
            return res.status(500).json({msg: 'No se publico la validacion'})
    }

    //Limpiar imagenes previas
    if(modelo.img){
        const nombreArr = modelo.img.split('/')
        const nombre = nombreArr[ nombreArr.length - 1 ]
        const [ public_id ] = nombre.split('.')

        //borrar de cloudinary 
        cloudinary.uploader.destroy( public_id )
    }

    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

    modelo.img = secure_url
    await modelo.save()

    res.json({
        modelo
    })
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}