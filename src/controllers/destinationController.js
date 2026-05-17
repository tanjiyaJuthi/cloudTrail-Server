import { ObjectId } from 'mongodb';

import {getCollections} from '../db/collections.js';

import { escapeRegex, generateSlug } from '../lib/helper.js';

// add destination
export const addDestination = async (req, res) => {
    try {
        const { destinationCollection } = getCollections();
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
};

// get all destination
export const getAllDestination = async (req, res) => {
    try {
        const { destinationCollection } = getCollections();
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
            message: "Destination server error",
        });
    }
};

// get destination by slug
export const getDestinationBySlug = async (req, res) => {
    try {
        const { destinationCollection } = getCollections();
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
};

// featured destination
export const featuredDestination = async (req, res) => {
    try { 
        const { destinationCollection } = getCollections();
        
        const result = await destinationCollection
            .find()
            .sort({ rating: -1 })
            .limit(10)
            .toArray();

        // console.log(result);

        return res.status(200).json({
            success: true,
            message: "Featured destinations fetched successfully",
            data: result,
        });

    } catch (error) {
        console.error("FULL ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// update destination
export const updateDestination = async (req, res) => {
    try {
        const { destinationCollection } = getCollections();
        const { id } = req.params;

        const updatedDestination = req.body;

        const allowedFields = [
            "destinationName",
            "country",
            "category",
            "price",
            "duration",
            "imageUrl",
            "rating",
            "reviewCount",
            "description"
        ];

        const safeUpdate = {};

        for (const key of allowedFields) {
            if (updatedDestination[key] !== undefined) {
                safeUpdate[key] = updatedDestination[key];
            }
        }

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
            { $set: safeUpdate }
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
        console.error("PATCH /destination error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// delete destination
export const deleteDestination = async (req, res) => {
    try {
        const { destinationCollection } = getCollections();
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
};