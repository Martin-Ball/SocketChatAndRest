const mongoose = require('mongoose')

const dbConnection = async() => {

    try {
        
        await mongoose.connect( process.env.MONGODB_CONN )

        console.log('Database connected successfully')

    } catch (error) {
        console.log(process.env.MONGODB_CONN)
        console.log(error)
        throw new Error('Error to init at db')
    }

}

module.exports = {
    dbConnection
}
