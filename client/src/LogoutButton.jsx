import React from "react";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";

export default function LogoutButton({ onLogout }) {

  // LOGOUT FUNCTION 
  function handleLogout() {

    // Calling logout backend
    fetch("/logout", {
      method: "GET",
      credentials: "include" 
    })
    .then(() => {

      window.location.href = "/login";

    })
    .catch(err => console.error(err));
  }

  return (
    <Button
      variant="contained"
      color="error"
      startIcon={<LogoutIcon />}
      onClick={handleLogout}   
    >
      Logout
    </Button>
  );
}
