const { response, request} = require('express')
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario')


const usuariosGet = async(req = request, res = response) => {

    // const {q, nombre = '', apikey, page, limit} = req.query
    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }
    //esta forma es mas lenta, ya que el await espera a la respuesta dentro el await para ejecutar la siguiente.
    //Debe realizarse con promises
    //const usuarios = await Usuario.find(query)
    //     .limit(Number(limite))
    //     .skip(Number(desde))

    //const total = await Usuario.countDocuments(query)

    //promise.all permite mandar un arreglo con todas las promesas que quiero que se ejecuten
    //total es el resultado de la primer promesa y usuarios la segunda, no importa el tiempo de ejecucion
    const [ total, usuarios ]  = await Promise.all([
        //Promise 1
        Usuario.count(query),
        //Promise 2
        Usuario.find(query)
         .limit(Number(limite))
         .skip(Number(desde))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async (req, res = response) => {
    const { nombre, correo, password, rol } = req.body
    const usuario = new Usuario({ nombre, correo, password, rol })

    //Encriptar la contraseña (Salt es el numero de vueltas para complicar la contraseña)
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync( password, salt )

    //Guardar en la db
    await usuario.save()

    res.json({usuario})
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params
    const { _id, password, google, correo, ...resto} = req.body

    //TODO validar contra base de datos
    if(password){
        //Encriptar la contraseña (Salt es el numero de vueltas para complicar la contraseña)
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync( password, salt )
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({usuario})
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    })
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    const uid = req.uid
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );
    
    res.json({usuario, uid});
}

module.exports = {
    usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete
}