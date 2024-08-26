import 'dotenv/config';
import mongoose from "mongoose";
import express from 'express';
import cors from 'cors'
import userRouter from './routers/user.router.js';
import blogRouter from './routers/blogs.router.js';

const port = process.env.PORT || 5000

const app = express();

const MONGO_URI = process.env.MONGO_STRING

await mongoose.connect(MONGO_URI)
.then(()=>{
    console.log("database conesso")
})
.catch((err) =>{
    console.log(err)
})
app.use(cors())
app.use(express.json());

app.use('/users', userRouter)
app.use('/blogs', blogRouter)


app.listen(port,  () => {
    console.log(`Server Pronto sul ${process.env.host}:${port} `)
})