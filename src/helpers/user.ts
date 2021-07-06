import { Credentials } from "google-auth-library";
import { Schema, Model, createConnection, Connection, Document } from "mongoose";
import { getConfig } from "./config";

export interface User {
  id: string,
  code: string,
  name: string,
  email: string,
  installed: Credentials
}

export const userSchema = new Schema<User>({
  id: { type: String, required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  installed: {
    type: {
      access_token: { type: String, required: true },
      refresh_token: { type: String, required: true },
      scope: { type: String, required: true },
      token_type: { type: String, required: true }
    },
    required: true
  }
})

let connection: Connection;
export let UserModel: Model<User>;

(async () => {
  const config = await getConfig()

  connection = await createConnection(config.mongodb.userDatabase, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  UserModel = connection.model<User>('User', userSchema)
})();

export async function getUser(id: string): Promise<Document<User> | null> {
  return await UserModel.findOne({ id: id });
}

export async function updateUser(user: User) {
  const userSaved = await getUser(user.id)

  if(!userSaved) await new UserModel(user).save()
  else {
    userSaved?.overwrite(user)
    userSaved?.save()
  }
}