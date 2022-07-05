import React, { useEffect } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";
import useAuth from "../contexts/Auth";

const Logout = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      await auth.logout();
    };

    try {
      logout();
      navigate("/");
    } catch (err) {
      NotificationManager.error("Error", err, 5000);
    }
  }, []);

  return <></>;
};

export default Logout;
