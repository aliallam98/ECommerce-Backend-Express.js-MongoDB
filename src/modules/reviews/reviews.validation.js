import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'




export const addReview ={
    body:joi.object().required().keys({
         productId:generalFields.id.required(),
         rating:joi.number().positive().required().min(0).max(5),
          comment:joi.string()
        }),
        file:generalFields.file,
        params:joi.object().required().keys(
        ),
        query:joi.object().required().keys(),
}
export const deleteReview ={
    body:joi.object().required().keys(),
        file:generalFields.file,
        params:joi.object().required().keys({
            reviewId:generalFields.id.required()
        }),
        query:joi.object().required().keys(),
}
export const updateReview ={
    body:joi.object().required().keys({
        rating:joi.number().positive().required().min(0).max(5),
        comment:joi.string()
        }),
        file:generalFields.file,
        params:joi.object().required().keys({
            reviewId:generalFields.id.required()
        }),
        query:joi.object().required().keys(),
}
export const getReviewById ={
    body:joi.object().required().keys({
        rating:joi.number().positive().required().min(0).max(5),
        comment:joi.string()
        }),
        file:generalFields.file,
        params:joi.object().required().keys({
            id:generalFields.id.required()
        }),
        query:joi.object().required().keys(),
}
export const getproductReviews ={
    body:joi.object().required().keys({
        rating:joi.number().positive().required().min(0).max(5),
        comment:joi.string()
        }),
        file:generalFields.file,
        params:joi.object().required().keys({
            productId:generalFields.id.required()
        }),
        query:joi.object().required().keys(),
}
