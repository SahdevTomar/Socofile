import React, { useState } from "react";
import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button.jsx";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
        setInput({
          username: "",
          email: "",
          password: ""
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={submitHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center">
            Signup to see photos & videos from your friends
          </p>
        </div>
        <div>
          <span className="font-medium">Username</span>
          <Input
            type="text"
            className="focus-visible:ring-transparent my-2"
            value={input.username}
            name="username"
            onChange={changeEventHandler}
          />
        </div>
        <div>
          <span className="font-medium">Email</span>
          <Input
            type="email"
            className="focus-visible:ring-transparent my-2"
            value={input.email}
            name="email"
            onChange={changeEventHandler}
          />
        </div>
        <div>
          <span className="font-medium">Password</span>
          <Input
            type="password"
            className="focus-visible:ring-transparent my-2"
            value={input.password}
            name="password"
            onChange={changeEventHandler}
          />
        </div>
        
        <Button
          disabled={loading}
          className="bg-black text-white"
          type="submit"
        >
          {loading ? "Please wait..." : "Signup"}
        </Button>
        <span className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
