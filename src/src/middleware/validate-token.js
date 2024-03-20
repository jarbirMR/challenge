const { request, response } = require("express");
const CustomError = require("../config/errors");
const JWT = require("../config/jwt");
const UserModel = require("../databases/models/user-model");


class AuthMiddleware {
    static #handleError = (error, res = response) => {
      if (error instanceof CustomError) {
        return res
          .status(error.statusCode)
          .json({ status: false, data: null, error: error.message });
      }
      console.error(error);
      return res
        .status(500)
        .json({ status: false, data: null, error: "Internal Server Error" });
    };
  
    static validateJWT = async (req = request, res = response, next) => {
      try {
        const authorization = req.header("Authorization");
        if (!authorization) throw CustomError.forbidden("No token provided");
        if (!authorization.startsWith("Bearer "))
          throw CustomError.forbidden("Invalid Bearer token");
        const token = authorization.split(" ").at(1) || "";
        const payload = await JWT.validateToken(token);
        if (!payload) throw CustomError.forbidden("Invalid token");
        const subdomain = req.subdomain;
        const userModel = new UserModel();
        
        const user = await userModel.findByEmail(payload.email);
       
        
       
        req.email = user.user_email;
      
        next();
      } catch (error) {
        this.#handleError(error, res);
      }
    };
  }
  
  module.exports = AuthMiddleware;
  