/* ============================================ */
/* BACKEND ENTRY POINT - Learning Project 2 */
/* ============================================ */

// Import necessary modules
import app from "./server.js"
import mongodb from "mongodb"
import ReviewsDAO from "./dao/reviewsDAO.js"
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

// Create a MongoDB client
const MongoClient = mongodb.MongoClient
// Set the port (use environment variable or default to 8000)
const port = process.env.PORT || 8000

console.log("Attempting to connect to MongoDB...")

/* --- Connect to MongoDB and Start Server --- */
MongoClient.connect(
    process.env.MOVIEREVIEWS_DB_URI,
    {
        maxPoolSize: 50, // Max concurrent connections
        wtimeoutMS: 2500, // Timeout for write operations
        serverSelectionTimeoutMS: 5000 // Timeout for server selection
    }
)
    .catch(err => {
        // Log errors if connection fails
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        // Connect to the Reviews Database Access Object
        await ReviewsDAO.injectDB(client)

        // Start the web server
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })