import { Router } from "express";
import * as cartController from './cart.controller.js'
import {auth} from '../../middleware/auth.js'
const router = Router()
import { validation } from "../../middleware/validation.js";
import * as cartValidators from './cart.validation.js'
import {endpoint} from './cart.endPoint.js'

router.get('/', auth(endpoint.get),cartController.getUserCart)
router.get('/:id', auth(endpoint.getCartById),validation(cartValidators.getById) ,cartController.getCartById)


router.post('/', auth(endpoint.add),validation(cartValidators.add) ,cartController.addToCart)

router.patch('/:id', auth(endpoint.delete),validation(cartValidators.deleteFromCart) ,cartController.deleteFromCart)

router.put('/clear', auth(endpoint.clear), cartController.clearAllCart)


export default router