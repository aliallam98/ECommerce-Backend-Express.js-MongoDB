import cartModel from "../../../DB/model/Cart.model.js";
import userModel from "../../../DB/model/User.model.js";
import { ErrorClass } from "../../utils/ErrorClass.js";
import { generateToken } from "../../utils/GenerateAndVerifyToken.js";
import { compare, hash } from "../../utils/HashAndCompare.js";
import cloudinary from "../../utils/cloudinary.js";
import { sendEmail, createHTML } from "../../utils/email.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import CryptoJS from "crypto-js";
import { nanoid } from "nanoid";
import { generateOTPWithExpireDate } from "../../utils/generateOTP.js";

export const signUp = asyncHandler(async (req, res, next) => {
  console.log(req.body);

  const isEmailExist = await userModel.findOne({ email: req.body.email });
  if (isEmailExist) {
    return next(new ErrorClass("This Email Already In Use", 409));
  }

  // const OTP = nanoid(6)
  // req.body.code = OTP
  // const html = createHTML(OTP)
  // if (!sendEmail({ to: req.body.email, subject: "Confirm Email", html })) {
  //   return next(new ErrorClass("There is someting Wrong with Email Sender"))
  // }
  // req.body.phone = CryptoJS.AES.encrypt(req.body.phone, process.env.CRYPTO_KEY).toString();

  req.body.password = hash({ plaintext: req.body.password });

  //  if(req.file){
  //     const { secure_url, public_id } = await cloudinary.uploader.upload(
  //         req.file.path,
  //         { folder: `E-commerce/Users/${req.body.firstName + req.body.lastName}` }
  //       );
  //       req.body.image = { secure_url, public_id }
  //  }

  const user = await userModel.create(req.body);
  await cartModel.create({
    userId: user._id,
  });

  const payload = { id: user._id, fullName: user.fullName, email: user.email };

  return res
    .status(201)
    .json({ success: true, message: "user Created", results: payload });
});

export const logIn = asyncHandler(async (req, res, next) => {
  //Receive Data from body
  let { email, password } = req.body;

  //Check isEmailExist
  const isEmailExist = await userModel.findOne({ email });
  if (!isEmailExist)
    return next(new ErrorClass("Email Or Password Is Wrong", 401));

  //Check IsValidPassword
  const IsValidPassword = compare({
    plaintext: password,
    hashValue: isEmailExist.password,
  });
  if (!IsValidPassword)
    return next(new ErrorClass("Email Or Password Is Wrong", 401));

  // //Check IsEmailConfirmed
  // //Check isDeleted
  // //Check Status
  // checkUserBasics(isEmailExist, next);

  // General Payload and Token
  const payload = {
    id: isEmailExist._id,
    fullName: isEmailExist.fullName,
    email: isEmailExist.email,
  };

  const token = generateToken({ payload, expiresIn: 60 * 60 * 24 * 7 });

  // store jwt in cookie
  res.cookie("ecommercejwt", `${process.env.BEARER_KEY}${token}`, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
  });

  return res
    .status(200)
    .json({ success: true, message: "LoggedIn", results: payload });
});

export const logOut = asyncHandler(async (req, res, next) => {
  res.clearCookie("ecommercejwt");
  return res.status(200).json({ success: true, message: "Logged Out" });
});

export const checkEmailExistAndSendOtp = asyncHandler(
  async (req, res, next) => {
    const isEmailExist = await userModel.findOne({ email: req.body.email });
    if (!isEmailExist) {
      return next(new ErrorClass("This Email Is Not Exist", 404));
    }

    //OTP With expire date 5 min
    const opt = generateOTPWithExpireDate(5);

    //send email
    const html = createHTML(opt.code);
    await sendEmail({
      to: isEmailExist.email,
      subject: "Forget Password",
      html,
    });
    isEmailExist.OTPCode = opt;
    await isEmailExist.save();

    return res
      .status(200)
      .json({ success: true, message: "Done", results: !!isEmailExist });
  }
);

