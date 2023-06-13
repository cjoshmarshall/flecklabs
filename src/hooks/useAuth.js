import React, { useContext } from "react";
import AuthContext from "../context/AuthProvider";

function useAuth() {
  const { auth, setAuth } = useContext(AuthContext);
  return useContext(AuthContext);
}

export default useAuth;
