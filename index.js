const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const app = express()
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = "mongodb://DriveFleet:E5Jia788SLEWg3Ya@ac-gr9dmjz-shard-00-00.qovmzzl.mongodb.net:27017,ac-gr9dmjz-shard-00-01.qovmzzl.mongodb.net:27017,ac-gr9dmjz-shard-00-02.qovmzzl.mongodb.net:27017/?ssl=true&replicaSet=atlas-p996j5-shard-0&authSource=admin&appName=Cluster0";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  
   
    await client.connect();
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
 
}
run().catch(console.dir);

















app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
