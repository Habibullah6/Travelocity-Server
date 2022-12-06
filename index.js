const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = process.env.PORT ;
// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h6ly4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
      client.connect()
      const database = client.db("hotel-booking");
      const hotelsCollection = database.collection("hotels");
      const hotelsBooking = database.collection("booking")
      app.get('/hotels', async(req, res) => {
        const cursor = hotelsCollection.find({})
        const result = await cursor.toArray()
        res.send(result)
      })
      
      app.post('/hotels', async(req, res) => {
        const doc = req.body;
        const result = await hotelsCollection.insertOne(doc);
        res.send(result)
      })

      
      app.get('/hotels/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await hotelsCollection.findOne(query);
        res.send(result)
      })
 

      app.post('/bookingHotel', async(req, res) => {
      const doc = req.body;
      const result = await hotelsBooking.insertOne(doc)
      res.send(result)
      })
     
      app.get('/bookingHotel', async(req, res) => {
      const cursor = hotelsBooking.find({})
      const result = await cursor.toArray();
      res.send(result)
      })


      app.get('/bookingHotel/:email', async(req, res) => {
      const email = req.params.email;
      const query = { email:  { $in: [ email ] } }
      
      const result = await hotelsBooking.find(query).toArray()
      
      res.send(result)
      })
     

      app.delete("/bookingHotel/:id", async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await hotelsBooking.deleteOne(query);
        res.send(result)
      })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})