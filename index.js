const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const password = "qCXNbLhx$M53NV";

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://shipon:qCXNbLhx$M53NV@cluster0.dzoti.mongodb.net/learnmongodb?retryWrites=true&w=majority";

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db("learnmongodb").collection("products");

//   Read data from ui
  app.get('/products',(req,res)=>{
    collection.find({})
    .toArray((err,documents)=>{
        res.send(documents);
    })
  })
  
// Post data into server
  app.post('/addProduct',(req,res)=>{
       const product = req.body;
       collection.insertOne(product)
       .then(result => {
           console.log("Data added Successfully");
           res.redirect('/');
       })
  })

//   Load single data in mongoDb
app.get('/product/:id',(req,res)=>{
    collection.find({_id:ObjectId(req.params.id)})
    .toArray((err,documents)=>{
        res.send(documents[0]);
    })
})

// Update data in mongo db
 app.patch('/update/:id',(req,res)=>{
    collection.updateOne({_id:ObjectId(req.params.id)},
        {
            $set: {price:req.body.price,quantity:req.body.quantity}
        }
    )
    .then(result=>{
        res.send(result.modifiedCount > 0);
    })
 })

//   Delete data from mongodb
  app.delete('/delete/:id',(req,res)=>{
      collection.deleteOne({_id:ObjectId(req.params.id)})
      .then(result=> {
          res.send(result.deletedCount > 0)
      })
  })
  
  console.log("Database connected");
  // perform actions on the collection object
//   client.close();
});


app.listen(port,()=>{
    console.log("Listening to 3001");
})
