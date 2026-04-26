import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { addUser } from "./blog";
import { useNavigate } from "react-router-dom";
import { url } from "./api";
import pahad from "./plain.jpg";

const inputStyle = {
  borderRadius: 10,
  height: 40,
  width: "100%",
  paddingLeft: 12,
  paddingRight: 12,
  backgroundColor: "rgba(128, 164, 206, 0.12)",
  color: "white",
  border: "1px solid rgba(128, 164, 206, 0.32)",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  color: "white",
  marginBottom: 6,
  marginTop: 0,
};

const Login = () => {
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    if (!userName || !name || !email || !password || !confirmPassword || !phoneNum) {
      toast.error("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);

      dispatch(
        addUser({
          userName,
          name,
          email,
          password,
          phoneNum,
          image: "",
        }),
      );

      const result = await axios.post(`${url}/signup`, {
        userName,
        name,
        email,
        password,
        phoneNum,
        image: "",
      });

      if (result.data?.message === "success" && result.data?.token) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("email", email);
        localStorage.setItem("name", name);
        localStorage.setItem("userName", userName);
        localStorage.setItem("image", "");

        toast.success("Signup successful");
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="main"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        padding: "24px 14px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <img
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        src={pahad}
        alt="background"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(128,164,206,0.25), transparent 42%), rgba(9,52,76,0.72)",
          zIndex: 1,
        }}
      />

      <ToastContainer />

      <div
        id="login-child"
        style={{
          border: "1px solid rgba(128, 164, 206, 0.45)",
          zIndex: 2,
          backgroundColor: "rgba(5, 29, 42, 0.62)",
          backdropFilter: "blur(18px)",
          display: "flex",
          flexDirection: "column",
          borderRadius: 24,
          width: "100%",
          maxWidth: 460,
          fontFamily: "roboto",
          boxShadow: "0px 25px 60px rgba(0,0,0,0.35)",
          padding: "26px 26px 28px",
          gap: 12,
        }}
      >
        <div style={{ width: "100%", marginBottom: 4 }}>
          <h2 style={{ color: "white", margin: 0, fontFamily: "roboto", fontSize: 30 }}>Create Account</h2>
          <p style={{ color: "rgb(194, 214, 237)", marginTop: 8, marginBottom: 0, fontSize: 14 }}>
            Join and start sharing your blogs.
          </p>
        </div>

        <div style={{ width: "100%" }}>
          <p style={labelStyle}>Username</p>
          <input onChange={(e) => setUserName(e.target.value)} value={userName} style={inputStyle} type="text" placeholder="Enter username" />
        </div>

        <div style={{ width: "100%" }}>
          <p style={labelStyle}>Name</p>
          <input onChange={(e) => setName(e.target.value)} value={name} style={inputStyle} type="text" placeholder="Enter full name" />
        </div>

        <div style={{ width: "100%" }}>
          <p style={labelStyle}>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} style={inputStyle} type="email" placeholder="Enter email" />
        </div>

        <div style={{ width: "100%" }}>
          <p style={labelStyle}>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} style={inputStyle} type="password" placeholder="Enter password" />
        </div>

        <div style={{ width: "100%" }}>
          <p style={labelStyle}>Confirm Password</p>
          <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} style={inputStyle} type="password" placeholder="Confirm password" />
        </div>

        <div style={{ width: "100%" }}>
          <p style={labelStyle}>Phone Number</p>
          <input onChange={(e) => setPhoneNum(e.target.value)} value={phoneNum} style={inputStyle} type="tel" placeholder="Enter phone number" />
        </div>

        <button
          disabled={isSubmitting}
          onClick={handleRegister}
          style={{
            color: "rgb(9, 52, 76)",
            backgroundColor: "rgb(128, 164, 206)",
            borderRadius: 10,
            height: 42,
            width: "100%",
            fontSize: 16,
            marginTop: 8,
            border: "1px solid rgba(128, 164, 206, 0.85)",
            cursor: "pointer",
            fontWeight: 600,
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        <p style={{ color: "rgb(194, 214, 237)", marginTop: 8, marginBottom: 0, fontSize: 14, textAlign: "center" }}>
          Already have an account?{" "}
          <span onClick={() => navigate("/Signup")} style={{ cursor: "pointer", textDecoration: "underline", fontWeight: 600 }}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
