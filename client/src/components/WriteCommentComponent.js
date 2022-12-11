import React, { useState, useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Recaptcha from "react-google-recaptcha";
import FileUploader from "./FileUploader";
import { Context } from "../index";
import { create } from "../services/commentService";
import axios from "axios";
import { observer } from "mobx-react-lite";

const WriteCommentComponent = observer(({commentId}) => {
  const { user, comment } = useContext(Context);

  const [ip, setIP] = useState("");

  let isLogged = true;
  if (!localStorage.getItem("token") || !user.isAuth) {

    isLogged = false;

    localStorage.setItem("token", "");

    useEffect(() => {
      getData();
    }, []);
  }

  const getData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    setIP(res.data.IPv4);
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [homePage, setHomePage] = useState("");

  const createComment = () => {
    const formData = new FormData();

    formData.append("text", text);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("homePage", homePage);
    if (selectedFile) {
      formData.append("file", selectedFile, selectedFile.name);
    } 

    if (commentId && commentId.commentId) {
      formData.append("commentId", commentId.commentId);
    }

    formData.append("ip", ip);
    create(formData).then((data) => {
      if (data) {
        user.setUser(true);
        user.setIsAuth(true);
      } 

      if (!commentId) {
        comment.setTotalCount(comment.totalCount + 1)
        comment.setPage(Math.ceil(comment.totalCount / comment.limit))
      } else {
        window.location.reload(false)
      }
    });
  };

  return (
    <Form className="write-comment-form">
      {!isLogged ? (
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </Form.Group>
      ) : (
        ""
      )}

      {!isLogged ? (
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
          />
        </Form.Group>
      ) : (
        ""
      )}

      <Form.Group className="mb-3" controlId="formBasicHomePage">
        <Form.Label>Home Page</Form.Label>
        <Form.Control
          type="text"
          value={homePage}
          onChange={(e) => setHomePage(e.target.value)}
          placeholder="Enter home page"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicText">
        <Form.Label>Text</Form.Label>
        <Form.Control
          as="textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <FileUploader
          onFileSelectSuccess={(file) => setSelectedFile(file)}
          onFileSelectError={({ error }) => alert(error)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Recaptcha sitekey={process.env.REACT_APP_SITE_KEY} />
      </Form.Group>

      <Button variant="primary" onClick={createComment}>
        Enter
      </Button>
    </Form>
  );
})

export default WriteCommentComponent;
