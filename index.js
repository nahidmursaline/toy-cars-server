const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors())
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ltkvgnf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const addToy = client.db('toyCars').collection('addToy')

    app.post('/addToy', async(req, res)=> {
      const add = req.body;
      console.log(add)
      const result = await addToy.insertOne(add);
      res.send(result)

    })

    app.get('/addToy/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await addToy.findOne(query)
      res.send(result);
    })

    app.put('/addToy/:id', async(req, res)=> {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedToy = req.body;
      const toy = {
        $set: {
          name: updatedToy.name,
           quantity: updatedToy.quantity,
           description: updatedToy.description,
          price: updatedToy.price,
           rating: updatedToy.rating
        }
      }
      const result = await addToy.updateOne(filter, toy, options)
      res.send(result);

    })



    app.get('/addAllToys', async(req, res) => {
      const cursor = addToy.find();
      const result = await cursor.toArray()
      res.send(result);
    })

    app.get('/addToy', async(req, res) => {
      let query = {};
      if(req.query?.sellerEmail){
        query = {sellerEmail: req.query.sellerEmail}
      }
      const result = await addToy.find(query).toArray();
      res.send(result);
    })

    app.delete('/addToy/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await addToy.deleteOne(query);
      res.send(result)
    })

    // app.patch('/addToy/:id', async(req, res)=> {
     
    //   const id = req.params.id;
    //   const filter = {_id: new ObjectId(id)}
    //   const updatedToy = req.body;
    //   const updatedDoc ={
    //     $set: {
    //       status: updatedToy.status
    //     }
    //   }

    // })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);














app.get('/', (req, res)=> {
    res.send('toy is running')
})

app.listen(port, ()=> {
    console.log(`toy is running on port ${port}`)
})