import { Router } from "express";
import * as cartController from './cart.controller.js'
import { roles, auth} from '../../middleware/auth.js'
const router = Router()




router.get('/', auth([roles.user]),cartController.getUserCart)

router.post('/', auth(roles.user), cartController.addToCart)
router.get('/:id', auth(roles.user), cartController.getCartById)
router.patch('/:id', auth(roles.user), cartController.deleteFromCart)
router.put('/clear', auth(roles.user), cartController.clearAllCart)




export default router