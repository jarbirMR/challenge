const { Router } = require("express");
const AuthController = require("../../controllers/auth-controller");

class AuthRoutes {
    static get routes() {
        const router = Router();
        router.post("/registro", AuthController.register);
        router.post("/login", AuthController.loginversion);
        router.post("/recovery", AuthController.recovery);
        return router;
    }

}

module.exports = AuthRoutes;