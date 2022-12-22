
const mongodb = require('mongodb')

const mongoDBURL = 'mongodb://localhost:27017'
const mongoClient = new mongodb.MongoClient(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

async function connectToClient(mongoClient) {
    const promise = new Promise(async (resolve, reject) => {
        await mongoClient.connect((err, client) => {
            if (err) {
                console.log("Error connecting to mongoDB!")
                console.error(err)
                reject(err)
            } else {
                console.log("connected to mongo server on port 27017!")
                resolve(mongoClient)
            }
        })
    })
    return promise    
}

async function connectToDatabaseCollection(mongoClient) {
    const promise = new Promise(async (resolve, reject) => {
        const mongoDatabase = await mongoClient.db('defaultDB', (err) => {
            if (err) {
                reject(err)
            }
        })
        console.log("database connected")
        const collection = await mongoDatabase.collection('user_exercises')
        if (collection == null) {
            reject(collection)
        }
        console.log("connected to collection")
        resolve(collection)
    })
    return promise
}

async function renderProfile(username) {
    collection = await connectToClient(mongoClient).then(async (mongoClient) => {
            return connectToDatabaseCollection(mongoClient)
        }).then((collection) => {
                return collection
        }).catch((err) => {
                console.log(err)
    }).catch((err) => {
        console.log(err)
    })
    const promise = new Promise((resolve, reject) => {
        collection.findOne({"username": username}, (err, result) => {
            if (err) {
                console.log(err)
                reject(result)
            } else {
                resolve(result)
            }  
        })

    })
    return promise
}

async function updateEntry(collection, filter, data) {

    const promise = new Promise(async (resolve, reject) => {
        await collection.updateOne(filter, data, {"upsert": true}, (err) => {
            if (err) {
                reject("Failed to find element")
            }

        })
        resolve("entry updated")

    })
    return promise
}

module.exports = {renderProfile, connectToClient, connectToDatabaseCollection, updateEntry}