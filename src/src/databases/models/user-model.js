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

    findByPass = async (password = "") => {
      try {
        const db = this._db || (await connectCommonDB());
        const user = await db
          .select("*")
          .from("ch_users")
          .where("ch_password", password)
          .first();
        return user;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
    updateColumnByUserId = async (id, data) => {
      try {
        const db = this._db || (await connectCommonDB());
        const updatedRows = await db
          .from("ch_users")
          .where("id_user", id)
          .update(data);
        return updatedRows;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    


    registerUser = async(users)=> {
      try{
        const db = this._db || (await connectCommonDB());
        const [id_user] = await db.insert({
          ch_name: users.ch_name,
          ch_surname: users.ch_surname,
          ch_email: users.ch_email,
          ch_password: users.ch_password
        }, ["id_user"])
        .into("ch_users")
        return id_user;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    listUsers = async () => {
      try {
        const db = this._db || (await connectCommonDB());
        const listUsers = await db.select([
          "id_user",
          "ch_name",
          "ch_surname",
          "ch_email"
        ]).from("ch_users");
        return listUsers;
      }catch (error) {
        console.error(error);
        throw error;
      }
    }
}

module.exports = UserModel;