import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
            return
        }
        try {
            reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection("reviews")
        } catch (e) {
            console.error(`Unable to establish collection handles in userDAO: ${e}`)
        }
    }

    static async addReview(movieId, user, review) {
        try {
            const reviewDoc = {
                movieId: movieId,
                user: user,
                review: review,
            }
            return await reviews.insertOne(reviewDoc)
        } catch (e) {
            console.error(`Unable to post review: ${e}`)
            return { error: e }
        }
    }

    static async getReview(reviewId) {
        try {
            return await reviews.findOne({ _id: new ObjectId(reviewId) })
        } catch (e) {
            console.error(`Unable to get review: ${e}`)
            return { error: e }
        }
    }

    static async updateReview(reviewId, user, review) {
        try {
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

    static async deleteReview(reviewId, user) {
        try {
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

    // Default getReviews to support getting By Movie ID
    static async getReviews({
        filters = null,
        page = 0,
        reviewsPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("movieId" in filters) {
                query = { "movieId": filters["movieId"] }
            }
        }

        let cursor

        try {
            cursor = await reviews
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return []
        }

        const displayCursor = cursor.limit(reviewsPerPage).skip(reviewsPerPage * page)

        try {
            const reviewsList = await displayCursor.toArray()
            return reviewsList
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
            return []
        }
    }
}
