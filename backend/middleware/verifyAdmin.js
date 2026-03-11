const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
  // 1. Get the token from the header
    const token = req.header("Authorization");

  // 2. Check if token exists
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
    // 3. Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Check if this user is actually an admin
    if (verified.role !== "admin") {
        return res.status(403).json({ error: "Admin access only" });
    }

    // 5. Attach user info to the request
    req.user = verified;
    next(); // Let them pass
    } catch (err) {
    res.status(400).json({ error: "Invalid Token" });
    }
}

module.exports = verifyAdmin;