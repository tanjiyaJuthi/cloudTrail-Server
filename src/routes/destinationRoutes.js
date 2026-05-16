import express from "express";

import {verifyToken} from "../middleware/verifyToken.js";
import {verifyAdmin} from "../middleware/verifyAdmin.js";

import { 
    addDestination, 
    deleteDestination,
    featuredDestination,
    getAllDestination, 
    getDestinationBySlug, 
    updateDestination 
} from '../controllers/destinationController.js';

const destinationRoutes = express.Router();

destinationRoutes.get(
    "/",
    getAllDestination
);

destinationRoutes.get(
    "/featured-destination",
    featuredDestination
);

destinationRoutes.get(
    "/:slug",
    getDestinationBySlug
);

destinationRoutes.post(
    "/",
    verifyToken,
    verifyAdmin,
    addDestination
);

destinationRoutes.patch(
    "/:id",
    verifyToken,
    verifyAdmin,
    updateDestination
);

destinationRoutes.delete(
    "/:id",
    verifyToken,
    verifyAdmin,
    deleteDestination
);

export default destinationRoutes;
