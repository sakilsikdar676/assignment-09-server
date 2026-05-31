const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  await client.connect();

  const carsCollection = client.db("DriveFleet").collection("cars");
  const bookingCollection = client.db("DriveFleet").collection("booking");


  const JWKS = createRemoteJWKSet(
    new URL('http://localhost:3000/api/auth/jwks')
  )
  const verifyToken = async (req, res, next) => {
    const headers = req.headers.authorization;
    if (!headers) {
      return res
        .status(401)
        .send({ error: true, message: "unauthorized access" });
    }
    const token = headers.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .send({ error: true, message: "unauthorized access" });
    }

    try {
      const { payload } = await jwtVerify(token, JWKS);
    if (!payload) {
      return res
        .status(401)
        .send({ error: true, message: "unauthorized access" });
      }
      console.log(payload);
      next();
    } catch (error) {
      return res
        .status(401)
        .send({ error: true, message: "unauthorized access" });
    }
   

  };

  app.post("/cars", async (req, res) => {
    const car = req.body;
    const result = await carsCollection.insertOne(car);
    res.send(result);
  });

  app.get("/cars", async (req, res) => {
    const result = await carsCollection.find().toArray();
    res.send(result);
  });
  // jhfsavge
  app.get("/cars/:userId", verifyToken, async (req, res) => {
    const id = req.params.userId;
    const query = { _id: new ObjectId(id) };
    const result = await carsCollection.findOne(query);
    res.send(result);
  });

  app.get("/car/:userId", async (req, res) => {
    const { userId } = req.params;
    const result = await carsCollection.find({ userId: userId }).toArray();
    res.send(result);
  });

  app.patch("/cars/:id", async (req, res) => {
    const id = req.params.id;
    const status = req.body;
    console.log(status);

    const query = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: status,
    };
    const result = await carsCollection.updateOne(query, updateDoc);
    res.send(result);
  });

  app.delete("/cars/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await carsCollection.deleteOne(query);
    res.send(result);
  });

  app.post("/booking", async (req, res) => {
    const booking = req.body;
    const result = await bookingCollection.insertOne(booking);
    res.send(result);
  });

  app.get("/booking/:userId", async (req, res) => {
    const { userId } = req.params;
    const result = await bookingCollection.find({ userId: userId }).toArray();
    res.send(result);
  });

  app.delete("/booking/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await bookingCollection.deleteOne(query);
    res.send(result);
  });

  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
