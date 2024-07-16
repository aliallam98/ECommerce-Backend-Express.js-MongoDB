import otpGenerator from "otp-generator";
import moment from "moment";

export const generateOTP = () => {
  const OTP = {
    code: otpGenerator.generate(Number(process.env.OTP_NUMBERS), {
      upperCaseAlphabets: false,
      specialChars: false,
    }),
  };
  return OTP;
};
export const generateOTPWithExpireDate = (n) => {
  const OTP = {
    code: otpGenerator.generate(Number(process.env.OTP_NUMBERS), {
      upperCaseAlphabets: false,
      specialChars: false,
    }),
    expireDate: moment().add(Number(n), "minutes"),
  };
  return OTP;
};
