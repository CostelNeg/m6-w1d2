import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    age: Number,
    role: String,
    approved: Boolean,
  },
  {
    //nome della collection nel mongo
    collection: "users",
  }
);
//questo lo useremo nella creazione dei utenti
//il model rapresenta un documento unico
const User = model("User", userSchema);
export default User;
