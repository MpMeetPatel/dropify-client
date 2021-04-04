import { ErrorMessage } from "@hookform/error-message";
import Image from "next/image";
import Router from "next/router";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import ActiveLink from "../components/ActiveLink";
import { parseJWT } from "../helpers/parseJWT";
import Swal from "sweetalert2";

export default function SignIn() {
  const { register, errors, handleSubmit } = useForm();
  const [cookies, setCookie] = useCookies();
  useEffect(function () {
    if (cookies.token) {
      Router.push("/dashboard");
    }
  }, []);

  async function submitData(data) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email, password: data.password }),
        }
      );
      const resData = await res.json();
      setCookie("token", resData.token);
      setCookie("userId", parseJWT(resData.token).id);
      if (resData.token) {
        Router.push("/my-dropins");
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
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(submitData)}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                ref={register({
                  required: {
                    value: true,
                    message: "Please provide email",
                  },
                  minLength: {
                    value: 4,
                    message: "Enter email having atleast 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Enter email upto atleast 50 characters",
                  },
                })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              <div className="text-red-500 text-xs">
                <ErrorMessage errors={errors} name="email" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <div className="text-red-500 text-xs">
                <ErrorMessage errors={errors} name="password" />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Sign in
            </button>

            <div className="flex justify-between items-center mt-2">
              <div className="text-sm">
                <ActiveLink href="/signup">
                  <a className="font-medium text-indigo-600 hover:text-indigo-500">
                    Create account
                  </a>
                </ActiveLink>
              </div>

              <div className="text-sm">
                <ActiveLink href="/forgot-password">
                  <a className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </a>
                </ActiveLink>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
