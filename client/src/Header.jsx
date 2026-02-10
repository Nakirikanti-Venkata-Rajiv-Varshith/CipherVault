import React from "react";
import LogoutButton from "./LogoutButton";
import KeyIcon from '@mui/icons-material/Key';

function Header({ onLogout }) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 1rem",
      }}
    >
      <h1 style={{ display: "flex", alignItems: "center", margin:"5px 10px",fontSize: "45px" }}>
        CipherVault  <KeyIcon style={{fontSize: "60px"}} />
      </h1>
      <LogoutButton onLogout={onLogout} />
    </header>
  );
}

export default Header;