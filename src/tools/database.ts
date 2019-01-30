import datastore from "nedb-promise-ts";
const path = require("path");

function doDatabaseStuff() {
  let DB = new datastore({
    // these options are passed through to nedb.Datastore
    filename: path.join(process.cwd(), "copytranslator-db.json"),
    autoload: true // so that we don't have to call loadDatabase()
  });
  (<any>global).db = DB;
  return DB;
}
