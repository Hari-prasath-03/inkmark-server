export const userIdGenerator = (name) => {
  const docId = Date.now().toString();
  const userId = name.split(" ").join("-").toLowerCase() + "-" + docId;
  return { userId, docId };
};

export const generateOtp = (digits) => {
  let otp = "";
  for (let i = 0; i < digits; i++)
    otp += Math.floor(Math.random() * 10).toString();
  
  return otp;
};
