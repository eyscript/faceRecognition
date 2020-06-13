const express=require('express');
const bodyParser=require('body-parser');
const bcrypt=require('bcrypt-nodejs');
const cors=require('cors');
const knex=require('knex');
const Clarifai=require('clarifai');

const register = require('./controlers/register');
const image=require('./controlers/image');


const app=express();
app.use(bodyParser.json());
app.use(cors());



var bd=knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '9o$TG7r35',
      database : 'db'
    }
  });

  bd.select('*').from('users').then(data=>console.log(data))


  app.get('/',(req, res)=>{
    res.json("sucess");

})


app.post('/signin', (req,res)=>{
bd.select('email', 'hash').from('login')
.where('email', '=', req.body.email)
.then(data=>{
 const isvalid=   bcrypt.compareSync(req.body.password, data[0].hash);
 console.log(isvalid)
 if(isvalid){
  return   bd.select('*').from('users')
     .where('email', '=', req.body.email)
     .then(user=>{
         console.log(user);
         res.json(user[0])
     })
     .catch(err=>res.status(400).json("unable to get user"))
 }
 else{
    res.status(400).json("wrong credentials")
 }
    })  
    .catch(err=>res.status(400).json("wrong credentials"))
})

app.post('/register', (req,res)=>{register.handleRegister(req,res,bcrypt, bd)})
    /* bd('users')
    .returning('*')
    .insert(
        {name:name, email:email, joined:new Date()}
    ).then(response=>res.json(response[0]))
    .catch((err)=>res.status(400).json("unable to register"))
    
   */

        




app.get('/profile/:id', (req,res)=>{
    const {id}=req.params;
    bd.select('*').from('users').where({id})
    .then(user=>{
        if(user.length){
            res.json(user[0])
        }
        else{
            res.status(400).json("Not found")
        }})
    .catch((err)=>res.status(400).json("error getting user"))
    })

    app.put('/image', (req, res)=>{ image.handleImage(req,res,bd)})
    app.post('/imageurl', (req,res)=>{image.handleAPI(req,res)})
app.listen(3000,()=>{
    console.log("app is running on port 3000");
})