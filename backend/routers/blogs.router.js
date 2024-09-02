import express from "express";
import Blog from "../models/blogPost.js";
import cloudinary from "../config/cloudinary.js";
import Comment from '../models/comments.js'
import multer from "multer";

//prima di tutto configuriamo multer per salvare l'imagine in memoria temporaneamente
const storage = multer.memoryStorage();

//adesso deefiniamo  l'upload (oggetto middleware ) grazie alla config di multer di prima

const upload = multer({ storage: storage });

const blogRouter = express.Router();

blogRouter.patch(
  "/:blogId/cover",
  upload.single("cover"),
  async (req, res, next) => {
    const id = req.params.blogId;
    //vediamo se esiste
    try {
      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).send({ message: "Blog non Trovato" });
      }
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const uploadFile = cloudinary.uploader.upload_stream(
            { folder: "cover" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          //invio de buffer del img
          uploadFile.end(req.file.buffer);
        });

        //url sicuro su cloudiary (https)
        blog.cover = result.secure_url;
        await blog.save();
        res.send({
          message: "Cover del blog aggiunta con successo",
          cover: blog.cover,
        });
      } else {
        res.status(400).send({ message: "Nessun file fornito" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Errore nel caricare la Cover" });
    }
  }
);

blogRouter.get("/", async (req, res) => {
  //recuper di tutti i post presenti
  const blogs = await Blog.find({});
  res.send(blogs);
});

blogRouter.get("/:blogId", async (req, res) => {
  const id = req.params.blogId;
  try {
    const blog = await Blog.findById(id);
    res.send(blog);
  } catch (err) {
    res.status(404).send({ message: "Blog non trovato" });
  }
});

blogRouter.post("/", async (req, res) => {
  const postData = req.body;
  const newPost = new Blog(postData);
  try {
    const createPost = await newPost.save();
    res.status(201).send({ createPost });
  } catch (err) {
    res.status(400).send({ message: "Qualcosa non ha funzionato" });
  }
});

blogRouter.put("/:blogId", async (req, res) => {
  const id = req.params.blogId;
  const blogData = req.body;
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, blogData);
    res.send(updateBlog);
  } catch (err) {
    res.status(400).send({ message: "Upps, Try Again" });
  }
});

blogRouter.delete("/:blogId", async (req, res) => {
  await Blog.deleteOne({
    _id: req.params.blogId,
  });
  res.sendStatus(204);
});


//commenti routers

blogRouter.get("/:blogId/comments", async (req,res) => {
    try{
        const blogId = req.params.blogId;
        const commnets = await Comment.find({blogId:blogId})
        res.send(commnets)
    }catch(err){
        res.status(500).send({
            message: 'Errore nel cercare commenti'
        })
    }
});
blogRouter.get("/:blogId/comments/:commentId", async(req,res)=>{
    //aggiungere sempre i due punti per id!!!!!!!!!
    try{
        const {blogId, commentId} = req.params;
        const comment = await Comment.findOne({_id:commentId, blogId:blogId})
        if(!comment){
            return res.status(404).send({message:'Commento non trovato'})
        }
        res.send(comment)
    }catch(err){
        console.log(err)
        res.status(500).send({message:'Errore nel cercare il commento'})
    }
});
blogRouter.post("/:blogId/comments", async(req,res)=>{
    try{
        const blogId = req.params.blogId;
        const commentData = {... req.body, blogId}
        const newComment = new Comment(commentData);
        const saveComment = await newComment.save()
        res.status(201).send(saveComment)
    }catch(err){
        res.status(400).send({message:'Errore durante caricamento commento'})
    }
});

blogRouter.put("/:blogId/comments/:commentsId", async (req,res) => {
    try{
        const {blogId,commentId} = req.params;
        const updateComment = await Comment.findOneAndUpdate({_id:commentId,blogId:blogId},
            req.body,
            {new:true}
        );
        if(!updateComment){
            return res.status(404).send({message:'Commento non trovato'})
        }
        res.send(updateComment)
    }catch(err){
        res.status(400).send(err)
    }
});
blogRouter.delete("/:blogId/comments/:commentsId", async (req,res) => {
    try{
        const {blogId,commentId} = req.params;
        const deletedComment = await Comment.findOneAndDelete({_id:commentId,blogId:blogId});
        if(!deletedComment){
            return res.status(404).send({message:'Commento non trovato'})
        }
        res.sendStatus(204)
    }catch(err){
        res.status(500).send(err)
    }
});

export default blogRouter;
