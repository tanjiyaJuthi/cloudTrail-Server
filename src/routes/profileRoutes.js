import express from "express";

import {verifyToken} from "../middleware/verifyToken.js";
import {verifyAdmin} from "../middleware/verifyAdmin.js";

import { getAllProfiles, getSingleProfile } from '../controllers/profileController.js';

export const profileRoutes =  express.Router();

profileRoutes.get(
    "/",
    verifyToken,
    verifyAdmin,
    getAllProfiles
);

profileRoutes.get(
    "/me",
    verifyToken,
    getSingleProfile
);

export default profileRoutes;