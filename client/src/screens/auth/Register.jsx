import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import RedAsterisk from "../../components/RedAsterisk";
import FormError from "../../components/FormError";
import Spinner from "../../components/Spinner";
import { emailRegex } from "../../ultis/MagicStuffs";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [focus, setFocus] = useState("");

  const validateField = useCallback(
    (name, value) => {
      let error = "";

      switch (name) {
        case "username":
          if (!value) {
            error = "Username is required";
          }
          break;
        case "email":
          if (!value) {
            error = "Email is required";
          } else if (!emailRegex.test(value)) {
            error = "Invalid email format";
          }
          break;
        case "password":
          const minLength = 8;
          const maxLength = 24;
          const hasLowercase = /[a-z]/.test(value);
          const hasUppercase = /[A-Z]/.test(value);
          const hasNumber = /\d/.test(value);
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
          const isValidLength =
            value.length >= minLength && value.length <= maxLength;

          if (!value) {
            error = "Password is required";
          } else if (!isValidLength) {
            error = "Password must be 8-24 characters long";
          } else if (!hasLowercase) {
            error = "Password must have at least one lowercase letter";
          } else if (!hasUppercase) {
            error = "Password must have at least one uppercase letter";
          } else if (!hasNumber) {
            error = "Password must have at least one number";
          } else if (!hasSpecialChar) {
            error = "Password must have at least one special character";
          }
          break;
        case "cpassword":
          if (value !== formData.password) {
            error = "Passwords do not match";
          }
          break;
        default:
          break;
      }

      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [formData.password]
  );

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
        const res = await axios.post("/api/auth/register", {
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
        navigate("/login");
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
    [formData, validate, navigate]
  );

  const getPasswordCriteriaClass = (condition) => {
    return condition ? "text-green-600" : "text-red-600";
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-xl font-bold text-center my-3">CREATE AN ACCOUNT</h1>
      <div className="space-y-6">
        <div>
          <label
            className="text-gray-800 text-sm mb-2 block"
            htmlFor="username"
          >
            Username <RedAsterisk />
          </label>
          <input
            id="username"
            name="username"
            type="text"
            className={
              errors.username
                ? "text-gray-800 bg-white border border-red-600 w-full text-sm px-4 py-3 rounded-md outline-red-600"
                : "text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-chatapp"
            }
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            onFocus={() => setFocus("username")}
          />
          {focus === "username" && errors.username && (
            <FormError message={errors.username} />
          )}
        </div>
        <div>
          <label className="text-gray-800 text-sm mb-2 block" htmlFor="email">
            Email <RedAsterisk />
          </label>
          <input
            id="email"
            name="email"
            type="text"
            className={
              errors.email
                ? "text-gray-800 bg-white border border-red-600 w-full text-sm px-4 py-3 rounded-md outline-red-600"
                : "text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-chatapp"
            }
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setFocus("email")}
          />
          {focus === "email" && errors.email && (
            <FormError message={errors.email} />
          )}
        </div>
        <div>
          <label
            className="text-gray-800 text-sm mb-2 block"
            htmlFor="password"
          >
            Password <RedAsterisk />
          </label>
          <input
            id="password"
            name="password"
            type="password"
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
          {focus === "password" && (
            <div className="space-y-2 mt-2">
              <div
                className={getPasswordCriteriaClass(
                  formData.password.length >= 8 &&
                    formData.password.length <= 24
                )}
              >
                Password must be 8-24 characters long
              </div>
              <div
                className={getPasswordCriteriaClass(
                  /[a-z]/.test(formData.password)
                )}
              >
                Password must have at least one lowercase letter
              </div>
              <div
                className={getPasswordCriteriaClass(
                  /[A-Z]/.test(formData.password)
                )}
              >
                Password must have at least one uppercase letter
              </div>
              <div
                className={getPasswordCriteriaClass(
                  /\d/.test(formData.password)
                )}
              >
                Password must have at least one number
              </div>
              <div
                className={getPasswordCriteriaClass(
                  /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                )}
              >
                Password must have at least one special character
              </div>
            </div>
          )}
        </div>
        <div>
          <label
            className="text-gray-800 text-sm mb-2 block"
            htmlFor="cpassword"
          >
            Confirm Password <RedAsterisk />
          </label>
          <input
            id="cpassword"
            name="cpassword"
            type="password"
            className={
              errors.cpassword
                ? "text-gray-800 bg-white border border-red-600 w-full text-sm px-4 py-3 rounded-md outline-red-600"
                : "text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-chatapp"
            }
            placeholder="Enter confirm password"
            value={formData.cpassword}
            onChange={handleChange}
            onFocus={() => setFocus("cpassword")}
          />
          {focus === "cpassword" && errors.cpassword && (
            <FormError message={errors.cpassword} />
          )}
        </div>
      </div>

      <div className="!mt-12">
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
            <span>Create an account</span>
          )}
        </button>
      </div>
      <p className="text-gray-800 text-sm mt-6 text-center">
        Already have an account?
        <Link
          to={"/login"}
          className={"text-blue-600 font-semibold hover:underline ml-1"}
        >
          Login here
        </Link>
      </p>
    </form>
  );
}
