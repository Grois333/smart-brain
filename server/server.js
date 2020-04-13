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

const knex = require('knex');


const app = express();

app.use(bodyParser.json());

app.use(cors());


//CONNECT TO LOCAL POSTGRESQL DATABASE
const db = knex({

     client: 'pg',
     connection: {
     host : '127.0.0.1',
     user : 'isaac',
     password : '12345',
     database : 'smartbrain'

    }

  });


  //Test DB Connection
  //console.log(db.select('*').from('users'));

  //Get Users data from Database
  db.select('*').from('users').then(data => {
    console.log('Users:', data);
  });
  





// //Object variable to store a testing database of users with Postman
// const database = {

//     users: [

//         {
//             id: '123',
//             name: 'John',
//             email: 'john@gmail.com',
//             password: 'cookies',
//             entries: 0,
//             joined: new Date()
//         },


//         {
//             id: '124',
//             name: 'Sally',
//             email: 'sally@gmail.com',
//             password: 'bananas',
//             entries: 0,
//             joined: new Date()
//         }
//     ],

//     login: [

//         {
//             id: '987',
//             hash: '',
//             email: 'john@gmail.com'
//         }
//     ]
// }




//Root Route
app.get('/', (req, res) => {

    // res.send('this is working');

    //response with the users database
    res.send(database.users);
})



//Check the input from the frontend sign in from with the user data from the database
app.post('/signin', (req, res) => {

    // // res.json('signin');


    // // // Load hash from your password DB.
    // // bcrypt.compare('cookies', hash, function(err, res) {

    // //     // result == true
    // //     console.log('first guess', res);
    // // });

    // // bcrypt.compare('veggies', hash, function(err, res) {

    // //     // result == false
    // //     console.log('second guess', res);
    // // });


    // //Testing user John in database (with Postman)
    // // if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    // //     res.json('success');
    // // } else {
    // //     res.status(400).json('error login in');
    // // }

    // if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    //     res.json(database.users[0]);
    // } else {
    //     res.status(400).json('error login in');
    // }


    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      // console.log(isValid);
      if(isValid){
       return db.select('*').from('users')
        .where('email', '=', req.body.email)
        .then(user => {
          res.json(user[0])
        })
         .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json("wrong credentials")
      }
    })
     .catch(err => res.status(400).json('wrong credentials'))



})




//Check input from the frontend register form with the data in the database, insert the data in the database
app.post('/register', (req, res) => {

    //Destructure the request from the body
    const { email, name, password } = req.body;

    //Security in server
    if(!email || !name || !password){
      return res.status(400).json('incorrect form submission');
    }

    //Bcrypt Hash
    const hash = bcrypt.hashSync(password);

    // //Hashing the password with bcrypt
    // bcrypt.hash(password, null, null, function(err, hash) {

    //     // Store hash in your password DB.
    //     console.log(hash);
    // });

    // //Create testing user (Test with Postman)
    // database.users.push({

    //     id: '125',
    //     name: name,
    //     email: email,
    //     //password: password,
    //     entries: 0,
    //     joined: new Date()

    // })
    // res.json(database.users[database.users.length -1]);

    db.transaction(trx => {
        trx.insert({
          hash: hash,
          email: email
    
        })
         .into('login')
         .returning('email')
         .then(loginEmail => {
           return  trx('users')
           .returning('*')
           .insert({
             email: loginEmail[0],
             name: name,
             joined: new Date()
           })
            .then(user => {
              res.json(user[0]);
            })
         })
         .then(trx.commit)
         .catch(trx.rollback)
      })
    
    
       .catch(err => res.status(400).json('unable to register'));
})




//Profile params Route
app.get('/profile/:id', (req, res)=> {

    const { id } = req.params;

    // let found = false;
    // //Loop the users in the database to find them (Test with Postman)
    // database.users.forEach(user => {

    //     if (user.id === id) {

    //         found = true;

    //         return res.json(user);

    //     } 
    // })
    // if (!found){

    //     res.status(400).json('not found');
    // }

    db.select('*').from('users').where({id})
  .then(user => {
    if(user.length){
      res.json(user[0]);
    } else{
      res.status(400).json('Not found')
    }
  })
   .catch(err => res.status(400).json('Error getting user'))
})
//TEST ON BROWSER: http://localhost:3001/profile/1



//Image entries Route
app.put('/image', (req, res) => {

    const { id } = req.body;


    // let found = false;
    // //Loop the users in the database to find them (Test with Postman), Increase the entries
    // database.users.forEach(user => {

    //     if (user.id === id) {

    //         found = true;

    //         user.entries++

    //         return res.json(user.entries);

    //     } 
    // })
    // if (!found){

    //     res.status(400).json('not found');
    // }


    //GET ONLY THE ENTRIES BY INCREMENTING
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
      })
      .catch(err => res.status(400).json('unable to get entries'))


    //GET ALL THE USER AND UPDATE THE ENTRIES
    // db('users')
    // .where('id', '=', id)
    // .returning('*')
    // .update({
    //   entries: entries
    // })
    // .then(user => {
    //   res.json(user[0]);
    // })
    // .catch(err => res.status(400).json('unable to get entries'))
})



app.listen(3001, ()=> {
    console.log('app is running on port 3001')
})