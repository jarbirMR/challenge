const { response, request } = require("express");
const CustomError = require("../config/errors");

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

    static login = async (req = request, res = response) => {
        try {
          let { email, password } = req.body;
          const dbConnection = req.clientConnection;
          const userModel = new UserModel(dbConnection);
          const userRoleModel = new UserRoleModel(dbConnection);
          const user = await userModel.findByEmail(email);
          if (!user) throw CustomError.notFound("User not exist");
          const { user_password, user_state } = user;
          if (!user_state) throw CustomError.unauthorized("User is not active");
          const isValidPassword = Encrypter.compare(password, user_password);
          if (!isValidPassword)
            throw CustomError.unauthorized("Password is not valid");
          await userModel.updateColumnByUserId(user.id_user, { user_code: null });
          const roles = await userRoleModel.findByIdUser(user.id_user);
          const token = await JWT.generateToken({
            email: user.user_email,
            roles,
          });
          return res.status(200).json({
            status: true,
            data: {
              token,
              user: {
                names: user.user_names,
                surnames: user.user_surnames,
                email: user.user_email,
                photo: user.user_photo,
                roles,
              },
            },
            error: null,
          });
        } catch (error) {
          this.#handleError(error, res);
        } finally {
          if (req.clientConnection) {
            await req.clientConnection.destroy();
          }
        }
      };
}

module.exports = AuthController;