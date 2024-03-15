const { Router } = require("express");
const AuthRoutes = require("./auth/auth.router");


class AppRouter {
    static get routes() {
      const router = Router();
  
      router.use(resolveUserDBConnection);
  
      router.get("/api", (_, res) => {
        return res.send("Welcome to User API");
      });

      
      return router;
    }
  }
  
  module.exports = AppRouter;