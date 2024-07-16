import joi from "joi";
import { generalFields } from '../../middleware/validation.js'



export const createOrder = {
    body:joi.object().required().keys({
        phone:joi.array().items(
            joi.string().required()
        ).min(1).max(2).required(),
        adresse:joi.string().required(),
        paymentMethod:joi.string().valid("Cash","Card"),
        coupon:joi.string(),
        note:joi.string(),
        products:joi.array().items(
            joi.object({
                productId:joi.string(),
                quantity:joi.number().min(1).positive().integer().required()
            }).required()
        )
    }),
    params:joi.object().required().keys(),
    query:joi.object().required().keys(),
}

export const cancelOrder  = {
    body:joi.object().required().keys({
        reason:joi.string().required()
    }),
    params:joi.object({
        orderId:generalFields.id.required()
    }).required().keys(),
    query:joi.object().required().keys(),
}