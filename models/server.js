const express = require('express')
var cors = require('cors')
const { dbConnection } = require('../database/config')
require('dotenv').config()
const fileUpload = require('express-fileupload')

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT

        this.paths = {
            auth:       '/api/auth',
            categorias: '/api/categorias',
            usuarios:   '/api/usuarios',
            productos:  '/api/productos',
            buscar:     '/api/buscar',
            uploads:    '/api/uploads'
        }

        //Conectar a base de datos
        this.connectDb()

        //Middlewares
        this.middlewares()

        //Rutas de mi aplicación
        this.routes()
    }

    async connectDb(){
        await dbConnection()
    }

    middlewares(){
        //CORS
        this.app.use( cors() )

        //Lectura y parse del body
        this.app.use( express.json() )

        //Directorio publico
        this.app.use( express.static('public') )

        //Subir archivo
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use( this.paths.auth, require('../routes/auth') )
        this.app.use( this.paths.categorias, require('../routes/categorias') )
        this.app.use( this.paths.usuarios, require('../routes/usuarios') )
        this.app.use( this.paths.productos, require('../routes/productos') )
        this.app.use( this.paths.buscar, require('../routes/buscar') )
        this.app.use( this.paths.uploads, require('../routes/uploads') )
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log(`Server is up and running at port ${this.port}`)
        })
    }
}

module.exports = Server;