import { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./components/register.jsx";
import {  Routes, Route } from "react-router";
import { supabase } from './supabase.js';


function App() {
  const [instruments,    setInstruments] = useState([]);



  // async function getInstruments() {
  //   const {data, error} = await supabase.from("instruments").select();
  //
  //
  //   if (error) {
  //     console.error(error);
  //     return;
  //   }
  //
  //   setInstruments(data);
  // }
  //   useEffect(() => {
  //       getInstruments();
  //   }, []);
  return (
      <>
          <Routes>
            <Route
                exact
                path="/"
                element={<Login/>}
            />
            <Route
                path="/home"
                element={<Home/>}
            />
              <Route
              path="/register"
              element={<Register/>}/>
              <Route
                  path="/login"
                  element={<Login/>}/>
          </Routes>
        <ul>
          {instruments.map((item) => (
              <li key={item.name}>{item.name}</li>
          ))}
        </ul>
      </>
  );
}
export default App;