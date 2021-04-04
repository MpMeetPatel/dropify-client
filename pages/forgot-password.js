import { ErrorMessage } from "@hookform/error-message";
import Image from "next/image";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import ActiveLink from "../components/ActiveLink";
import Swal from "sweetalert2";

export default function ForgotPassword() {
  const { register, errors, handleSubmit } = useForm();
  const [cookies, _] = useCookies();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(function () {
    if (cookies.token) {
      Router.push("/dashboard");
    }
  }, []);

  async function submitData(data) {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        }
      );
      await res.json();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
            forgot password ?
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
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              <div className="text-red-500 text-xs">
                <ErrorMessage errors={errors} name="email" />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="disabled:opacity-50 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {`${!isLoading ? "Send mail" : "Sending mail ..."}`}
            </button>

            <div className="flex justify-between items-center mt-2 float-right">
              <div className="text-sm">
                <ActiveLink href="/signin">
                  <a className="font-medium text-indigo-600 hover:text-indigo-500">
                    Back to signin?
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
