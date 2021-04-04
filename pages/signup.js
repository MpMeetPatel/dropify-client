import { ErrorMessage } from "@hookform/error-message";
import Image from "next/image";
import Router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import ActiveLink from "../components/ActiveLink";
import CommonModal from "../components/CommonModal";
import { DropzoneImage } from "../components/Dropzone";
import Swal from "sweetalert2";
import Loader from "../components/Loader";

export default function SignUp() {
  const {
    register,
    errors,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [cookies, _] = useCookies(["token"]);
  const [filePreviews, setFilePreviews] = useState({});

  const password = useRef({});
  password.current = watch("password", "");

  useEffect(() => {
    if (cookies.token) {
      Router.push("/signin");
    }
  }, []);

  async function uploadProfilePicToCloudinary(files, urls = {}) {
    for (const file of files) {
      const formData = new FormData();
      const { signature, timestamp } = await getSignature();
      if (file.filename && file.filename.includes("[profilePic]")) {
        formData.append("file", file.file, file.filename);
        formData.append("signature", signature);
        formData.append("timestamp", timestamp);
        formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDNARY_API_KEY);

        const response = await fetch(
          process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_URL,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        urls = { ...urls, profilePic: data.secure_url };
      }
    }

    return urls;
  }

  async function submitData(data) {
    setIsLoading(true);
    const files = [];
    for (const filePreview in filePreviews) {
      files.push({
        file: filePreviews[filePreview].file,
        filename: `[${filePreview}][${uuidv4()}]${
          filePreviews[filePreview].file.name
        }`,
      });
    }
    const urls = await uploadProfilePicToCloudinary(files);
    const payload = { ...urls, ...data };

    payload.firstName = data.firstName;
    payload.lastName = data.lastName;
    payload.userName = data.userName;
    payload.email = data.email;
    payload.password = data.password;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(payload),
        }
      );
      setIsLoading(false);
      if (res) {
        Router.push("/signin");
      }
    } catch (error) {
      setIsLoading(false);
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
            Sign up here
          </h2>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(submitData)}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label
                  htmlFor="userName"
                  className="text-indigo-800 text-sm font-medium"
                >
                  User name
                </label>
                <input
                  id="userName"
                  name="userName"
                  ref={register({
                    required: {
                      value: true,
                      message: "Please provide userName",
                    },
                    minLength: {
                      value: 2,
                      message: "Enter userName having atleast 2 characters",
                    },
                    maxLength: {
                      value: 20,
                      message: "Enter userName upto atleast 20 characters",
                    },
                  })}
                  className="mb-3 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="User Name"
                />
                <div className="text-red-500 text-xs">
                  <ErrorMessage errors={errors} name="userName" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="firstname"
                  className="text-indigo-800 text-sm font-medium"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  ref={register({
                    required: {
                      value: true,
                      message: "Please provide firstname",
                    },
                    minLength: {
                      value: 2,
                      message: "Enter firstname having atleast 2 characters",
                    },
                    maxLength: {
                      value: 20,
                      message: "Enter firstname upto atleast 20 characters",
                    },
                  })}
                  className="mb-3 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="First Name"
                />
                <div className="text-red-500 text-xs">
                  <ErrorMessage errors={errors} name="firstName" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="lastname"
                  className="text-indigo-800 text-sm font-medium"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  ref={register({
                    required: {
                      value: true,
                      message: "Please provide lastname",
                    },
                    minLength: {
                      value: 2,
                      message: "Enter lastname having atleast 2 characters",
                    },
                    maxLength: {
                      value: 20,
                      message: "Enter lastname upto atleast 20 characters",
                    },
                  })}
                  className="mb-3 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Last Name"
                />
                <div className="text-red-500 text-xs">
                  <ErrorMessage errors={errors} name="lastName" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-indigo-800 text-sm font-medium"
                >
                  Email address
                </label>
                <input
                  id="email"
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
                  className="mb-3 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
                <div className="text-red-500 text-xs">
                  <ErrorMessage errors={errors} name="email" />
                </div>
              </div>
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
                  className="mb-3 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
                <div className="text-red-500 text-xs">
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
                      value === password.current ||
                      "The passwords do not match",
                  })}
                  className="mb-3 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                />
                <div className="text-red-500 text-xs">
                  <ErrorMessage errors={errors} name="confirmPassword" />
                </div>
              </div>
              <div>
                {!filePreviews["profilePic"] && (
                  <div className="flex flex-col cursor-pointer">
                    <label className="text-indigo-800 text-sm font-medium">
                      Profile Picture
                    </label>
                    <Controller
                      name="profilePic"
                      control={control}
                      render={({ onChange }) => (
                        <DropzoneImage
                          name="profilePic"
                          onChange={(e) => {
                            if(e.target.files[0].size > (1048576 * 1)) {
                              Swal.fire("Oops...", "Please select image with max size of 1 MB", "error");
                            } else {
                              setFilePreviews((prevState) => ({
                                ...prevState,
                                [e.target.name]: {
                                  url: URL.createObjectURL(e.target.files[0]),
                                  type: e.target.files[0].type,
                                  file: e.target.files[0],
                                  isOpen: false,
                                },
                              }));
                              onChange(e.target.files[0]);
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                )}
                {filePreviews["profilePic"] &&
                  filePreviews["profilePic"].isOpen && (
                    <CommonModal>
                      <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold">
                          Your Profile Picture
                        </p>
                        <div className="modal-close cursor-pointer z-50">
                          <svg
                            className="fill-current text-black"
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            onClick={() => {
                              setFilePreviews((prevState) => {
                                prevState.profilePic.isOpen = !prevState
                                  .profilePic.isOpen;
                                return {
                                  ...prevState,
                                };
                              });
                            }}
                          >
                            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="flex justify-center items-center">
                        <img
                          src={filePreviews["profilePic"].url}
                          height={400}
                          width={400}
                        />
                      </div>
                    </CommonModal>
                  )}
                {filePreviews["profilePic"] && (
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setFilePreviews((prevState) => {
                          prevState.profilePic.isOpen = !prevState.profilePic
                            .isOpen;
                          return {
                            ...prevState,
                          };
                        });
                      }}
                      className="bg-white w-3/6 text-black shadow-md rounded border-indigo-200 text-sm px-2 py-3 border focus:outline-none"
                    >
                      Profile Picture
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFilePreviews((prevState) => {
                          delete prevState.profilePic;
                          return {
                            ...prevState,
                          };
                        })
                      }
                      className="bg-white w-2/6 text-black shadow-md rounded border-indigo-200 text-sm px-2 py-3 border focus:outline-none"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="disabled:opacity-50 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                Sign up
              </button>
              <div className="text-sm mt-2 clearfix">
                <ActiveLink href="/signin">
                  <a className="font-medium text-indigo-600 hover:text-indigo-500 float-right">
                    Already have account? signin
                  </a>
                </ActiveLink>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

async function getSignature() {
  const res = await fetch("/api/sign");
  const { signature, timestamp } = await res.json();
  return { signature, timestamp };
}
