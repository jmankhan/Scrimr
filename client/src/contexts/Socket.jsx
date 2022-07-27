import React from "react";
import io from "socket.io-client";
export const socket = io({ withCredentials: true });
export const SocketContext = React.createContext();
