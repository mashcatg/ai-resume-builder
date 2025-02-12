import React from "react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import axios from "axios";
const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post("http://localhost:5000/api/auth/signup", { name, email, password });
      signup(email, password);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setError(error.response.data.errors.map(err => err.msg).join(", "));
      } else {
        setError("Signup failed. Please try again.");
      }
      console.error("Signup error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      {error && <p>{error}</p>}
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
