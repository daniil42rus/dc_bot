
const { MongoClient } = require('mongodb');


const url = process.env.DB_URL;
const mongoClient = new MongoClient(url)

const connect = async () => {
    try {
        await mongoClient.connect();
        console.log('соединение есть');
        const db = mongoClient.db('tgBot');

        return db
    } catch (error) {
        console.log(error);
    }
}


module.exports.connect = connect