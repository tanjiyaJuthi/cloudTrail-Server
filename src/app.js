import 'dotenv/config';
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import { initCollections } from "./db/collections.js";

import destinationRoutes from "./routes/destinationRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

const db = await connectDB();
initCollections(db);

// to check if endpoint is working or not
// app.use((req, res, next) => {
//   console.log(req.method, req.url);
//   next();
// });
// routes
app.use("/destination", destinationRoutes);
app.use("/booking", bookingRoutes);
app.use("/profile", profileRoutes);
app.use("/testimonial", testimonialRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

export default app;