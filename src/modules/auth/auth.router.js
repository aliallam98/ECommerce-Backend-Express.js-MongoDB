import { Router } from "express";
import * as authController from './auth.controller.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import {validation} from '../../middleware/validation.js'
import * as authValidators from './auth.validation.js'


const router = Router()




router.post('/signup',validation(authValidators.signUp), authController.signUp)
router.post('/login',validation(authValidators.logIn) , authController.logIn)
router.post('/logout',validation(authValidators.logIn) , authController.logOut)
router.post('/check-email',validation(authValidators.isEmailExist) , authController.checkEmailExistAndSendOtp)
router.post('/check-otp',validation(authValidators.checkOtp) , authController.checkOtpCorrect)
router.post('/reset-password',validation(authValidators.resetPassword) , authController.resetPassword)

// router.get('/confirmuser',validation(authValidators.confirmUser) , authController.confirmUser)
// router.post('/sendforgetpassword',validation(authValidators.sendCode) , authController.sendCode)
// router.post('/forgetpassword',validation(authValidators.resetPassword) , authController.resetPassword)



export default router