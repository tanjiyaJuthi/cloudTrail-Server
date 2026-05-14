// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { escapeRegex, generateSlug } from './lib/helper.js';

dotenv.config();

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

        const db = client.db('wanderlust');
        const destinationCollection = db.collection('destinations');
        const profileCollection = db.collection("user");
        const testimonialCollection = db.collection('testimonials');
        const bookingCollection = db.collection("bookings");

        app.get("/destination", async (req, res) => {
            try {
                const result = await destinationCollection.find().toArray();
                // console.log(result);
                return res.status(200).json({
                    success: true,
                    message: "Destinations fetched successfully",
                    data: result,
                });

            } catch (error) {
                // console.error("GET /destination error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });

        app.get("/destination/:slug", async (req, res) => {
            try {
                const {slug} = req.params;

                const normalizedSlug = slug.toLowerCase().trim();

                const safeSlug = escapeRegex(normalizedSlug);

                const result = await destinationCollection.findOne({
                    slug: { $regex: `^${safeSlug}$`, $options: "i" }
                });

                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: "Destination not found",
                    });
                }
                
                // console.log(result);
                return res.status(200).json({
                    success: true,
                    message: "Destinations fetched successfully",
                    data: result,
                });

            } catch (error) {
                // console.error("GET /destination error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });

        app.get("/featured-destinations", async (req, res) => {
            try {
                const result = await destinationCollection
                    .find()
                    .sort({ rating: -1 })
                    .limit(10)
                    .toArray();

                return res.status(200).json({
                    success: true,
                    message: "Featured destinations fetched successfully",
                    data: result,
                });

            } catch (error) {
                // console.error("GET /featured-destinations error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });

        app.post("/destination", async (req, res) => {
            try {
                const destination = req.body;

                if (!destination || Object.keys(destination).length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Destination data is required",
                    });
                }

                destination.slug = generateSlug(destination.destinationName);

                const result = await destinationCollection.insertOne(destination);
                
                return res.status(201).json({
                    success: true,
                    message: "Destination created successfully",
                    data: result,
                });

            } catch (error) {
                // console.error("POST /destination error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });

        app.patch("/destination/:id", async (req, res) => {
            try {
                const { id } = req.params;

                const updatedDestination = req.body;

                if (!updatedDestination || Object.keys(updatedDestination).length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Destination data is required",
                    });
                }

                const existing = await destinationCollection.findOne({
                    _id: new ObjectId(id),
                });

                if (!existing) {
                    return res.status(404).json({
                        success: false,
                        message: "Destination not found",
                    });
                }

                if (updatedDestination.destinationName) {
                    updatedDestination.slug = generateSlug(updatedDestination.destinationName);
                }

                await destinationCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedDestination }
                );

                const updatedDoc = await destinationCollection.findOne({
                    _id: new ObjectId(id),
                });

                return res.status(200).json({
                    success: true,
                    message: "Destination updated successfully",
                    data: updatedDoc,
                });

            } catch (error) {
                // console.error("PATCH /destination error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });

        app.delete("/destination/:id", async (req, res) => {
            try {
                const { id } = req.params;

                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({ error: "Invalid ID format" });
                }

                const result = await destinationCollection.deleteOne({
                    _id: new ObjectId(id)
                });

                if (result.deletedCount === 0) {
                    return res.status(404).json({ message: "Not found" });
                }

                res.json({
                    message: "Deleted successfully",
                    result
                });

            } catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });



        app.get("/testimonials", async (req, res) => {
            try {
                const result = await testimonialCollection.find().toArray();
                // console.log(result);
                return res.status(200).json({
                    success: true,
                    message: "Destinations fetched successfully",
                    data: result,
                });

            } catch (error) {
                // console.error("GET /testimonials error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });



        app.get("/profiles", async (req, res) => {
            try {
                const result = await profileCollection.find().toArray();
                // console.log(result);
                return res.status(200).json({
                    success: true,
                    message: "Profiles fetched successfully",
                    data: result,
                });

            } catch (error) {
                // console.error("GET /Profiles error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });

        app.get("/profile/:slug", async (req, res)  => {
            try {
                const {slug} = req.params;

                const normalizedSlug = slug.toLowerCase().trim();

                const safeSlug = escapeRegex(normalizedSlug);

                const result = await profileCollection.findOne({
                    slug: { $regex: `^${safeSlug}$`, $options: "i" }
                });

                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: "Profile not found",
                    });
                }
                
                // console.log(result);
                return res.status(200).json({
                    success: true,
                    message: "Profile fetched successfully",
                    data: result,
                });

            } catch (error) {
                // console.error("GET /destination error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });



        app.post("/booking", async (req, res) => {
            try {
                const {
                    userId,
                    userName,
                    userImage,
                    destinationId,
                    destinationSlug,
                    destinationName,
                    destinationCountry,
                    destinationImageUrl,
                    departureDate,
                    memberNumber,
                    totalPrice
                } = req.body;

                const seats = Number(memberNumber || 1);

                if (!userId || !destinationId || !departureDate) {
                    return res.status(400).json({
                        success: false,
                        message: "Missing required fields",
                    });
                }

                const session = client.startSession();

                let result;

                await session.withTransaction(async () => {
                    const destination = await destinationCollection.findOne(
                        { _id: new ObjectId(destinationId) },
                        { session }
                    );

                    if (!destination) {
                        throw new Error("Destination not found");
                    }

                    const capacity = destination.capacity || 0;
                    const booked = destination.bookedSeats || 0;

                    const remaining = capacity - booked;

                    if (remaining < seats) {
                        throw new Error(
                            `Only ${remaining} seats left`
                        );
                    }

                    const booking = await bookingCollection.insertOne({
                        userId,
                        userName,
                        userImage,
                        destinationId,
                        destinationSlug,
                        destinationName,
                        destinationCountry,
                        destinationImageUrl,
                        departureDate: new Date(departureDate),
                        memberNumber: seats,
                        totalPrice,
                        status: "PENDING",
                        createdAt: new Date(),
                    });

                    await destinationCollection.updateOne(
                        { _id: new ObjectId(destinationId) },
                        {
                            $inc: {
                                bookedSeats: seats
                            }
                        },
                        { session }
                    );

                    result = booking;
                });

                await session.endSession();

                return res.status(201).json({
                    success: true,
                    message: "Booking created successfully",
                    data: result,
                });

            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message || "Booking failed",
                });
            }
        });

        app.get("/booking/check", async (req, res) => {
            const { userId, destinationId } = req.query;

            const booking = await bookingCollection.findOne({
                userId,
                destinationId,
            });

            res.send({
                booked: !!booking,
            });
        });

        app.get("/booking/:userId", async (req, res) => {
            try {
                const {userId} = req.params;
                
                const bookings = await bookingCollection
                    .find({ userId })
                    .sort({ createdAt: -1 })
                    .toArray();
                res.json({
                    success: true,
                    data: bookings,
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch bookings",
                });
            }
        });
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