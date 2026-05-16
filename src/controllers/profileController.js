import {getCollections} from '../db/collections.js';

// get all profiles
export const getAllProfiles = async (req, res) => {
    try {
        const { profileCollection } = getCollections();
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
};

// get profile by user name
export const getProfileBySlug = async (req, res)  => {
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
};