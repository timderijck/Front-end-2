import { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";
import Login from "./pages/auth.jsx";
import Register from "./components/register.jsx";
import {  Routes, Route } from "react-router";
import { supabase } from './supabase.js';
import Header from './components/Header';
import Posts from './pages/Posts';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile.jsx';



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
          <Header />
          <Routes>

              {/*profile pages*/}
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/profile/:id" element={<PrivateRoute><PublicProfile /></PrivateRoute>} />

            <Route
                exact
                path="/"
                element={<Login/>}
            />
              <Route
                  path="/home"
                  element={
                      <PrivateRoute>
                          <Home/>
                      </PrivateRoute>
                  }
              />
              <Route
              path="/register"
              element={<Register/>}/>
              <Route
                  path="/login"
                  element={
                  <PrivateRoute>
                    <Login/>
                  </PrivateRoute>
                  }
                  />
              <Route
                  path="/posts"
                  element={
                      <PrivateRoute>
                          <Posts />
                      </PrivateRoute>
                  }
              />

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