import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addNewCoupon = {
    body: joi.object().required().keys({
        name: generalFields.name,
        discountAmount: joi.number().positive(),
        expireDate:joi.date().min(Date.now()),
        maxUsingCounts:joi.number().min(1).positive()
    }),
    file: generalFields.file,
    params: joi.object().required().keys({
    }),
    query: joi.object().required().keys({})
}
export const updateCoupon = {
    body: joi.object().required().keys({
        name: generalFields.name,
        discountAmount: joi.number().positive(),
    }),
    file: generalFields.file,
    params: joi.object().required().keys({
        id:generalFields.id
    }),
    query: joi.object().required().keys({})
}
export const deleteCoupon = {
    body: joi.object().required().keys({}),
    file: generalFields.file,
    params: joi.object().required().keys({
        id:generalFields.id
    }),
    query: joi.object().required().keys({})
}
export const getCoupon = {
    body: joi.object().required().keys({}),
    file: generalFields.file,
    params: joi.object().required().keys({
        id:generalFields.id
    }),
    query: joi.object().required().keys({})
}


