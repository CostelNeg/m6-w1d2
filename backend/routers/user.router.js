import express from "express";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import bycrypt from 'bcrypt'
const userRouter = express.Router();

//prima di tutto
//configuriamo multer per salvare l'imagine in memoria temporaneamente
const storage = multer.memoryStorage();
//poi
// definiamo l'upload con la config di storage
const upload = multer({ storage: storage });

userRouter.get("/", async (req, res, next) => {
  //recuperiamo i dati dal db

  //dichiarimai limite paginazione e user per pagina
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 5;
  const users = await User.find({})
    .sort({ name: 1, age: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage);

  const totalResult = await User.countDocuments();
  const totalPages = Math.ceil(totalResult / perPage);
  res.send({
    totalResult,
    dati: users,
    totalPages,
  });
});
userRouter.get("/:userId", async (req, res, next) => {
  //recuperiamo i dati del utente con id === userID dal db
  const id = req.params.userId;
  //salvo l'utente trovato
  try {
    const user = await User.findById(id);
    // leggo utente trovato
    res.send(user);
  } catch (error) {
    res.status(404).send({ message: "Non trovato" });
  }
});
userRouter.post("/authors", async (req, res, next) => {
  //creiamo un nuvo utente, dopo slash va sempre il "usr"

  const {name,email,password} = req.body

  const userEsistente = await User.findOne({email});
  if(userEsistente ){
    return res.status(400).send({message:'Utente gia registrato'})
  }

  const hashPass = await bycrypt.hash(password,10);
  const newUser = new User({
    name,
    email,
    password:hashPass,
  });

  const savedUser = await newUser.save();
  res.status(201).send(savedUser)
});
userRouter.put("/:userId", async (req, res, next) => {
  const id = req.params.userId;
  const userData = req.body;
  try {
    const updateUser = await User.findByIdAndUpdate(id, userData);
    res.send(updateUser);
  } catch (err) {
    console.log(err);
    res.status(400).send();
  }
});
userRouter.delete("/:userId", async (req, res, next) => {
  await User.deleteOne({
    _id: req.params.userId,
  });
  res.send(204);
});
userRouter.patch(
  "/:userId/avatar",
  upload.single("avatar"),
  async (req, res, next) => {
    const id = req.params.userId;

    //controlo esistenza utente

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send({ message: "Utente non trovato " });
      }
      //nel caso venise fornito un file
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const uploadFile = cloudinary.uploader.upload_stream(
            { folder: "avatar" }, //la destinazione del file in cloudinary
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          //inviamo il buffer del img
          uploadFile.end(req.file.buffer);
        });
        user.avatar = result.secure_url;
        await user.save();
        res.send({
          message: "Avatar aggiunto con succeso",
          avatar: user.avatar,
        });
      } else {
        res.status(400).send({ message: "nessun file fornito" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "errire nel aggiornare avatar" });
    }
  }
);

export default userRouter;
