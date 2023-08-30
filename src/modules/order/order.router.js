import { Router } from "express";
import  express  from "express";
const router = Router()
import * as orderController from './order.controller.js'
import {auth, roles} from '../../middleware/auth.js'



router.post('/',auth([roles.user]),orderController.createOrder )
router.post('/webhook',express.raw({type: 'application/json'}),orderController.stripeWebHook );




export default router