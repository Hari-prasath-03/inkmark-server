const otpMap = new Map();

export const setOtp = (email, otp) => {
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpMap.set(email, { otp, expiresAt });
};

export const verifyOtp = (email, inputOtp) => {
  const record = otpMap.get(email);
  if (!record) return false;

  const { otp, expiresAt } = record;
  const isValid = otp === inputOtp && Date.now() < expiresAt;
  if (isValid) otpMap.delete(email);
  return isValid;
};
