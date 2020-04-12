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

const app = express();

app.use(bodyParser.json());


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
    ]
}


app.get('/', (req, res) => {

    // res.send('this is working');

    //response with the users database
    res.send(database.users);
})

//Check the input from the frontend sign in from with the user data from the database
app.post('/signin', (req, res) => {

    // res.json('signin');

    //Testing users database with Postman
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



app.listen(3000, ()=> {
    console.log('app is running on port 3000')
})