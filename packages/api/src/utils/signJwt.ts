import jwt from "jsonwebtoken";
import User from "src/models/user.model";
import JwtConfig from "src/config/jwt";

export const signJwt = (user: User): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        user,
      },
      JwtConfig.jwt.secret,
      JwtConfig.jwt.options,
      (error: Error, encoded: string) => {
        if (error) {
          reject(error);
        }
        resolve(encoded);
      }
    );
  });
};
