import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authToken from '../middleware/auth.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport'


const authRouter = express.Router();

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback URL
authRouter.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    (req, res) => {
      // Successful authentication, redirect with JWT
      const token = req.user.token;
      res.redirect(`${process.env.FRONT_END_URL}/?token=${token}`); // Send token to frontend
    }
  );


// authRouter.get('/auth/success', (req, res) => {

//   const { token } = req.query;


//   res.json({ token });
//});
//endpoint per la registrazione
authRouter.post('/register', async(req,res) => {
    try{
        const {name,email,password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message:'User gia esitente'})

            //crypto la pass
            const passHashed = await bcrypt.hash(password,10);

            //newUser
            const newUser = new User({
                name,
                email,
                password: passHashed,
            });
            //salviamo utente 
            await newUser.save();

            res.status(201).send({message:'Utente salvato con successo'})
    }catch(err){
        res.status(500).send({message:'Errore durante la registrazione'})
    }
});
    //endpoint per login

    authRouter.post('/login', async (req,res)=>{
        try{
            const {email,password} = req.body;
                
            //cerchiamo utente
                const user = await User.findOne({email});
                if(!user) return res.status(400).send({message:'Credenziali non valide'})

                    //verifichiamo pass
                    const validPass = await bcrypt.compare(password,user.password);
                    if(!validPass) return res.status(500).send({message:'Credenziali non valide'})

                        //se va bene creo token 
                        const token = jwt.sign({userId: user._id} ,process.env.JWT_SECRET);
                        res.json({token});

    }catch(err){
        res.status(500).send({message:'Errore durante il login'})
    }
});

authRouter.get('/me', authToken,async(req,res) => {
    try{
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user)
    }catch(err){
        
    }
})


export default authRouter