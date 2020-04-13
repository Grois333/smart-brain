/*

Routes:

/ --> res = this is working

/signin --> POST  success/fail

/register --> POST = user

/profile/:userId --> GET = user

/image --> PUT --> user


*/

const express = require('express');

const bodyParser = require('body-parser');

const bcrypt = require('bcrypt-nodejs');

const cors = require('cors');


const app = express();

app.use(bodyParser.json());

app.use(cors());





//Object variable to store a testing database of users with Postman
const database = {

    users: [

        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },


        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],

    login: [

        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}


//Root Route
app.get('/', (req, res) => {

    // res.send('this is working');

    //response with the users database
    res.send(database.users);
})



//Check the input from the frontend sign in from with the user data from the database
app.post('/signin', (req, res) => {

    // res.json('signin');


    // // Load hash from your password DB.
    // bcrypt.compare('cookies', hash, function(err, res) {

    //     // result == true
    //     console.log('first guess', res);
    // });

    // bcrypt.compare('veggies', hash, function(err, res) {

    //     // result == false
    //     console.log('second guess', res);
    // });


    //Testing user John in database (with Postman)
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json('success');
    } else {
        res.status(400).json('error login in');
    }
})




//Check input from the frontend register form with the data in the database, insert the data in the database
app.post('/register', (req, res) => {

    //Destructure the request from the body
    const { email, name, password } = req.body;

    // //Hashing the password with bcrypt
    // bcrypt.hash(password, null, null, function(err, hash) {

    //     // Store hash in your password DB.
    //     console.log(hash);
    // });

    //Create testing user (Test with Postman)
    database.users.push({

        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()

    })
    res.json(database.users[database.users.length -1]);
})




//Profile params Route
app.get('/profile/:id', (req, res)=> {

    const { id } = req.params;

    let found = false;

    //Loop the users in the database to find them (Test with Postman)
    database.users.forEach(user => {

        if (user.id === id) {

            found = true;

            return res.json(user);

        } 
    })
    if (!found){

        res.status(400).json('not found');
    }
})



//Image entries Route
app.put('/image', (req, res) => {

    const { id } = req.body;

    let found = false;

    //Loop the users in the database to find them (Test with Postman), Increase the entries
    database.users.forEach(user => {

        if (user.id === id) {

            found = true;

            user.entries++

            return res.json(user.entries);

        } 
    })
    if (!found){

        res.status(400).json('not found');
    }
})



app.listen(3001, ()=> {
    console.log('app is running on port 3001')
})