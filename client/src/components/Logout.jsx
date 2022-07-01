import React, { useEffect } from "react";
import { NotificationManager } from "react-notifications";
import useAuth from "../contexts/Auth";

const Logout = () => {
  const auth = useAuth();

  useEffect(() => {
    const logout = async () => {
      await auth.logout();
    };

    try {
      logout();
      document.cookie("token", null);
    } catch (err) {
      NotificationManager.error("Error", err, 5000);
    }
  }, []);

  return <></>;
};

export default Logout;
