import express from 'express';
import Blog from '../models/blogPost.js';

const commentsBlogRouter =  express.Router();

commentsBlogRouter.get("/:blogId/comments", async ( req,res) => {
    const blogId = req.params.blogId;
    try{
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.status(404).send({
                message:'Blog non trovato'
            })
        }
        res.send(blog.comments)
    }catch(err){
        res.status(500).send({message:'Errore nel recupero dei commenti'})
    }
})

commentsBlogRouter.post("/:blogId/comments", async(req,res) => {
    const blogId =req.params.blogId;
    const {content, author }= req.body;

    try{
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.status(404).send({message:'BlogNon trovato!'});
        }
        const newComment = {content, author, createdAt:new Date()}
        blog.comments.push(newComment);
        await blog.save()

        res.status(201).send({
            message:'Commeneto aggiunto'
        })
    }catch(err){
        res.status(500).send({message:'Errore durante il caricamento del commento'})
    }
})


export default commentsBlogRouter;