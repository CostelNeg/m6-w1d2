import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    googleId:{type:String,unique:true},
    name: { type: String },
    email: { type: String, required: true, unique: true },
    role: String,
    avatar:String,
    password: {
      type:String,
      required:true,
    },
    verifiedAt: Date,
    verificationCode:String,
    
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
