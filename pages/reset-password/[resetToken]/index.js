import { ErrorMessage } from "@hookform/error-message";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import ActiveLink from "../../../components/ActiveLink";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const { register, errors, handleSubmit, watch } = useForm();
  const [cookies, _] = useCookies(["token"]);
  const router = useRouter();
  const { resetToken } = router.query;

  const password = useRef({});
  password.current = watch("password", "");

  useEffect(() => {
    if (cookies.token) {
      Router.push("/signin");
    }
  }, []);

  async function submitData(data) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/reset-password/${resetToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({
            password: data.password,
          }),
        }
      );
      if (res) {
        Router.push("/signin");
      }
    } catch (error) {
      Swal.fire("Oops...", error, "error");
      console.log("error", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center">
            <Image
              src="/dropify.png"
              alt="dropify"
              width={100}
              height={100}
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password here
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(submitData)}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label
                htmlFor="password"
                className="text-indigo-800 text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                ref={register({
                  required: {
                    value: true,
                    message: "Please provide password",
                  },
                  minLength: {
                    value: 4,
                    message: "Enter password having atleast 2 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Enter password upto atleast 20 characters",
                  },
                })}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <div className="mb-2 text-red-500 text-xs">
                <ErrorMessage errors={errors} name="password" />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-indigo-800 text-sm font-medium"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                ref={register({
                  validate: (value) =>
                    value === password.current || "The passwords do not match",
                })}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
              <div className="text-red-500 text-xs">
                <ErrorMessage errors={errors} name="confirmPassword" />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset
            </button>
            <div className="text-sm mt-2 clearfix float-right">
              <ActiveLink href="/signin">
                <a className="font-medium text-indigo-600 hover:text-indigo-500 float-right">
                  {"Remember old password? Signin then :)"}
                </a>
              </ActiveLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
