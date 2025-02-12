import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/reset-password", { token, newPassword });
      setMessage("Password reset successfully. You can now log in.");
      setError("");
    } catch (error) {
      setError(error.response.data.message || "Failed to reset password. Please try again.");
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
        required
      />
      <button type="submit">Reset Password</button>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </form>
  );
};

export default ResetPassword;
