import express from 'express';
import Blog from '../models/blogPost.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';

//prima di tutto configuriamo multer per salvare l'imagine in memoria temporaneamente
const storage = multer.memoryStorage()

//adesso deefiniamo  l'upload (oggetto middleware ) grazie alla config di multer di prima 

const upload = multer({storage: storage})



const blogRouter = express.Router();
blogRouter.patch(
    "/:blogId/cover", upload.single("cover"),
    async(req,res,next)=> {
        const id = req.params.blogId
        //vediamo se esiste
        try{
            const blog =await Blog.findById(id);
            if(!blog){
                return res.status(404).send({message:'Blog non Trovato'})
            }
            if(req.file){
                const result = await new Promise((resolve, reject) => {
                    const uploadFile = cloudinary.uploader.upload_stream(
                        {folder:'cover'},
                        (error,result) => {
                            if(error) reject(error)
                                else resolve(result)
                        }
                    );
                    //invio de buffer del img
                    uploadFile.end(req.file.buffer)
                });

                //url sicuro su cloudiary (https)
                blog.cover = result.secure_url;
                await blog.save();
                res.send({
                    message:'Cover del blog aggiunta con successo',
                    cover: blog.cover
                });
            }else{
                res.status(400).send({message:'Nessun file fornito'})
            }
        }catch(err){
            console.log(err);
            res.status(500).send({message:'Errore nel caricare la Cover'})
        }
    }
)

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
    res.sendStatuss(204)
})

export default blogRouter;