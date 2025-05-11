export default function validateChatRequest(req, res, next) {
    const { userId, sessionId } = req.body;
    if (!userId || !sessionId) {
        return res.status(400).json({ error: "userId and sessionId are required" });
    }
    next();
}
