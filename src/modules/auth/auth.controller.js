import cartModel from "../../../DB/model/Cart.model.js";
import userModel from "../../../DB/model/User.model.js";
import { ErrorClass } from "../../utils/ErrorClass.js";
import { generateToken } from "../../utils/GenerateAndVerifyToken.js";
import { compare, hash } from "../../utils/HashAndCompare.js";
import cloudinary from "../../utils/cloudinary.js";
import {sendEmail, createHTML} from "../../utils/email.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import CryptoJS from "crypto-js";
import { nanoid } from "nanoid";

export const signUp = asyncHandler(async (req, res, next) => {

  const checkEmailExisting = await userModel.findOne({ email:req.body.email });
  if (checkEmailExisting) {
    return next( new ErrorClass("This Email Already In Use", 409))
  }
  const OTP = nanoid(6)
  req.body.code = OTP
  const html = createHTML(OTP)
  console.log(html);
  if (!sendEmail({ to: req.body.email, subject: "Confirm Email", html })) {
    return new ErrorClass("There is someting Wrong with Email Sender");
  }
  req.body.phone = CryptoJS.AES.encrypt(req.body.phone, process.env.CRYPTO_KEY).toString();

  req.body.password = hash({ plaintext: req.body.password });

 if(req.file){
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: `E-commerce/Users/${req.body.firstName + req.body.lastName}` }
      );
      req.body.image = { secure_url, public_id }
 }

  const user = await userModel.create(req.body);
  const cart = await cartModel.create({
    userId :user._id,
  })

  return res.status(201).json({ message: "Done", user });
});

export const confirmUser = asyncHandler(async(req,res,next)=>{
    const {email,OTP} = req.body
    const user = await userModel.findOne({email})
    if (!user) {
        return next( new ErrorClass("This Email Is Not Exist", 400))
      }
      if(user.code !== OTP){
        return next( new ErrorClass("In Vaild OTP", 400))
      }
      const newOTP = nanoid(10)
      const confirmUser = await userModel.updateOne({email},{confirmEmail: true, code:newOTP})
      return res.status(201).json({ message: "Done", confirmUser });

})

export const login = asyncHandler(async(req,res,next)=>{
    const{email, password} = req.body
    const user = await userModel.findOne({email})
    if (!user) {
        return next( new ErrorClass("In Vaild Email Or Password", 400))
      }
      const match = compare({plaintext:password,hashValue:user.password})
      if(!match){
        return next( new ErrorClass("In Vaild Email Or Password", 400))
      }
      const payload = {
        id :user._id,
        email: user.email ,
        name : `${user.firstName} ${user.lastName}`
      }
      const token = generateToken({payload})
      return res.status(200).json({ message: "Done", token });
      
}) 

export const sendCode = asyncHandler(async(req,res,next)=>{
    const {email} = req.body
    const user = await userModel.findOne({email})
    if (!user) {
        return next( new ErrorClass("In Vaild Email", 400))
      }
      const OTP = nanoid(6)
      const html = createHTML(OTP)
      if( user.OTPNumber %3 == 0){
        return next(new ErrorClass("Aleady Sent Check Your Mail" , 406))
      }
      sendEmail({to:email, subject:'Forget Password', html})
      await userModel.findOneAndUpdate({email},{code : OTP , $inc : {'OTPNumber' : 1}})
      return res.status(201).json({ message: "Done"});

})
export const resetPassword = asyncHandler(async(req,res,next)=>{
    const {email,OTP,password} = req.body
    const user = await userModel.findOne({email})
    if (!user) {
        return next( new ErrorClass("In Vaild Email", 400))
      }
      if(user.code !== OTP){
        return next( new ErrorClass("In Vaild OTP", 400))
      }
      const hashPassword = hash({plaintext:password})
      const newOTP = nanoid(10)
      await userModel.findOneAndUpdate({email},{code : newOTP,password:hashPassword, $inc : {'OTPNumber' : 1}})
      return res.status(201).json({ message: "Done"});

})
