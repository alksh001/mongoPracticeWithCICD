const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoURL = 'mongodb+srv://alok271992:USsjnOvIdDz6xZu4@cluster0.k7hfd2k.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'

let _db;

const initdb = callback => {
    if (_db) {
        console.log("Database is already initialized");
        return callback(null, _db);
    }
    MongoClient.connect(mongoURL)
        .then(client => {
            console.log("Database connected");
            _db = client;
            callback(null, _db)
        })
        .catch(err => {
            callback(err);
        });
}


const getDb = () => {
    if (!_db) {
        throw new Error('Database not initialized');
    }
    return _db;
}

module.exports = {
    initdb, getDb
}