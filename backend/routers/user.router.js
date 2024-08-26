import express from "express";
import User from "../models/User.js";
const userRouter = express.Router();

//metodo

userRouter.get("/", async (req, res, next) => {
  //recuperiamo i dati dal db

  //dichiarimai limite paginazione e user per pagina 
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 5
  const users = await User.find({})
  .sort({name:1, age:-1})
  .skip((page - 1) * perPage)
  .limit(perPage)

  const totalResult = await User.countDocuments();
  const totalPages = Math.ceil(totalResult / perPage)
  res.send({

    totalResult,
    dati : users,
    totalPages,
});
});
userRouter.get("/:userId", async(req, res, next) => {
  //recuperiamo i dati del utente con id === userID dal db
  const id = req.params.userId;
  //salvo l'utente trovato
  try{
      const user = await User.findById(id)
// leggo utente trovato
  res.send(user)
  }catch(error){
    res.status(404).send({message: 'Non trovato'})
  }

});
userRouter.post("/", async (req, res, next) => {
  //creiamo un nuvo utente, dopo slash va sempre il "usr"

  const userData = req.body;

  const newUser = new User(userData);

  try {
    const createdUser = await newUser.save();
    res.status(201).send({ createdUser });
  } catch (error) {
    res.status(400).send({ message: "Qualcosa e andato storto" });
  }
});
userRouter.put("/:userId",async (req, res, next) => {
  const id = req.params.userId;
  const userData = req.body;
  try{
      const updateUser = await User.findByIdAndUpdate(id,userData)
      res.send(updateUser)
  }catch(err){
    console.log(err);
    res.status(400).send()
  }
});
userRouter.delete("/:userId", async(req, res, next) => {
 await User.deleteOne({
    _id:req.params.userId
 })
 res.send(204)
});

export default userRouter;
