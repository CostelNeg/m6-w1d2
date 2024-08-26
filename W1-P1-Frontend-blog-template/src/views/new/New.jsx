import React, {useEffect, useCallback, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./styles.css";
import {convertToRaw} from "draft-js"
import draftToHtml from "draftjs-to-html"
import { EditorState } from "draft-js";


const NewBlogPost = () => {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Categoria 1");
  const [content, setContent] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  //attiviamo lo useEfect ogni volta che conten cambia
  useEffect(() => {
  },[content])
  const handleChange = useCallback(editorState => {
    
    setEditorState(editorState)//aggiorniamo lo stato del editor
    console.log(editorState)
    //contenuto corente dell editor
    const contentState = editorState.getCurrentContent()
    //formarto row del editor

    const rowContentState = convertToRaw(contentState);
    //row in html
    const htmlContent = draftToHtml(rowContentState);
    setContent(htmlContent)
  },[]);



  const handleSubmit = async (e) => { 
    e.preventDefault();
    try{
      const res = await fetch('http://localhost:5000/blogs' , {
        method:"POST",
        headers : {
          'Content-Type' : 'application/json'
        },
        body:JSON.stringify({
          title,
          category,
          content
        }),
      });
      if(res.ok){
        const data = await res.json();
        console.log('Ris server : ', data);

        //resetimao tutti i dati se mandati coretamnte al server
        setTitle("");
        setCategory("Categoria 1");
        setEditorState(EditorState.createEmpty());
        setContent("")
      }else{
        throw new Error ('Errore nel invio al server')
      }
     }catch(err){
      console.log('Errore nella connesione al db');
     }
   }



  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSubmit}>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control size="lg" placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control size="lg" as="select" 
          value= {category}
          onChange={(e) => setCategory(e.target.value)}>
            <option>Categoria 1</option>
            <option>Categoria 2</option>
            <option>Categoria 3</option>
            <option>Categoria 4</option>
            <option>Categoria 5</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Contenuto Blog</Form.Label>

          <Editor editorState={editorState}
           onEditorStateChange={handleChange} className="new-blog-content" />
        </Form.Group>
        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{
              marginLeft: "1em",
            }}
          >
            Invia
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;
