const { connectCommonDB } = require("../common");
class UserModel {
    constructor(db) {
      this._db = db;
    }

    findById = async (id_user = "") => {
      try {
        const db = this._db || (await connectCommonDB());
        const user = await db
          .select("*")
          .from("ch_users")
          .where("id_user", id_user)
          .first();
        return user;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
  
    findByEmail = async (email = "") => {
      try {
        const db = this._db || (await connectCommonDB());
        const user = await db
          .select("*")
          .from("ch_users")
          .where("ch_email", email)
          .first();
        return user;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
}

module.exports = UserModel;