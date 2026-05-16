import {getCollections} from '../db/collections.js';

// get all testimonials
export const getAllTestimonials = async (req, res) => {
    try {
        const { testimonialCollection } = getCollections();
        const result = await testimonialCollection.find().toArray();
        // console.log(result);
        return res.status(200).json({
            success: true,
            message: "Testimonials fetched successfully",
            data: result,
        });

    } catch (error) {
        console.error("GET /testimonials error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};