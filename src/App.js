import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navigation from "./components/shared/Navigation/Navigation";
// import Register from "./pages/Register/Register";
// import Login from "./pages/Login/Login";
import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
import Rooms from "./pages/Rooms/Rooms";

// This is for the testing Purposes only.
const isAuth = false;
// const isAuth = true;
const user = {
  activated: true,
};
// const user = {
//   activated: true,
// };

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        {/* Unprotected Routes or Open Routes that any user can access */}
        <Route
          path="/"
          element={
            <GuestRoute>
              <Home />
            </GuestRoute>
          }
        />
        <Route
          path="/authenticate"
          element={
            <GuestRoute>
              <Authenticate />
            </GuestRoute>
          }
        />

        {/* Semi Protected Routes Begin from here */}
        <Route
          path="/activate"
          element={
            <SemiProtectedRoute>
              <Activate />
            </SemiProtectedRoute>
          }
        />

        {/* Protected Routes are begin from here */}
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route> */}
      </Routes>
    </BrowserRouter>
  );
}

// if in the GuestRoute if the user is authenticated then it is redirected to /rooms which is the protected route
// this saves us from the unprotected user access.
// In this route we redirected user directly to the rooms if the user is authenticated and then in the rooms section we check it for the user activation if the user is not activated then we redirect it to activation first.
const GuestRoute = ({ children }) => {
  return !isAuth ? children : <Navigate to="/rooms" />;
};

// SemiProtected Route
const SemiProtectedRoute = ({ children }) => {
  // here we check if user is not authenticated then send it to home or / route
  // if user is authenticated but the user is not activated then show him the activate route
  // else if user is authenticated and user is activated then redirect it to rooms route
  return !isAuth ? (
    <Navigate to="/" />
  ) : isAuth && !user.activated ? (
    children
  ) : (
    <Navigate to="/rooms" />
  );
};

// SemiProtected Route
const ProtectedRoute = ({ children }) => {
  // here we check if user is not authenticated then send it to home or / route
  // if user is authenticated but the user is not activated then show him the activate route
  // else if user is authenticated and user is activated then redirect it to the children route for which it wants to access.
  return !isAuth ? (
    <Navigate to="/" />
  ) : isAuth && !user.activated ? (
    <Navigate to="/activate" />
  ) : (
    children
  );
};

export default App;
