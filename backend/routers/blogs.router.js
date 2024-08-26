import express from 'express';
import Blog from '../models/blogPost.js';

const blogRouter = express.Router();

blogRouter.get('/', async (req,res) =>{
    //recuper di tutti i post presenti
    const blogs = await Blog.find({})
    res.send(blogs)
});

blogRouter.get('/:blogId', async (req,res) =>{
    const id=req.params.blogId
    try{
        const blog = await Blog.findById(id)
        res.send(blog)
    }
    catch(err){
        res.status(404).send({message:'Blog non trovato'
        })
    }
});

blogRouter.post('/', async (req,res) => {
    const postData = req.body;
    const newPost = new Blog(postData);
    try{
        const createPost = await newPost.save()
        res.status(201).send({createPost})
    }catch(err){
        res.status(400).send({message:'Qualcosa non ha funzionato'});
    }
});

blogRouter.put('/:blogId', async (req,res) => {
    const id =req.params.blogId
    const blogData =  req.body;
     try{ 
        const updateBlog = await Blog.findByIdAndUpdate(id,blogData)
        res.send(updateBlog)
     }catch(err){
        res.status(400).send({message:'Upps, Try Again'})
     }
});

blogRouter.delete('/:blogId',async (req,res) => {
    await Blog.deleteOne({
        _id:req.params.blogId
    })
    res.sendStatus(204)
})

export default blogRouter;