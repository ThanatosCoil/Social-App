import { useState } from "react";
import "./register.scss";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8800/api/auth/register",
        inputs
      );
      setError(null);
      navigate("/login");
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Social App</h1>
          <p>
            An app that allows you to connect with your friends and family. And
            share your thoughts with them. Also, you can find new friends and
            make new connections.
          </p>
          <span>Already registered?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="name "
              name="name"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <button onClick={handleClick} type="submit">
              Register
            </button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
