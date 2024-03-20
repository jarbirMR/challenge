const { Router } = require("express");
const UserController = require("../../controllers/user-controller");
const AuthMiddleware = require("../../middleware/validate-token");



class UserRoutes {
    static get routes() {
        const router = Router();
        router.get("/listUsers", AuthMiddleware.validateJWT, UserController.listUsers);
        return router;
    }

}

module.exports = UserRoutes;