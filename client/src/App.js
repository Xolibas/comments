import React, { useContext, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Index from "./components/Index";
import {observer} from "mobx-react-lite";
import {Spinner} from "react-bootstrap";
import {Context} from "./index";
import {check} from "./services/userService";
import axios from 'axios';
import { BrowserRouter } from "react-router-dom";

const App = observer(() => {
  const {user} = useContext(Context)
  const [loading, setLoading] = useState(true)

  const getData = async () => {
    axios.get('https://geolocation-db.com/json/').then(res => {
      check(res.data.IPv4).then(data => {
        if(data) {
          user.setUser(true)
          user.setIsAuth(true)
        } else {
          user.setUser(false);
          user.setIsAuth(false)
        }
      }).finally(() => setLoading(false))
    })
  }

  useEffect(() => {
    getData()
  }, [])


  if (loading) {
    return <Spinner animation={"grow"}/>
  }

  return (
    <div>
      <BrowserRouter>
        <Index/>
      </BrowserRouter>
    </div>
  );
});

export default App;