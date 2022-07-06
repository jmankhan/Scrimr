import { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { NotificationContainer } from "react-notifications";
import useAuth, { AuthProvider } from "./contexts/Auth";
import CreateScrim from "./components/CreateScrim";
import Home from "./components/Home";
import NavBar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import Logout from "./components/Logout";
import MyScrims from "./components/MyScrims";
import InHouseLanding from "./components/InHouseLanding";
import Profile from "./components/Profile";
import ConfirmCode from "./components/ConfirmCode";
import { Dimmer, Loader } from "semantic-ui-react";
import API from "./api/index.js";

function App() {
  const [initialUser, setInitialUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrrentUser = async () => {
      const response = await API.getCurrentUser();
      setInitialUser(response.user);
      setLoading(false);
    };

    try {
      getCurrrentUser();
    } catch (err) {
      setLoading(false);
    }
  }, []);

  return (
    <div className="App">
      <NotificationContainer
        style={{
          display: "block !important",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
      {!loading && (
        <AuthProvider initialUser={initialUser}>
          <NavBar>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/login" element={<LoginForm />}></Route>
              <Route path="/register" element={<RegistrationForm />}></Route>
              <Route
                path="/logout"
                element={
                  <PrivateRoute redirectTo="/">
                    <Logout />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/confirm"
                element={
                  <PrivateRoute>
                    <ConfirmCode />
                  </PrivateRoute>
                }
              />
              <Route path="/in-house" element={<InHouseLanding />} />
              <Route
                path="/in-house/create-scrim"
                element={
                  <PrivateRoute>
                    <CreateScrim />
                  </PrivateRoute>
                }
              />
              <Route
                path="/in-house/create-scrim/:id"
                element={
                  <PrivateRoute>
                    <CreateScrim />
                  </PrivateRoute>
                }
              />
            </Routes>
          </NavBar>
        </AuthProvider>
      )}
    </div>
  );
}

function PrivateRoute({ children, redirectTo = "/login" }) {
  const auth = useAuth();
  if (auth.loading) {
    return (
      <Dimmer>
        <Loader active />
      </Dimmer>
    );
  }

  return auth.value.user ? children : <Navigate to={redirectTo} />;
}

export default App;
