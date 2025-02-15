require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

// http://localhost:5000
const port = process.env.PORT || 5000;


// middleware
app.use(express.json());
app.use(cors());


// mongodb database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uulp6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        const donateCollection = client.db("campaignDB").collection("donate");

        // AddNewCampaign section of client side
        app.post('/campaign', async (req, res) => {
            const newCampaign = req.body;

            const result = await campaignCollection.insertOne(newCampaign);
            res.send(result);
        })


        // CampaignDetail section of client side
        app.get('/campaignDetail/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};

            const result = await campaignCollection.findOne(query);
            res.send(result);
        })

        // CampaignDetail section of client side
        app.post('/campaignDetail/:id', async (req, res) => {
            const newCampaign = req.body;

            const result = await donateCollection.insertOne(newCampaign);
            res.send(result);
        })


        // RunningCampaign & Home sections of client side
        app.get('/runningCampaign', async (req, res) => {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

            const result = await campaignCollection.find({ deadline: { $gt: formattedDate } }).limit(6).toArray();
            res.send(result);
        })


        // AllCampaign section of client side
        app.get('/allCampaign', async (req, res) => {
            const result = await campaignCollection.find().toArray();
            res.send(result);
        })


        // myCampaign section of client side
        app.get('/myCampaign', async (req, res) => {
            const result = await campaignCollection.find().toArray();
            res.send(result);
        })

        // myCampaign section of client side
        app.delete('/myCampaign/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};

            const result = await campaignCollection.deleteOne(query);
            res.send(result);
        })


        // updateCampaign section of client side
        app.get('/updateCampaign/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};

            const result = await campaignCollection.findOne(query);
            res.send(result);
        })

        // updateCampaign section of client side
        app.put('/updateCampaign/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const options = { upsert: true };

            const updatedCampaign = req.body;
            const updatedCampaignData = {
                $set: {
                    thumbnail: updatedCampaign.thumbnail,
                    title: updatedCampaign.title,
                    campaignType: updatedCampaign.campaignType,
                    description: updatedCampaign.description,
                    minDonation: updatedCampaign.minDonation,
                    deadline: updatedCampaign.deadline,
                    email: updatedCampaign.email,
                    name: updatedCampaign.name
                }
            }

            const result = await campaignCollection.updateOne(filter, updatedCampaignData, options);
            res.send(result);
        })


        // MyDonations section of client side
        app.get('/myDonations', async (req, res) => {
            const result = await donateCollection.find().toArray();
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