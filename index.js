require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

// http://localhost:5000
const port = process.env.PORT || 5000;


// middleware
app.use(express.json());
app.use(cors());


// mongodb database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ttbt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const campaignCollection = client.db("campaignDB").collection("campaign");

        app.post('/campaign', async (req, res) => {
            const newCampaign = req.body;

            const result = await campaignCollection.insertOne(newCampaign);
            res.send(result);
        })
    } finally {
        //   // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);



// routing
app.get("/", (req, res) => {
    res.send("welcome to home page");
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})