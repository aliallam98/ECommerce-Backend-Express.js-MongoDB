import Joi from 'joi'
import { generalFields } from '../../middleware/validation.js'




export const createNewBrand = {
    body:Joi.object().required().keys({
        name:generalFields.name,
    }),
    file:generalFields.file.required(),
    params:Joi.object().required().keys(),
    query:Joi.object().required().keys(),
}
export const updateBrand =  {
    body:Joi.object().required().keys({
        name:generalFields.name,
    }),
    file:generalFields.file,
    params:Joi.object().required().keys(
       { id : generalFields.id}
    ),
    query:Joi.object().required().keys(),
}
export const deleteBrand =  {
    body:Joi.object().required().keys(),
    file:Joi.object().keys(),
    params:Joi.object().required().keys({
        id:generalFields.id
    }),
    query:Joi.object().required().keys(),
}
export const getBrandById =  {
    body:Joi.object().required().keys(),
    file:Joi.object().keys(),
    params:Joi.object().required().keys({
        id:generalFields.id
    }),
    query:Joi.object().required().keys(),
}
