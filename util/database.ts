import {Collection, Db, MongoClient} from "mongodb";
import {databaseUri} from "../config";
import {Member} from "../model/member";
import {Lot} from "../model/lot";

let _db: Db;

async function mongoConnect() {
  let db: Db | null = null;
  try {
    db = await MongoClient.connect(databaseUri)
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  if (db != null) {
    _db = db;
  }
}

class DB {

  constructor(db: Db) {
    this.db = db;
    this.member = db.collection("member");
    this.lot = db.collection("lot");
  }

  db: Db;
  member: Collection<Member>;
  lot: Collection<Lot>;
}

export async function mongo(): Promise<DB> {
  await mongoConnect();
  return new DB(_db);
}
