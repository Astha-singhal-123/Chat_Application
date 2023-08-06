import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { register } from "../utils/APIroutes";
import bcrypt from "bcryptjs";

function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { password, username, email } = values;
      const hashedpassword = await bcrypt.hash(password, 10);
      const { data } = await axios.post(register, {
        username,
        email,
        hashedpassword,
      });
      if (data.status === false) {
        toast.error(data.msg, toastoptions);
      } else {
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  const toastoptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  });

  const handleValidation = () => {
    const { password, confirmpassword, username, email } = values;
    if (password !== confirmpassword) {
      toast.error(
        "Password and Confirm Password should be same.",
        toastoptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error("Username length should be greater than 3", toastoptions);
      return false;
    } else if (password.length < 8) {
      toast.error("Password length should be greater than 8", toastoptions);
    } else if (email.length < 1) {
      toast.error("Email should not be empty", toastoptions);
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <Formcontainor>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <h1>Chat-App</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmpassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login</Link>
          </span>
        </form>
      </Formcontainor>
      <ToastContainer />
    </>
  );
}

const Formcontainor = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: lightcoral;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    h1 {
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    background-color: pink;
    gap: 0.69rem;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input {
      padding: 1rem;
      border: 0.1rem solid;
      border-radius: 0.8rem;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid;
        border-color: red;
        outline: none;
        transition: ease-in-out 0.25s;
      }
    }
    button {
      padding: 1rem;
      border: 0.1rem solid;
      border-radius: 0.8rem;
      width: 100%;
      font-size: 1rem;
      text-transform: uppercase;
      background-color: lightgreen;
      &:hover {
        background-color: lightblue;
        cursor: pointer;
        transition: ease-in-out 0.25s;
      }
    }
    a {
      text-transform: uppercase;
      color: brown;
    }
  }
`;
export default Register;
