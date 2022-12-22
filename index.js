const { error, time, profile } = require('console')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mysql = require('mysql')
const mongodb = require('mongodb')
const utils = require('./utils/utils.js')


const app = express()
const mongoDBURL = 'mongodb://localhost:27017'
const mongoClient = new mongodb.MongoClient(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const dbconn = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'practice4password!',
    database: 'defaultDB'
})

dbconn.connect( (err) => {
    if (err) {
        throw err;
    } else {

    }
})

app.use(express.static(path.join(__dirname, 'static')))
app.use(bodyParser.urlencoded())
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "static/html/login.html"))
})

app.post('/login', (req, res) => {
    dbconn.query(`SELECT password FROM user_metadata WHERE username='${req.body.username}'`, async (err, rows, fields) => {
        if (typeof rows[0] === "undefined") {
            res.sendFile(path.join(__dirname, "static/html/invalidusername.html"))
        } else if (rows[0].password == req.body.password) {
            await utils.renderProfile(req.body.username, req.body.password).then((profile) => {
                res.render(path.join(__dirname, 'static/html/profile.ejs'), {"profile" : profile})
            }).catch((err) => {
                console.log(err)
            })
        } 
    })
})

app.post('/updateexercises', async (req, res) => {
    //format for exercises should be objects with name, weight and reps. 
    collection = await utils.connectToClient(mongoClient).then(async (mongoClient) => {
        return utils.connectToDatabaseCollection(mongoClient)
        }).then((collection) => {
                return collection
        }).catch((err) => {
                console.log(err)
    }).catch((err) => {
        console.log(err)
    })
    let profile = await utils.renderProfile(req.body.username).then((profile) => {
        return profile; 
    }).catch((err) => {
        console.log(err)
    })
    found = false; 
    for (let i = 0; i < profile.exercise_group_list.length; i++) {
        if (profile.exercise_group_list[i].muscle_group == `${req.body.muscle_group}`) {
            for (let j = 0; j < profile.exercise_group_list[i].exercises.length; j++) {
                if (profile.exercise_group_list[i].exercises[j].name == `${req.body.name}`) {
                    profile.exercise_group_list[i].exercises[j].weight = `${req.body.updateweight}`
                    profile.exercise_group_list[i].exercises[j].reps = `${req.body.updatereps}`
                    found = true; 
                    break; 
                }
            }
            if (found) {
                break;
            }
        }
    }
    console.log(profile.exercise_group_list[0].exercises[0].weight)
    await utils.updateEntry(collection, {
        "username": `${req.body.username}`,
    },
    {
        $set: {
            "exercise_group_list": profile.exercise_group_list
        }
    })
    res.render(path.join(__dirname, 'static/html/profile.ejs'), {"profile" : profile})
})

app.post("/addExercise", async (req, res) => {
    collection = await utils.connectToClient(mongoClient).then((mongoClient) => {
        return utils.connectToDatabaseCollection(mongoClient)
        }).then((collection) => {
                return collection
        }).catch((err) => {
                console.log(err)
    }).catch((err) => {
        console.log(err)
    })
    let profile = await utils.renderProfile(req.body.username).then((profile) => {
        return profile; 
    }).catch((err) => {
        console.log(err)
    })
    for (let i = 0; i < profile.exercise_group_list.length; i++) {
        if (profile.exercise_group_list[i].muscle_group == `${req.body.muscle_group}`) {
            profile.exercise_group_list[i].exercises.push({
                "name": `${req.body.newname}`,
                "weight": `${req.body.weight}`,
                "reps": `${req.body.reps}`
            })
            break;
        }
    }
    await utils.updateEntry(collection, {
        "username": `${req.body.username}`,
    },
    {
        $set: {
            "exercise_group_list": profile.exercise_group_list
        }
    }).then((status) => {
        console.log(status)
    }).catch((err) => {
        console.log(err)
    })   
    utils.renderProfile(req.body.username).then((profile) => {
        res.render(path.join(__dirname, 'static/html/profile.ejs'), {"profile" : profile})
    }).catch((err) => {
        console.log(err)
    })

})

app.get('/registrationPage', (req, res) => {
    res.sendFile(path.join(__dirname, "static/html/register.html"))
})

// to add the user to the metadata mysql table and the nosql exercises table
app.post('/register', async (req, res) => {
    dateTime    = new Date() //Convert string or number to date
    let day     = dateTime.getDate() 
    let month   = dateTime.getUTCMonth() + 1 
    let year    = dateTime.getFullYear() 
    if (month.length < 2) {
        month = "0" + month;
    }
    if (day.length < 2) {
        day = "0" + day; 
    }
    let updateD = `${year}-${month}-${day}`
    try {
        dbconn.query(`INSERT INTO user_metadata (FirstName, LastName, JoinDate, DateOfBirth, username, password) VALUES ('${req.body.firstname}', '${req.body.lastname}', '2022-12-06', '1994-02-20', '${req.body.username}', '${req.body.password}');`)
    } catch (err) {
        console.log(err)
        res.sendFile(path.join(__dirname), "/static/html/503.html")
    }

    collection = await utils.connectToClient(mongoClient).then((mongoClient) => {
        return utils.connectToDatabaseCollection(mongoClient)
        }).then((collection) => {
                return collection
        }).catch((err) => {
                console.log(err)
    }).catch((err) => {
        console.log(err)
    })
    collection.insertOne({
        "name": `${req.body.firstname} ${req.body.lastname}`,
        "username": `${req.body.username}`,
        "exercise_group_list": [
            {
                "muscle_group": "chest", 
                "exercises": [
                ]
            },
            {
                "muscle_group": "back", 
                "exercises": [
                ]
            },
            {
                "muscle_group": "legs", 
                "exercises": [
                ]
            },
            {
                "muscle_group": "triceps", 
                "exercises": [
                ]
            },
            {
                "muscle_group": "biceps", 
                "exercises": [
                ]
            },
            {
                "muscle_group": "shoulders", 
                "exercises": [
                ]
            },
            {
                "muscle_group": "forearms", 
                "exercises": [
                ]
            },
            {
                "muscle_group": "abs", 
                "exercises": [
                ]
            }
        ]
    }) 
    res.sendFile(path.join(__dirname, "static/html/registrationconfirmation.html"))

})


// the profile page should have a function to add lifts. 

// should later dehardcode the port
app.listen(3000, (err) => {
    if (err) {
        console.log("Error starting application on port 3000")
    } else {
        console.log("application started on port 3000")
    }
})