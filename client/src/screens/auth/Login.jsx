import axios from "axios";
import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import FormError from "../../components/FormError";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [focus, setFocus] = useState("");

  const validateField = useCallback((name, value) => {
    let error = "";

    switch (name) {
      case "username":
        if (!value) {
          error = "Username or email is required";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      validateField(name, value);
    },
    [validateField]
  );

  const validate = useCallback(() => {
    let valid = true;
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (errors[key]) {
        valid = false;
      }
    });
    return valid;
  }, [formData, errors, validateField]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validate()) {
        return;
      }
      setLoading(true);
      try {
        const res = await axios.post("/api/auth/login", {
          ...formData,
        });
        const message = res.data.message;
        toast.success(message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "colored",
        });
        navigate("/");
      } catch (error) {
        const message = error?.response?.data?.errors?.message;
        toast.error(message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "colored",
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate, validate]
  );

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-gray-800 text-center text-2xl font-bold">Sign in</h2>
      <div>
        <label className="text-gray-800 text-sm mb-2 block">
          Username or email
        </label>
        <div className="relative flex items-center">
          <input
            name="username"
            type="text"
            required
            className={
              errors.username
                ? "text-gray-800 bg-white border border-red-600 w-full text-sm px-4 py-3 rounded-md outline-red-600"
                : "text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-chatapp"
            }
            placeholder="Enter username or email"
            value={formData.username}
            onChange={handleChange}
            onFocus={() => setFocus("username")}
          />
        </div>
        {focus === "username" && errors.username && (
          <FormError message={errors.username} />
        )}
      </div>

      <div>
        <label className="text-gray-800 text-sm mb-2 block">Password</label>
        <div className="relative flex items-center">
          <input
            name="password"
            type="password"
            required
            className={
              errors.password
                ? "text-gray-800 bg-white border border-red-600 w-full text-sm px-4 py-3 rounded-md outline-red-600"
                : "text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-chatapp"
            }
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setFocus("password")}
          />
        </div>
        {focus === "password" && errors.password && (
          <FormError message={errors.password} />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.rememberMe}
            onChange={() =>
              setFormData((pre) => ({
                ...pre,
                rememberMe: !pre.rememberMe,
              }))
            }
          />
          <label
            htmlFor="remember-me"
            className="ml-3 block text-sm text-gray-800"
          >
            Remember me
          </label>
        </div>
        <div className="text-sm">
          <Link
            to={"/forgot"}
            className="text-blue-600 hover:underline font-semibold"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      <div className="!mt-8">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-gray-500"
        >
          {loading ? (
            <span>
              Please wait ... <Spinner />
            </span>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </div>
      <p className="text-gray-800 text-sm !mt-8 text-center">
        Don't have an account?
        <Link
          to={"/register"}
          className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
        >
          Register here
        </Link>
      </p>
    </form>
  );
}
