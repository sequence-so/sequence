export default {
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    options: {
      audience: process.env.JWT_AUDIENCE, //"https://my.sequence.so",
      expiresIn: "72h",
      issuer: "sequence.so",
    },
    cookie: {
      httpOnly: true,
      sameSite: true,
      signed: true,
      secure: true,
    },
  },
};
