import express from "express";

import {verifyToken} from "../middleware/verifyToken.js";
import {verifyAdmin} from "../middleware/verifyAdmin.js";

import {
    addBooking, 
    bookingCheck, 
    getBookingByUser, 
    deleteBooking 
} from '../controllers/bookingController.js';

const bookingRoutes =  express.Router();

bookingRoutes.post(
    "/",
    verifyToken,
    addBooking
);

bookingRoutes.get(
    "/check",
    verifyToken,
    verifyAdmin,
    bookingCheck
);

bookingRoutes.get(
    "/:userId",
    verifyToken,
    getBookingByUser
);

bookingRoutes.delete(
    "/:bookingId",
    verifyToken,
    verifyAdmin,
    deleteBooking
);

export default bookingRoutes;