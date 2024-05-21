const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    // origin: ["http://localhost:5173"],
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

const USER = process.env.DB_NAME;
const PASS = process.env.DB_PASS;

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${USER}:${PASS}@cluster0.yhebin7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );

    const alterChoice = client.db("alterChoiceDB");

    const queries = alterChoice.collection("queries");

    // home page :

    app.get("/newSix", async (req, res) => {
      const options = {
        sort: { dateTime: -1 },
      };

      const cursor = await queries.find({}, options).limit(6).toArray();
      res.send(cursor);
    });

    //all queries page :

    app.get("/queries", async (req, res) => {
      const options = {
        sort: { recommendationCount: -1 },
      };

      const cursor = await queries.find({}, options).toArray();
      res.send(cursor);
    });

    app.post("/addQuery", async (req, res) => {
      const query = req.body;
      //   console.log(query);
      const result = await queries.insertOne(query);
      res.send(result);
    });

    // my queries.

    app.get("/myQueries", async (req, res) => {
      const { email } = req.query;
      const options = {
        sort: { dateTime: -1 },
      };

      const cursor = await queries.find({ email: email }, options).toArray();
      res.send(cursor);
    });

    app.delete("/deleteQuery", async (req, res) => {
      const title = req.query.title;

      const query = { queryTile: title };
      // console.log(query);

      const result = await queries.deleteOne(query);
      res.send(result)
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("AlterChoice server running ");
});

app.listen(port, () => {
  console.log("AlterChoice server port: ", port);
});
