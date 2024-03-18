const knex = require("knex");
const cache = require("memory-cache");
const { connectCommonDB } = require("./common");

async function getConstants() {
  let users;
  const commonDBConnection = await connectCommonDB();
  users = await commonDBConnection.select("*").from("ch_users");
  let connectionMap = [];

  for (const user of users) {
    const connection = {
      [user.user_subdomain]: async () => {
        let db = knex(createConnectionConfig(user));
        return new Promise((resolve, _) => {
          db.raw("SELECT 1")
            .then(() => {
              console.log(
                `DB User ${user.user_subdomain.toUpperCase()} is online`
              );
              resolve(db);
            })
            .catch((error) => {
              console.log({ error });
              resolve(null);
            });
        });
      },
    };
    connectionMap.push(connection);
  }

  connectionMap = connectionMap.reduce((prev, next) => {
    return Object.assign({}, prev, next);
  }, {});

  cache.put("constants", connectionMap);
}

function createConnectionConfig(users) {
  const userDBConnetion = {
    users: "mysql",
    connection: {
      host: users.user_db_host,
      port: users.user_db_port,
      user: users.user_db_user,
      database: users.user_db_name,
      password: users.user_db_password,
    },
    pool: { min: 2, max: 2000 },
  };
  return userDBConnetion;
}

async function getConnectionBySubdomain(subdomain) {
  let constants = cache.get("constants");
  if (!constants || !constants[subdomain]) {
    cache.clear();
    await getConstants();
  }
  constants = cache.get("constants");
  const connection = constants[subdomain];
  return connection ? connection : undefined;
}

module.exports = {
  getConstants,
  getConnectionBySubdomain,
};
