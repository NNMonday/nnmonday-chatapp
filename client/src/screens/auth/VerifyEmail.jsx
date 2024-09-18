import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

export default function VerifyEmail() {
  const { verificationCode } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.post(`/api/auth/verify/${verificationCode}`);
        const message = res.data.message;
        toast.success(message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "colored",
        });
      } catch (error) {
        const message =
          error?.response?.data?.errors?.message || "Unknow Error";
        toast.error(message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "colored",
        });
      } finally {
        navigate("/");
      }
    })();
  }, [navigate, verificationCode]);
  return (
    <div role="status" className="text-center mt-2">
      <Spinner />
    </div>
  );
}
