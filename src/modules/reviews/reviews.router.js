import { Router } from "express";
const router = Router()
import * as reviewsController from './reviews.controller.js'




router.get('/',reviewsController.getproductReviews)
router.post('/', reviewsController.addReview)
router.put('/', reviewsController.updateReview)
router.delete('/', reviewsController.deleteReview)
router.get('/:id', reviewsController.getReviewById)


export default router