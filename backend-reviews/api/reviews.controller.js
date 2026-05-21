/* ============================================ */
/* REVIEWS CONTROLLER */
/* This file controls the flow of data. It receives requests, */
/* asks the DAO for data, and sends the response back. */
/* ============================================ */

// Import the Data Access Object (DAO) to interact with the database
import ReviewsDAO from "../dao/reviewsDAO.js"

// 'export default' allows this class to be imported in other files
export default class ReviewsController {

    /* --- Method to Get Reviews --- */
    // 'static': This method belongs to the class itself, not an instance of it.
    // 'async': This function handles asynchronous operations (things that take time, like DB lookups).
    // 'req': The Request object (contains info from the user/frontend).
    // 'res': The Response object (used to send info back to the user).
    static async apiGetReviews(req, res, next) {
        try {
            // Check if 'moviesPerPage' query parameter exists in the URL.
            // Syntax: condition ? value_if_true : value_if_false (Ternary Operator)
            // parseInt(..., 10) converts the string to an integer (base 10).
            let moviesPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage, 10) : 20
            let page = req.query.page ? parseInt(req.query.page, 10) : 0

            let filters = {}
            // Check if an ID was passed in the URL parameters (e.g. /movie/12345)
            if (req.params.id) {
                filters.movieId = req.params.id
            }

            // 'await': Pause execution here until the DAO finishes getting the reviews.
            // We pass an object {} containing our filter and page settings.
            let reviews = await ReviewsDAO.getReviews({
                filters,
                page,
                reviewsPerPage: moviesPerPage,
            })

            // Send the resulting reviews back to the user as a JSON response.
            res.json(reviews)
        } catch (e) {
            // If an error occurs (try failed), log it and send a 500 (Server Error) status.
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    /* --- Method to specific Post (Create) a Review --- */
    static async apiPostReview(req, res, next) {
        try {
            // Extract data from the 'body' of the request (the data sent by the frontend form).
            const movieId = req.body.movieId
            const review = req.body.review
            const user = req.body.user
            const rating = req.body.rating

            // Call the DAO to add the review to the database.
            // We wait for it to finish.
            const reviewResponse = await ReviewsDAO.addReview(
                movieId,
                user,
                review,
                rating
            )
            // If successful, send a JSON object saying "success".
            res.json({ status: "success" })
        } catch (e) {
            // message is a property of the error object 'e'
            res.status(500).json({ error: e.message })
        }
    }

    /* --- Method to Get a Single Review --- */
    static async apiGetReview(req, res, next) {
        try {
            // || {} ensures id is at least an empty object if params.id is missing (safety check)
            let id = req.params.id || {}

            // Get the specific review from the DB
            let review = await ReviewsDAO.getReview(id)

            // If no review found, return 404 (Not Found)
            if (!review) {
                res.status(404).json({ error: "Not found" })
                return // Stop function execution
            }
            res.json(review)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    /* --- Method to Update a Review --- */
    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.params.id
            const review = req.body.review
            const user = req.body.user
            const rating = req.body.rating

            // Call DAO to update. Note: We use reviewId AND user to ensure 
            // only the person who created the review can update it.
            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                user,
                review,
                rating
            )

            // Destructuring: Extract 'error' property from reviewResponse object
            var { error } = reviewResponse
            if (error) {
                res.status(400).json({ error })
            }

            // modifiedCount tells us if any document was actually changed.
            // If 0, it means either the review didn't exist or the user didn't match.
            if (reviewResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update review - user may not be original poster"
                )
            }

            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    /* --- Method to Delete a Review --- */
    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.params.id
            const user = req.body.user
            console.log(`[DELETE] Request to delete review ID: ${reviewId} by user: "${user}"`);

            // Call DAO to delete. Again, checking user for security.
            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                user
            )
            console.log(`[DELETE] DB Response:`, reviewResponse);

            if (reviewResponse.deletedCount === 0) {
                console.log(`[DELETE] Failed: No review matched ID ${reviewId} and user "${user}"`);
                return res.status(400).json({ 
                    error: "Could not delete review. Make sure you are the author." 
                });
            }

            res.json({ status: "success" })
        } catch (e) {
            console.error(`[DELETE] Exception:`, e);
            res.status(500).json({ error: e.message })
        }
    }
}
