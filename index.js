

const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5001;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4xqxhsy.mongodb.net/?retryWrites=true&w=majority`;
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
        // await client.connect();
        // Send a ping to confirm a successful connection

        const appartmentCollection = client.db("userDB").collection("apartment");
        const userCollection = client.db("userDB").collection("users");
        const announcementCollection = client.db("userDB").collection("announcement");
        const cuponsCollection = client.db("userDB").collection("cupons");

        app.get("/apartment", async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log('Pagination query', req.query)
            const result = await appartmentCollection.find({ buyOption: true })
                .skip(page * size)
                .limit(size)
                .toArray();
                
            res.send(result);

        });

        app.get("/apartmentCount", async (req, res) => {
            try {
              const count = await appartmentCollection.countDocuments({ buyOption: true });
              console.log(count);
              res.send({ count });
            } catch (error) {
              console.error("Error fetching count:", error);
              res.status(500).send({ error: "Internal Server Error" });
            }
          });
          
          

        app.put('/apartment/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedApartment = req.body;

            const apartment = {
                $set: {

                    buyOption: updatedApartment.buyOption,



                }
            }

            const result = await appartmentCollection.updateOne(filter, apartment, options);
            res.send(result);
        })



        //   users

        app.get("/users", async (req, res) => {
            const result = await userCollection.find().toArray();
            console.log(result);
            res.send(result);
        });


        app.post("/users", async (req, res) => {
            try {
                const body = req.body;
                const result = await userCollection.insertOne(body);
                console.log(result);
                res.send(result);


            } catch (error) {
                console.log(error);

            }

        });


        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedUser = req.body;

            const use = {
                $set: {

                    status: updatedUser.status,



                }
            }

            const result = await userCollection.updateOne(filter, use, options);
            res.send(result);
        })


        //   announcement
        app.get("/announcement", async (req, res) => {
            const result = await announcementCollection.find().toArray();
            console.log(result);
            res.send(result);
        });

        app.post("/announcement", async (req, res) => {
            try {
                const body = req.body;
                const result = await announcementCollection.insertOne(body);
                console.log(result);
                res.send(result);


            } catch (error) {
                console.log(error);

            }

        });

        //cupons
        app.get("/cupons", async (req, res) => {
            const result = await cuponsCollection.find().toArray();
            console.log(result);
            res.send(result);
        });

        app.post("/cupons", async (req, res) => {
            try {
                const body = req.body;
                const result = await cuponsCollection.insertOne(body);
                console.log(result);
                res.send(result);


            } catch (error) {
                console.log(error);

            }

        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!!!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);
app.get("/", (req, res) => {
    res.send("Crud is running .....");
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