export const checkOtpCorrect = asyncHandler(async (req, res, next) => {
  const isEmailExist = await userModel.findOne({ email: req.body.email });
  if (!isEmailExist) {
    return next(new ErrorClass("This Email Is Not Exist", 404));
  }

  //check otp
  const dataInMm = Date.now(isEmailExist.OTPCode.expireDate);

  const isCorrect =
    isEmailExist.OTPCode.code === req.body.otp || dataInMm < Date.now();

  return res
    .status(200)
    .json({ success: true, message: "Done", results: !!isCorrect });
});


export const resetPassword = asyncHandler(async (req, res, next) => {
  let { email, otp, password } = req.body;

  //Check isEmailExist
  const isEmailExist = await userModel.findOne({ email });
  if (!isEmailExist) return next(new ErrorClass("Email Is Wrong", 404));
  //Check OTP

  const dataInMm = Date.now(isEmailExist.OTPCode.expireDate);

  const isCorrect =
    isEmailExist.OTPCode.code === otp || dataInMm < Date.now();

  if (!isCorrect) return next(new ErrorClass("In Valid OTP Or Expired", 400));

  password = hash({ plaintext: password });
  const newOTP = generateOTPWithExpireDate(0);

  await userModel.findOneAndUpdate(
    { email },
    { password: password, OTP: newOTP, OTPNumber: 0 }
  );

  return res.status(200).json({
    success: true,
    message: "Your New Password Has Set",
    results: true,
  });
});

//Done Here

export const confirmUserEmail = asyncHandler(async (req, res, next) => {
  const { email, OTP } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new ErrorClass("This Email Is Not Exist", 404));
  }
  if (user.confirmEmail)
    return next(
      new ErrorClass(
        "This Email Already Confirmed ... Go To Login In Page", // res.redirect res. redirect()
        400
      )
    );
  if (user?.OTP?.OTPCode !== OTP) {
    return next(new ErrorClass("In Valid OTP", 400));
  }
  const newOTP = generateOTPWithExpireDate(0);
  const userToConfirm = await userModel.findOneAndUpdate(
    { email },
    { confirmEmail: true, OTP: newOTP },
    { new: true }
  );
  return res
    .status(201)
    .json({ success: true, message: "Done", results: userToConfirm });
});

export const sendCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new ErrorClass("In Vaild Email", 400));
  }
  const OTP = nanoid(6);
  const html = createHTML(OTP);
  if (user.OTPNumber == 2) {
    return next(new ErrorClass("Aleady Sent Check Your Mail", 406));
  }
  sendEmail({ to: email, subject: "Forget Password", html });
  await userModel.findOneAndUpdate(
    { email },
    { code: OTP, $inc: { OTPNumber: 1 } }
  );
  return res.status(201).json({ message: "Done" });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  let { oldPassword, newPassword } = req.body;
  const IsOldPasswordValid = compare({
    plaintext: oldPassword,
    hashValue: req.user.password,
  });
  if (!IsOldPasswordValid)
    return next(new ErrorClass("password is Wrong", 400));

  if (oldPassword == newPassword) {
    return next(
      new ErrorClass("Cannot Change New Password To Old Password", 409)
    );
  }

  newPassword = hash({ plaintext: newPassword });

  await userModel.findByIdAndUpdate(req.user?._id, { password: newPassword });
  return res.status(200).json({ message: "Password Changed" });
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  //Check isEmailExist
  const isEmailExist = await userModel.findOne({ email });
  if (!isEmailExist) return next(new ErrorClass("Email Is Wrong", 404));

  //Check IsEmailConfirmed
  //Check isDeleted
  checkUserBasics(isEmailExist, next);

  if (isEmailExist.OTPNumber >= Number(process.env.MAXOTPSMS))
    return next(new ErrorClass("Already Sent Check Your Mail", 403));

  //Send OTP By NodeMailer
  const OTP = generateOTPWithExpireDate(5);
  
  if (
    !sendEmail({
      to: email,
      subject: "Forget Password Mail",
      text: `Your Password Reset Code Is :${OTP.OTPCode}`,
    })
  ) {
    return next(
      new ErrorClass("There is someting Wrong with Email Sender", 400)
    );
  }

  await userModel.findByIdAndUpdate(isEmailExist._id, {
    $inc: { OTPNumber: 1 },
    OTP,
  });
  return res.status(200).json({ success: true, message: "Check Your Email" });
});
