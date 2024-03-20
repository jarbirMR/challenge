const { Router } = require("express");
const AuthRoutes = require("./auth/auth-router");
const UserRoutes = require("./users/users-router");





class AppRouter {
    static get routes() {
      const router = Router();
  
      router.get("/api", (_, res) => {
        return res.status(200).send("Welcome to user API");
      });

      router.use("/api/v1/auth", AuthRoutes.routes);
      router.use("/api/v1/users", UserRoutes.routes);
      return router;
    }
  }
  
  module.exports = AppRouter;