import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addNewCategoryVal = {
    body: joi.object().required().keys({
        name: generalFields.name,
    }),
    file: generalFields.file.required(),
    params: joi.object().required().keys({
    }),
    query: joi.object().required().keys({})
}

export const updateCategoryVal = {
    body: joi.object().required().keys({
        name: generalFields.name,
    }),
    file: generalFields.file,
    params: joi.object().required().keys({
        id:generalFields.id
    }),
    query: joi.object().required().keys({})
}


export const deleteCategoryVal = {
    body: joi.object().required().keys({}),
    file: generalFields.file,
    params: joi.object().required().keys({
        id:generalFields.id
    }),
    query: joi.object().required().keys({})
}

export const searchCategoryVal = {
    body: joi.object().required().keys({}),
    file: generalFields.file,
    params: joi.object().required().keys({
        id:generalFields.id
    }),
    query: joi.object().required().keys({})
}




