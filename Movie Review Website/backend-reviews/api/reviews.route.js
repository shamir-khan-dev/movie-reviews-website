/* ============================================ */
/* API ROUTES DEFINITION */
/* ============================================ */

import express from "express"
import ReviewsCtrl from "./reviews.controller.js"

const router = express.Router()

/* --- Define Routes --- */

// GET request to /movie/:id - Get reviews for a specific movie
router.route("/movie/:id").get(ReviewsCtrl.apiGetReviews)

// POST request to /new - Create a new review
router.route("/new").post(ReviewsCtrl.apiPostReview)

// Requests to /:id - Handle specific review operations
router.route("/:id")
    .get(ReviewsCtrl.apiGetReview)      // Get a specific review
    .put(ReviewsCtrl.apiUpdateReview)   // Update a specific review
    .delete(ReviewsCtrl.apiDeleteReview)// Delete a specific review

export default router
