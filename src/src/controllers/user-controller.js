const { response, request } = require("express");
const CustomError = require("../config/errors");
const UserModel = require("../databases/models/user-model");

class UserController {
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

      static listUsers = async (req = request, res = response) => {
        try {
            const userModel = await new UserModel();
            const list = await userModel.listUsers();
            return res.status(200).json({
                status: true,
                data: list,
                error: null,
              });
        } catch (error) {
      this.#handleError(error, res);
    }
      }


}

module.exports = UserController;