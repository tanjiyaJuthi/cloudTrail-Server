import {getCollections} from '../db/collections.js';
import { ObjectId } from 'mongodb';
import client from "../config/db.js";

// book a destination
export const addBooking = async (req, res) => {
    const userId = req.user.id;
    // console.log('user: ', req.user);
    let session;
    
    try {
        session = client.startSession()

        const { bookingCollection, destinationCollection } = getCollections();

        const {
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
        if (seats < 1) {
            throw new Error("Invalid member number");
        }

        if (!userId || !destinationId || !departureDate) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        let result;

        await session.withTransaction(async () => {
            const existingBooking = await bookingCollection.findOne(
                {
                    userId,
                    destinationId,
                },
                { session }
            );

            if (existingBooking) {
                throw new Error("You already booked this destination");
            }

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
                },
                { session }
            );

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
    } finally {
        if (session) await session.endSession();
    }
}

// check whether already booked or not
export const bookingCheck = async (req, res) => {
    const { bookingCollection } = getCollections();
    
    const userId = req.user.id;
    const { destinationId } = req.query;

    const booking = await bookingCollection.findOne({
        userId,
        destinationId,
    });

    res.send({
        booked: !!booking,
    });
}

// get booking by userId
export const getBookingByUser = async (req, res) => {
    try {
        const { bookingCollection } = getCollections();
        const {userId} = req.params;

        if (req.user.id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            });
        }
        
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
};

// remove booking
export const deleteBooking = async (req, res) => {
    try {
        const { bookingCollection } = getCollections();
        const { bookingId } = req.params;

        if (!ObjectId.isValid(bookingId)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const result = await bookingCollection.deleteOne({
            _id: new ObjectId(bookingId)
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
};