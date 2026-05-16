// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';





const app = express();
const port = process.env.SERVER_PORT || 5001;

// middleware
app.use(cors());
app.use(express.json());

// mongodb atlas connection
const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        // await client.db("admin").command({ ping: 1 });
        // console.log("Connected to MONGODB Atlas!");
        app.use((req, res, next) => {
            req.db = db;
            next();
        });

        const db = client.db('wanderlust');

        



        



        

    } catch (error) {
        // console.error(error);
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// server
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})