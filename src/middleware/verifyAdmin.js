import {getCollections} from '../db/collections.js';

export const verifyAdmin = async (req, res, next) => {
    try {
        const { profileCollection } = getCollections();

        if (!req.user?.email) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const email = req.user.email;
        const user = await profileCollection.findOne({ email });

        // console.log(user.wanderLustRole);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.wanderLustRole !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden access"
            });
        }

        req.user.role = "admin";
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Only admin allowed"
        });
    }
}