export const verifyAdmin = async (req, res, next) => {
    try {
        const email = req.user.email;

        const user = await req.db
            .collection('user')
            .findOne({ email });

        if (!user || user.wanderLustRole !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden access"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Only admin allowed"
        });
    }
}