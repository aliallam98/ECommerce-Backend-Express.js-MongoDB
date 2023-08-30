import { Router } from "express";
const router = Router()
import * as authController from './auth.controller.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";




router.post('/signup' ,fileUpload(fileValidation.image).single("image"), authController.signUp)
router.get('/confirmuser' , authController.confirmUser)
router.get('/login' , authController.login)
router.post('/sendforgetpassword' , authController.sendCode)
router.post('/forgetpassword' , authController.resetPassword)



export default router