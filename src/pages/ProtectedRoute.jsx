import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/fakeAuthContext";
import { useEffect } from "react";

function protectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(
    function () {
      if (!isAuthenticated) navigate("/");
    },
    [navigate, isAuthenticated]
  );
  return isAuthenticated ? children : null;
}

export default protectedRoute;
