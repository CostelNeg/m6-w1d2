import React,{useState} from "react";
import { Form,Button,Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './style.css'
import {sendRequest} from '../../utils/api.js'

const Register = () => {
    const [name, setName] = useState('');
    const [email,setEmail] = useState('');
    const [pass, setPass] = useState('');

    //hook per la nav

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
           const res = await sendRequest('http://localhost:5000/auth/register', 'POST', {email,name,password: pass});
           if(res.message){
                        //dopo registyrazione vai qua (login)
            navigate('/login');
           }


        }catch(err){
            console.error('Errore durante la registrazione ', err)
            alert(err)
        }
    }
    return(
        <Container  className="login">
            <h2>Registrazione</h2>
            <Form className="login-content" onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required /> 
                </Form.Group>
                <Form.Group>
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
                <Button type="submit">Registrati</Button>
            </Form>
        </Container>
    )
}
export default Register;