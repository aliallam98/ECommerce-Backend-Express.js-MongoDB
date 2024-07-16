import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signUp = {
  body: joi.object().required().keys({
    fullName: generalFields.name,
    password: generalFields.password,
    email: generalFields.email,
  }),
  file: generalFields.file,
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};
export const logIn = {
  body: joi.object().required().keys({
    email: generalFields.email,
    password: generalFields.password,
  }),
  file: generalFields.file,
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};
export const isEmailExist = {
  body: joi.object().required().keys({
    email: generalFields.email.required(),
  }),
  file: generalFields.file,
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};
export const checkOtp = {
  body: joi.object().required().keys({
    email: generalFields.email.required(),
    otp: generalFields.name.required(),
  }),
  file: generalFields.file,
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};
export const resetPassword = {
  body: joi
    .object()
    .required()
    .keys({
      email: generalFields.email.required(),
      otp: joi.string().required(),
      password: generalFields.password,
    }),
  file: generalFields.file,
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};


export const confirmUser = {
  body: joi.object().required().keys({
    email: generalFields.email,
    OTP: joi.string().required(),
  }),
  file: generalFields.file,
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};

export const sendCode = {
  body: joi.object().required().keys({
    email: generalFields.email,
  }),
  file: generalFields.file,
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};

