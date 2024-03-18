const { Router } = require("express");
const resolveUserDBConnection = require("../middleware/db-conecction");




class AppRouter {
    static get routes() {
      const router = Router();

      router.use(resolveUserDBConnection);
  
      router.get("/api", (_, res) => {
        return res.status(200).send("Welcome to user API");
      });

      
      return router;
    }
  }
  
  module.exports = AppRouter;