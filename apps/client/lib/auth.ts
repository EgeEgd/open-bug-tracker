/** @format */

import React, { useContext, useEffect } from "react";
import { setToken } from "./api";

export const authContext = React.createContext(null);

interface CurrentUser {
  setToken: (token: string) => void;
  user: { id: number; name: string } | null;
}

export function useUser(): CurrentUser {
  const user = useContext(authContext);
  useEffect(() => {
    const token = document.cookie
      .split(";")
      .find((row) => row.trim().startsWith("token="))
      ?.split("=")[1];

    if (token) {
      setToken(token);
    }
  });
  return {
    setToken: (mytoken) => {
      setToken(mytoken);
      localStorage.setItem("token", mytoken);
    },
    user,
  };
}
