import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "none",
    maxAge: 15 * 24 * 60 * 60 * 1000,
    secure: true,
  });
};

export default generateTokenAndSetCookie;

//node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"