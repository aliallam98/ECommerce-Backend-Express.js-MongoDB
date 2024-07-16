import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'


export const add = {
    body:joi.object().required().keys({
        productId:generalFields.id.required(),
        quantity:joi.number().min(1).positive().required()
    }),
    params:joi.object().required().keys(),
    query:joi.object().required().keys(),
}

export const getById = {
    body:joi.object().required().keys(),
    params:joi.object().required().keys({
        id:generalFields.id.required()
    }),
    query:joi.object().required().keys(),
}

export const deleteFromCart= {
    body:joi.object().required().keys(),
    params:joi.object().required().keys({
        id:generalFields.id.required()
    }),
    query:joi.object().required().keys(),
}