import React,{useState,useEffect} from "react";
import {Form,Button,Container} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import { Link } from "react-router-dom";
import "./style.css"
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { sendRequest } from "../../utils/api.js";



const Login = () =>{
    //stati per i form

    const [email,setEmail] = useState('');
    const [pass, setPass] =  useState(''); 

    //hook per la navigazione 

    const navigate = useNavigate()
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token'); // Extract token from URL

        if (token) {
            // Store token in localStorage
            localStorage.setItem('token', token); 
            navigate('/'); 
            // Redirect to homepage or dashboard after login
        }
    }, [navigate]); // Dependency on navigate

    // Google OAuth login handler
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/google'; // Redirect to Google OAuth
    };

    //gestione del form e del invio 
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
            //Facciamo la richiesta di login
            const res = await sendRequest('http://localhost:5000/auth/login', 'POST',{email,password: pass});
            //salvimao il token nel LocST
            localStorage.setItem('token',res.token);

            //indirizziaamo l'utente alla pagia login 
            navigate('/');
        }catch(err){
            console.error('Errore durante il login ', err)
        }
    };

    return (
        <Container className="login">
            <Form className="login-content" onSubmit ={handleSubmit}>
            <h2>Ben Tornato</h2>
                <Form.Group className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required />
                </Form.Group>
                <Button type="submit" className="mt-4">Login</Button><span> <h4>Oppure</h4></span>
                <Button 
        as={Link}
        to='/register'
        className="blog-navbar-add-button bg-blue"
        style={{width: 'fit-content'}}
         >
          Sign Up
        </Button>
        <Button
                    onClick={handleGoogleLogin}
                    className="mt-4"
                >
                    Login with Google
                </Button>
            </Form>
        </Container>
    )
}
export default Login