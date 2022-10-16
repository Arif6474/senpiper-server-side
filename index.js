const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Running my node CRUD server");
});

const uri =`mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASS}@cluster0.if7uihp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("mongodb connected");
    const feedbackCollection = client.db("senpiper").collection("feedbacks");
    //post feedback
    app.post('/feedback', async (req, res) =>{
        const feedback = req.body;
        const result= await feedbackCollection.insertOne(feedback);
        res.send(result);
     })
   // get all feedback

    app.get("/feedback", async (req, res) => {
      const query = {};
      const cursor = feedbackCollection.find(query);
      const feedbacks = await cursor.toArray();
      res.send(feedbacks);
    });
  } finally {
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log("crud server is running ");
});
