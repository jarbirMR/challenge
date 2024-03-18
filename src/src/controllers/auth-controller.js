const { response, request } = require("express");
const CustomError = require("../config/errors");
const UserModel = require("../databases/models/user-model");
const { sendRecoveryCode } = require("../emails/emails");
const JWT = require("../config/jwt");

class AuthController {
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

    static register = async (req = request, res = response) => {
    try {
      const data = req.body;
      const userModel = new UserModel();
      const user = await userModel.registerUser(data);

      
      
      return res.status(200).json ({
        status: true,
        data: true, user,
        error: null,
      });
    } catch (error) {
      this.#handleError(error, res);
    } 
    }

    static loginversion = async (req = request, res = response) => {
      try {
        let { ch_email , ch_password} = req.body;
        const userModel = new UserModel();
        const user = await userModel.findByEmail(ch_email);
       // res.send("Usuario exitoso!");
        if (!user) throw CustomError.notFound("User not exist");
        const pass = await userModel.findByPass(ch_password);
        if (!pass) throw CustomError.notFound("password incorrect");
        const token = await JWT.generateToken({
          email: user.ch_email
       
        });

       
        return res.status(200).json({
          status: true,
          data: {
            token,
            user: {
              
              
              email: user.ch_email,
              
            
            }, 
          },
          //  pass,
           // user: {
         //     email: user.ch_email,
         //     names: user.ch_name,
         //     surnames: user.ch_surname,
             
           // },
          //},
          
          error: null,
        });

      } catch (error) {
        this.#handleError(error, res);
      }
    };

    static recovery = async (req = request, res = response) => {
      try {
        let { ch_email } = req.body;
        const userModel = new UserModel();
        const user = await userModel.findByEmail(ch_email);
        if (!user) throw CustomError.notFound("User not exist");
        const code = Math.floor(Math.random() * 500000) + 100000;
        const sendEmail = await sendRecoveryCode(ch_email, code);
        if (!sendEmail)
        throw CustomError.notFound(
          "An error occurred while sending the recovery email"
        );
      return res.status(200).json({
        status: true,
        data: null,
        error: null,
      });


      }catch (error) {
          this.#handleError(error, res);
        } 
    }

    static login = async (req = request, res = response) => {
        try {
          let { email, password } = req.body;
     
         
         const userModel = new UserModel();
          const user = await userModel.findByEmail(email);
          if (!user) throw CustomError.notFound("User not exist");
          const { user_password, user_state } = user;
         
          const isValidPassword = Encrypter.compare(password, user_password);
          if (!isValidPassword)
            throw CustomError.unauthorized("Password is not valid");
          await userModel.updateColumnByUserId(user.id_user, { user_code: null });
          
         
          return res.status(200).json({
            status: true,
            data: {
              token,
              user: {
                names: user.user_names,
                surnames: user.user_surnames,
                email: user.user_email,
              
              
              },
            },
            error: null,
          });
        } catch (error) {
          this.#handleError(error, res);
        } 
      };
}

module.exports = AuthController;