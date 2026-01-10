import app from "./server.js"
import mongodb from "mongodb"
import ReviewsDAO from "./dao/reviewsDAO.js"
import dotenv from "dotenv"


dotenv.config()

const MongoClient = mongodb.MongoClient
const port = process.env.PORT || 8000

console.log("Attempting to connect to MongoDB...")
MongoClient.connect(
    process.env.MOVIEREVIEWS_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,

        serverSelectionTimeoutMS: 5000
    }
)
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        await ReviewsDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })