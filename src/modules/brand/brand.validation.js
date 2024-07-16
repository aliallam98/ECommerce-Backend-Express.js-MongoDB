import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'




export const create = {
    body:joi.object().required().keys({
        name:generalFields.name,
    }),
    file:generalFields.file.required(),
    params:joi.object().required().keys(),
    query:joi.object().required().keys(),
}

export const update =  {
    body:joi.object().required().keys({
        name:generalFields.name,
    }),
    file:generalFields.file,
    params:joi.object().required().keys(
       { id : generalFields.id}
    ),
    query:joi.object().required().keys({}),
}
export const deleteBrand =  {
    body:joi.object().required().keys(),
    file:joi.object().keys(),
    params:joi.object().required().keys({
        id:generalFields.id
    }),
    query:joi.object().required().keys(),
}
export const getBrandById =  {
    body:joi.object().required().keys(),
    file:joi.object().keys(),
    params:joi.object().required().keys({
        id:generalFields.id
    }),
    query:joi.object().required().keys(),
}
