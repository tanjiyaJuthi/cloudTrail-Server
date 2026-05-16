import express from "express";

// import {verifyToken} from "../middleware/verifyToken.js";
// import {verifyAdmin} from "../middleware/verifyAdmin.js";

import { getAllTestimonials } from '../controllers/testimonialController.js';

const testimonialRoutes = express.Router();

testimonialRoutes.get(
    "/",
    getAllTestimonials
);

export default testimonialRoutes;