
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  // 1. Get the token from the header
  const token = req.header("Authorization");
  console.log("AUTH HEADER:", req.header("Authorization"));

  // 2. Check if token exists
  if (!token) return res.status(401).json({ error: "Access Denied" });
  console.log("token exists");

  try {
    // 3. Verify the token
    console.log("inside try, going to verifiy token");

    console.log("checking secret before verification");
    console.log("JWT_SECRET:", process.env.JWT_SECRET);


    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("token verified: ")
    console.log(verified);

    req.user = verified; // Attach user info to the request


    next(); // Let them pass
  // } catch (err) {
  //   res.status(400).json({ error: "Invalid Token" });
  // }
  } catch (err) {
  console.log("JWT ERROR:", err.message);
  res.status(400).json({ error: err.message });
}
}

module.exports = auth;