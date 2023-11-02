import * as otpGenerator from 'otp-generator';

export const otpgenerate = () => {
  const otp_token = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return otp_token;
};
