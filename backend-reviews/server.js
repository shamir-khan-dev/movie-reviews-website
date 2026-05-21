/* ============================================ */
/* EXPRESS SERVER SETUP */
/* ============================================ */

import express from "express"
import cors from "cors"
import reviews from "./api/reviews.route.js"

// Initialize the Express app
const app = express()

/* --- Middleware --- */
app.use(cors()) // Allow requests from other domains (like our frontend)
app.use(express.json()) // Allow the server to read JSON data

/* --- Routes --- */
// Use the reviews route for any request starting with /api/v1/reviews
app.use("/api/v1/reviews", reviews)

// Handle 404 errors (Page not found)
app.use((req, res) => res.status(404).json({ error: "not found" }))

export default app
