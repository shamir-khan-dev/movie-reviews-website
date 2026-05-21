/* ============================================ */
/* REVIEWS DATA ACCESS OBJECT (DAO) */
/* This file talks directly to the MongoDB database. */
/* ============================================ */

import mongodb from "mongodb"
// ObjectId is a special type used by MongoDB for unique IDs
const ObjectId = mongodb.ObjectId

let reviews // Variable to hold the connection to our 'reviews' collection (table) in the DB

export default class ReviewsDAO {
    /* --- Connect to the Database Collection --- */
    static async injectDB(conn) {
        // If we already have a connection (reviews is not null), no need to connect again.
        if (reviews) {
            return
        }
        try {
            // conn.db(...) connects to the specific database defined in our .env file
            // .collection("reviews") selects the 'reviews' table to work with.
            reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection("reviews")
        } catch (e) {
            console.error(`Unable to establish collection handles in userDAO: ${e}`)
        }
    }

    /* --- Add a Review (Insert) --- */
    static async addReview(movieId, user, review) {
        try {
            // Create a JavaScript object (a document) to store in MongoDB
            const reviewDoc = {
                movieId: movieId,
                user: user,
                review: review,
            }
            // insertOne is a MongoDB command to add one document to the collection
            return await reviews.insertOne(reviewDoc)
        } catch (e) {
            console.error(`Unable to post review: ${e}`)
            return { error: e }
        }
    }

    /* --- Get a Review by ID --- */
    static async getReview(reviewId) {
        try {
            // findOne finds a single document matching the criteria.
            // new ObjectId(reviewId): We must convert the string ID to a MongoDB ObjectId to match.
            return await reviews.findOne({ _id: new ObjectId(reviewId) })
        } catch (e) {
            console.error(`Unable to get review: ${e}`)
            return { error: e }
        }
    }

    /* --- Update a Review --- */
    static async updateReview(reviewId, user, review) {
        try {
            // updateOne finds a document and changes specific fields.
            // First argument: The filter { _id: ..., user: ... }. Both must match!
            // Second argument: The update operation. $set is a MongoDB operator to update only specific fields.
            const updateResponse = await reviews.updateOne(
                { _id: new ObjectId(reviewId), user: user },
                { $set: { review: review } }
            )

            return updateResponse
        } catch (e) {
            console.error(`Unable to update review: ${e}`)
            return { error: e }
        }
    }

    /* --- Delete a Review --- */
    static async deleteReview(reviewId, user) {
        try {
            // deleteOne removes the first document that matches the filter.
            const deleteResponse = await reviews.deleteOne({
                _id: new ObjectId(reviewId),
                user: user,
            })

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete review: ${e}`)
            return { error: e }
        }
    }

    /* --- Get Multiple Reviews (Search) --- */
    static async getReviews({
        filters = null,
        page = 0,
        reviewsPerPage = 20,
    } = {}) { // Default parameter is an empty object {} if nothing is passed

        let query // The search query object for MongoDB
        if (filters) {
            if ("movieId" in filters) {
                // If filtering by movie ID, set the query to look for that "movieId"
                query = { "movieId": filters["movieId"] }
            }
        }

        let cursor

        try {
            // .find(query) returns a "cursor". Think of a cursor as a pointer to the result set.
            // It doesn't fetch all data yet, just prepares to fetch it.
            cursor = await reviews
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return []
        }

        // Limit: return only 'reviewsPerPage' (e.g., 20) items
        // Skip: skip the first (reviewsPerPage * page) items for pagination
        const displayCursor = cursor.limit(reviewsPerPage).skip(reviewsPerPage * page)

        try {
            // toArray() executes the cursor and returns the actual list of documents as an array.
            const reviewsList = await displayCursor.toArray()
            return reviewsList
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
            return []
        }
    }
}
