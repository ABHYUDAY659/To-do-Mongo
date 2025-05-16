const express = require('express');
const {UserModel,TodoModel} = require("./db");
const jwt = require("jsonwebtoken");
const JWT_SECRET  = "Ilovekiara";
const mongoose = require("mongoose");
const app = express()
app.use(express.json());
const port = 3000

mongoose.connect("mongodb+srv://Abhyuday:xvUUQbfCubraaxaj@cluster0.s4epypq.mongodb.net/todo-abhyuday?retryWrites=true&w=majority&appName=Cluster0");


app.post('/signup', async(req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;

    await UserModel.create({
        username:username,
        password:password,
        name:name 
    });

  res.json('You are signedup bud!')
})

app.post('/signin', async(req, res) => {
         
    const username = req.body.username;
    const password = req.body.password;

    const user = await UserModel.findOne({
         username : username,
         password:password
    }) 
      console.log(user);

     if(user){
        const token = jwt.sign({
            id: user._id
        }, JWT_SECRET);
        res.json({
            token:token
        });
    }else{
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }

    res.send('Hello World!')
  })

  app.post("/todo", auth, async function(req, res) {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodoModel.create({
        userId,
        title,
        done
    });

    res.json({
        message: "Todo created"
    })
});


app.get("/todos", auth, async function(req, res) {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId
    });

    res.json({
        todos
    })
});

  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function auth(req,res,next){

    const token = req.headers.token;

    const decodedData = jwt.verify(token,JWT_SECRET);

    if(decodedData){
         req.userId = decodedData.id;
         next();
    } else{
        res.status(403).json({
            message:"Incorrect credentials"
        })
    }

}