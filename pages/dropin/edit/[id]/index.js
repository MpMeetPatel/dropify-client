import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Plyr from "plyr-react";
import CommonModal from "../../../../components/CommonModal";
import Router, { useRouter } from "next/router";
import Loader from "../../../../components/Loader";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Swal from "sweetalert2";

export default function EditDropin() {
  const [cookies, _] = useCookies();
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    errors,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();
  const [editFlag, setEditFlag] = useState(false);
  const [dropin, setDropIn] = useState();
  const router = useRouter();
  const { id } = router.query;

  async function getDropIn() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/dropin/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: cookies.token,
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = await res.json();
      setDropIn(data);

      if (cookies.userId === data.creator) {
        setEditFlag(true);
      }
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
    }
  }

  useEffect(async () => {
    if (id) {
      const data = await getDropIn();
      setValue("name", data.name);
      setValue("description", data.description);
    }
  }, [id]);

  async function submitData(data) {
    // EDIT
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/dropin/update/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: cookies.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
          }),
        }
      );
      if (res) {
        Router.push("/my-dropins");
      }
    } catch (error) {
      // Swal.fire("Oops...", error, "error");
    }
  }

  return (
    <CommonModal>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold">Edit</p>
            <div className="modal-close cursor-pointer z-50">
              <svg
                className="fill-current text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                onClick={() => Router.push("/my-dropins")}
              >
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          <form onSubmit={handleSubmit(submitData)}>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col justify-center align-center">
                  <label className="text-sm leading-loose">Name</label>
                  <input
                    type="text"
                    name="name"
                    ref={register({
                      required: {
                        value: true,
                        message: "Please provide name",
                      },
                      minLength: {
                        value: 2,
                        message: "Enter name having atleast 2 characters",
                      },
                      maxLength: {
                        value: 20,
                        message: "Enter name upto atleast 20 characters",
                      },
                    })}
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Dropify Name"
                  />
                  <div className="text-red-500 text-xs">
                    <ErrorMessage errors={errors} name="name" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm leading-loose">Description</label>
                  <textarea
                    name="description"
                    ref={register({
                      required: {
                        value: false,
                        message: "Please provide description",
                      },
                      minLength: {
                        value: 5,
                        message:
                          "Enter description having atleast 5 characters",
                      },
                      maxLength: {
                        value: 250,
                        message:
                          "Enter description upto atleast 250 characters",
                      },
                    })}
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Dropify Description"
                  />
                  <div className="text-red-500 text-xs">
                    <ErrorMessage errors={errors} name="description" />
                  </div>
                </div>
                <div className="player-wrapper">
                  <Plyr
                    source={{
                      type: dropin.audioPreview ? "audio" : "video",
                      sources: [
                        {
                          src: dropin.audioPreview
                            ? dropin.audioPreview
                            : dropin.videoPreview,
                        },
                      ],
                    }}
                    options={{
                      controls: [
                        "rewind",
                        "play",
                        "fast-forward",
                        "progress",
                        "current-time",
                        "duration",
                        "mute",
                        "volume",
                        "settings",
                        "fullscreen",
                      ],
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <button
                    type="submit"
                    disabled={editFlag || isSubmitting}
                    className="disabled:opacity-50 bg-indigo-600 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                  >
                    {isSubmitting ? "Editing ..." : "Edit"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </>
      )}
    </CommonModal>
  );
}
