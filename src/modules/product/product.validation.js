import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'



export const createNewProduct ={
    body:joi.object().required().keys(
 {      name:generalFields.name,
        description:generalFields.name,
        stock:joi.number().positive().required(),
        discount:joi.number().positive().required(),
        price:joi.number().positive().required(),

        colors:joi.custom((value,helper)=>{
            if(value){
                value = JSON.parse(value)
                const arrayValidationSchema = joi.object({
                    value : joi.array().items(joi.string().alphanum())
                })
                const result = arrayValidationSchema.validate({value}, {abortEarly:false})
                if(result.error){
                    return helper.message = 'Invaild Value Of Colors'
                }
                else{
                    return true
                }
        
            }
        }),
        sizes:joi.custom((value,helper)=>{
            value = JSON.parse(value)
            console.log(value);
            if(!Array.isArray(value)){
                return helper.message({
                    custom:'sizes must be an array',
                    })
            }else{
                return true
            }
        }),
        price:joi.number().required(),
        categoryId:generalFields.id,
        subCategoryId:generalFields.id,
        brandId:generalFields.id,}
    ),
    files:joi.object().required().keys({
        image:joi.array().items(generalFields.file).max(1).required(), 
        images:joi.array().items(generalFields.file).max(5)
    }),
    params:joi.object().required().keys(),
    query:joi.object().required().keys(),
        }
export const updateProduct ={
    body:joi.object().required().keys(
        {       name:generalFields.name,
            description:generalFields.name,
            stock:joi.number().positive().required(),
            discount:joi.number().positive().required(),
            colors:joi.array(),
            sizes:joi.array(),
            price:joi.number().required(),
            categoryId:generalFields.id,
            subCategoryId:generalFields.id,
            brandId:generalFields.id,}
    ),
    files:joi.object().keys({
        image:joi.array().items(generalFields.file).length(1),
        images:joi.array().items(generalFields.file).length(5)
    }), 
    params:joi.object().required().keys({
        id:generalFields.id
    }),
    query:joi.object().required().keys(),
}
export const deleteProduct ={
    body:joi.object().required().keys(
    ),
    file:generalFields.file,
    params:joi.object().required().keys(
        {id : generalFields.id}
    ),
    query:joi.object().required().keys(),
}
export const getProductById ={
    body:joi.object().required().keys(
        ),
        file:generalFields.file,
        params:joi.object().required().keys(
            {id : generalFields.id}
        ),
        query:joi.object().required().keys(),
}






