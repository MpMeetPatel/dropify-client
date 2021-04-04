import { ErrorMessage } from "@hookform/error-message";
import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import Plyr from "plyr-react";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import CommonModal from "../../components/CommonModal";
import {
  DropzoneAudio,
  DropzoneImage,
  DropzoneVideo,
} from "../../components/Dropzone";
import Loader from "../../components/Loader";
import { ReactMediaRecorder } from "react-media-recorder";
import Swal from "sweetalert2";

function DropInAdd() {
  const {
    register,
    errors,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm();
  const [recordModal, setToggleRecordModal] = useState(false);
  const [toggleDropType, setToggleDropType] = useState(false);
  const [filePreviews, setFilePreviews] = useState({});
  const [togglePaidType, setTogglePaidType] = useState(false);
  const [cookies, _] = useCookies();

  useEffect(() => {
    if (!cookies.token) {
      Router.push("/signin");
    }
  }, []);

  async function uploadAssetsToCloudinary(files, urls = {}) {
    for (const file of files) {
      const formData = new FormData();
      const { signature, timestamp } = await getSignature();
      if (file.filename && file.filename.includes("[thumbnail]")) {
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
        urls = { ...urls, thumbnail: data.secure_url };
      } else if (file.filename && file.filename.includes("[videoPreview]")) {
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
        urls = { ...urls, videoPreview: data.secure_url };
      } else if (file.filename && file.filename.includes("[video]")) {
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
        urls = { ...urls, video: data.secure_url };
      } else if (file.filename && file.filename.includes("[audioPreview]")) {
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
        urls = { ...urls, audioPreview: data.secure_url };
      } else if (file.filename && file.filename.includes("[audio]")) {
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
        urls = { ...urls, audio: data.secure_url };
      }
    }

    return urls;
  }

  async function submitData(data) {
    const files = [];
    for (const filePreview in filePreviews) {
      files.push({
        file: filePreviews[filePreview].file,
        filename: `[${filePreview}][${uuidv4()}]${
          filePreviews[filePreview].file.name
        }`,
      });
    }
    const urls = await uploadAssetsToCloudinary(files);
    const payload = { ...urls, ...data };
    if (togglePaidType) {
      payload.dropPrice = Number(payload.dropPrice);
      payload.dropCost = "paid";
    } else {
      payload.dropCost = "free";
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/dropin/insert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: cookies.token,
          },
          body: JSON.stringify(payload),
        }
      );
      const resData = await res.json();
      if (resData) {
        Router.push("/my-dropins");
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  function renderRecorder() {
    if (window.navigator) {
      if (toggleDropType) {
        return (
          <CommonModal>
            <ReactMediaRecorder
              video
              render={({
                previewStream,
                status,
                startRecording,
                stopRecording,
                mediaBlobUrl,
              }) => {
                const mediaRef = useRef(null);

                useEffect(() => {
                  if (mediaRef.current && previewStream) {
                    mediaRef.current.srcObject = previewStream;
                  }
                }, [previewStream]);

                if (!previewStream) {
                  return null;
                }
                return (
                  <>
                    <div className="flex justify-between items-center pb-3">
                      <p>{status}</p>
                      <br />
                      <button type="button" onClick={startRecording}>
                        Start Recording
                      </button>
                      <br />
                      <button type="button" onClick={stopRecording}>
                        Stop Recording
                      </button>
                      <div className="modal-close cursor-pointer z-50">
                        <svg
                          className="fill-current text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          onClick={async () => {
                            let file = await fetch(previewStream)
                              .then((r) => r.blob())
                              .then(
                                (blobFile) =>
                                  new File([blobFile], "video", {
                                    type: "video/mp4",
                                  })
                              );
                            setToggleRecordModal(false);
                            setFilePreviews((prevState) => ({
                              ...prevState,
                              video: {
                                url: mediaBlobUrl,
                                type: "video/mp3",
                                file,
                                isOpen: false,
                              },
                            }));
                          }}
                        >
                          <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="">
                      {status === "stopped" && (
                        <div className="player-wrapper">
                          <Plyr
                            source={{
                              type: "video",
                              sources: [
                                {
                                  src: mediaBlobUrl,
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
                      )}

                      {status !== "stopped" && (
                        // Live Preview
                        <video
                          ref={mediaRef}
                          width={400}
                          height={400}
                          autoPlay
                          controls
                          className="m-auto"
                        />
                      )}
                    </div>
                  </>
                );
              }}
            />
          </CommonModal>
        );
      } else {
        return (
          <CommonModal>
            <ReactMediaRecorder
              audio
              render={({
                previewStream,
                status,
                startRecording,
                stopRecording,
                mediaBlobUrl,
              }) => {
                const mediaRef = useRef(null);

                useEffect(() => {
                  if (mediaRef.current && previewStream) {
                    mediaRef.current.srcObject = previewStream;
                  }
                }, [previewStream]);

                if (!previewStream) {
                  return null;
                }
                return (
                  <>
                    <div className="flex justify-between items-center pb-3">
                      <p>{status}</p>
                      <br />
                      <button type="button" onClick={startRecording}>
                        Start Recording
                      </button>
                      <br />
                      <button type="button" onClick={stopRecording}>
                        Stop Recording
                      </button>
                      <div className="modal-close cursor-pointer z-50">
                        <svg
                          className="fill-current text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          onClick={async () => {
                            let file = await fetch(previewStream)
                              .then((r) => r.blob())
                              .then(
                                (blobFile) =>
                                  new File([blobFile], "audio", {
                                    type: "audio/wav",
                                  })
                              );
                            setToggleRecordModal(false);
                            setFilePreviews((prevState) => ({
                              ...prevState,
                              audio: {
                                url: mediaBlobUrl,
                                type: "audio/wav",
                                file,
                                isOpen: false,
                              },
                            }));
                          }}
                        >
                          <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="">
                      {status === "stopped" && (
                        <div className="player-wrapper">
                          <Plyr
                            source={{
                              type: "audio",
                              sources: [
                                {
                                  src: mediaBlobUrl,
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
                      )}

                      {status !== "stopped" && (
                        // Live Preview
                        <audio
                          ref={mediaRef}
                          autoPlay
                          controls
                          className="m-auto"
                        />
                      )}
                    </div>
                  </>
                );
              }}
            />
          </CommonModal>
        );
      }
    } else {
      Swal.fire(
        "Ooops ...",
        "Live Recording is not supported in your browser",
        "error"
      );
    }
  }

  return (
    <div>
      <Head>
        <title>Dropify - A Creator's Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
          <div className="min-w-3/10 relative m-auto">
            <div className="relative bg-white shadow rounded-2xl">
              <div className="px-10 py-5 mx-auto">
                <div className="flex items-center space-x-5">
                  <div className="text-center">
                    <Image
                      src="/dropify.png"
                      alt="dropify"
                      width={75}
                      height={75}
                    />
                  </div>
                  <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                    <h2 className="leading-relaxed">
                      {isSubmitting
                        ? "Creating a dropin ..."
                        : "Create a dropin"}
                    </h2>
                    <p className="text-sm text-gray-500 font-normal leading-relaxed">
                      Create a short and sweet audio or video content
                    </p>
                  </div>
                </div>

                {isSubmitting ? (
                  <Loader />
                ) : (
                  <form onSubmit={handleSubmit(submitData)}>
                    <div className="">
                      <div className="py-1 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
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
                                message:
                                  "Enter name having atleast 2 characters",
                              },
                              maxLength: {
                                value: 20,
                                message:
                                  "Enter name upto atleast 20 characters",
                              },
                            })}
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                            placeholder="Dropin Name"
                          />
                          <div className="text-red-500 text-xs">
                            <ErrorMessage errors={errors} name="name" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm leading-loose">
                            Description
                          </label>
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
                            placeholder="Dropin Description"
                          />
                          <div className="text-red-500 text-xs">
                            <ErrorMessage errors={errors} name="description" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-sm leading-loose">
                            Paid / Free
                          </div>
                          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                            <span>
                              <input
                                type="checkbox"
                                name="toggle"
                                id="togglePaidType"
                                checked={togglePaidType}
                                onChange={(e) =>
                                  setTogglePaidType(e.target.checked)
                                }
                                className={`${
                                  togglePaidType ? "right-0" : ""
                                } focus:outline-none toggle-checkbox absolute block w-7 h-7 rounded-full bg-white border-2 appearance-none cursor-pointer`}
                              />
                              <label
                                htmlFor="togglePaidType"
                                className={`${
                                  togglePaidType ? "bg-indigo-500" : ""
                                } toggle-label block overflow-hidden h-7 rounded-full bg-gray-300 cursor-pointer`}
                              ></label>
                            </span>
                          </div>
                        </div>

                        {togglePaidType && (
                          <div className="flex flex-col">
                            <label className="text-sm leading-loose">
                              Price
                            </label>
                            <input
                              type="number"
                              name="dropPrice"
                              min={0}
                              max={10000}
                              ref={register({
                                required: {
                                  value: true,
                                  message: "Please provide dropPrice",
                                },
                                minLength: {
                                  value: 1,
                                  message:
                                    "Enter dropPrice having atleast 1 characters",
                                },
                                maxLength: {
                                  value: 5,
                                  message:
                                    "Enter dropPrice upto atleast 5 characters",
                                },
                              })}
                              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              placeholder="Dropin Cost (Rupees)"
                            />
                            <div className="text-red-500 text-xs">
                              <ErrorMessage errors={errors} name="dropPrice" />
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col">
                          <div className="text-sm leading-loose">
                            Audio / Video
                          </div>
                          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                            <span>
                              <input
                                type="checkbox"
                                name="toggle"
                                id="toggleDropType"
                                checked={toggleDropType}
                                onChange={(e) =>
                                  setToggleDropType(e.target.checked)
                                }
                                className={`${
                                  toggleDropType ? "right-0" : ""
                                } focus:outline-none toggle-checkbox absolute block w-7 h-7 rounded-full bg-white border-2 appearance-none cursor-pointer`}
                              />
                              <label
                                htmlFor="toggleDropType"
                                className={`${
                                  toggleDropType ? "bg-indigo-500" : ""
                                } toggle-label block overflow-hidden h-7 rounded-full bg-gray-300 cursor-pointer`}
                              ></label>
                            </span>
                          </div>
                        </div>
                        {!filePreviews["thumbnail"] && (
                          <div className="flex flex-col cursor-pointer">
                            <label className="text-sm leading-loose">
                              Thumbnail
                            </label>
                            <Controller
                              name="thumbnail"
                              control={control}
                              render={({ onChange }) => (
                                <DropzoneImage
                                  name="thumbnail"
                                  onChange={(e) => {
                                    if (e.target.files[0].size > 1048576 * 1) {
                                      Swal.fire(
                                        "Oops...",
                                        "Please select image with max size of 1 MB",
                                        "error"
                                      );
                                    } else {
                                      setFilePreviews((prevState) => ({
                                        ...prevState,
                                        [e.target.name]: {
                                          url: URL.createObjectURL(
                                            e.target.files[0]
                                          ),
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
                        {/*  */}
                        {filePreviews["thumbnail"] &&
                          filePreviews["thumbnail"].isOpen && (
                            <CommonModal>
                              <div className="flex justify-between items-center pb-3">
                                <p className="text-2xl font-bold">
                                  Your Thumbnail
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
                                        prevState.thumbnail.isOpen = !prevState
                                          .thumbnail.isOpen;
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
                                  src={filePreviews["thumbnail"].url}
                                  height={400}
                                  width={400}
                                />
                              </div>
                            </CommonModal>
                          )}
                        {filePreviews["thumbnail"] && (
                          <div className="flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => {
                                setFilePreviews((prevState) => {
                                  prevState.thumbnail.isOpen = !prevState
                                    .thumbnail.isOpen;
                                  return {
                                    ...prevState,
                                  };
                                });
                              }}
                              className="bg-white w-3/6 text-black shadow-md rounded border-indigo-200 text-sm px-2 py-3 border focus:outline-none"
                            >
                              Thumbnail
                            </button>

                            <button
                              onClick={() =>
                                setFilePreviews((prevState) => {
                                  delete prevState.thumbnail;
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
                        {/* ------------------------------------------------------------- */}
                        <button
                          onClick={async () => {
                            setToggleRecordModal((prevState) => !prevState);
                          }}
                          type="button"
                          className="bg-white w-2/6 text-black shadow-md rounded border-indigo-200 text-sm px-2 py-3 border focus:outline-none"
                        >
                          Open Recorder
                        </button>
                        {/* ------------------------------------------------------------- */}

                        {toggleDropType ? (
                          <>
                            {!filePreviews["videoPreview"] && (
                              <div className="flex flex-col cursor-pointer">
                                <label className="text-sm leading-loose">
                                  Video Preview
                                </label>
                                <Controller
                                  name="videoPreview"
                                  control={control}
                                  render={({ onChange }) => (
                                    <DropzoneVideo
                                      name="videoPreview"
                                      onChange={(e) => {
                                        if (
                                          e.target.files[0].size >
                                          1048576 * 50
                                        ) {
                                          Swal.fire(
                                            "Oops...",
                                            "Please select image with max size of 50 MB",
                                            "error"
                                          );
                                        } else {
                                          setFilePreviews((prevState) => ({
                                            ...prevState,
                                            [e.target.name]: {
                                              url: URL.createObjectURL(
                                                e.target.files[0]
                                              ),
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
                            {/*  */}
                            {filePreviews["videoPreview"] && (
                              <div className="flex justify-between items-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFilePreviews((prevState) => {
                                      prevState.videoPreview.isOpen = !prevState
                                        .videoPreview.isOpen;
                                      return {
                                        ...prevState,
                                      };
                                    });
                                  }}
                                  className="bg-white w-3/6 text-black shadow-md rounded border-indigo-200 text-sm px-2 py-3 border focus:outline-none"
                                >
                                  Video Preview
                                </button>

                                <button
                                  onClick={() =>
                                    setFilePreviews((prevState) => {
                                      delete prevState.videoPreview;
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
                            {/*  */}
                            {filePreviews["videoPreview"] &&
                              filePreviews["videoPreview"].isOpen && (
                                <CommonModal>
                                  <div className="flex justify-between items-center pb-3">
                                    <p className="text-2xl font-bold">
                                      Your Video Preview
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
                                            prevState.videoPreview.isOpen = !prevState
                                              .videoPreview.isOpen;
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
                                  <div className="player-wrapper">
                                    <Plyr
                                      source={{
                                        type: "video",
                                        sources: [
                                          {
                                            src:
                                              filePreviews["videoPreview"].url,
                                            type:
                                              filePreviews["videoPreview"].type,
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
                                </CommonModal>
                              )}

                            {!filePreviews["video"] && (
                              <div className="flex flex-col cursor-pointer">
                                <label className="text-sm leading-loose">
                                  Video
                                </label>
                                <Controller
                                  name="video"
                                  control={control}
                                  render={({ onChange }) => (
                                    <DropzoneVideo
                                      name="video"
                                      onChange={(e) => {
                                        if (
                                          e.target.files[0].size >
                                          1048576 * 50
                                        ) {
                                          Swal.fire(
                                            "Oops...",
                                            "Please select image with max size of 50 MB",
                                            "error"
                                          );
                                        } else {
                                          setFilePreviews((prevState) => ({
                                            ...prevState,
                                            [e.target.name]: {
                                              url: URL.createObjectURL(
                                                e.target.files[0]
                                              ),
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
                            {/*  */}
                            {filePreviews["video"] && (
                              <div className="flex justify-between items-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFilePreviews((prevState) => {
                                      prevState.video.isOpen = !prevState.video
                                        .isOpen;
                                      return {
                                        ...prevState,
                                      };
                                    });
                                  }}
                                  className="bg-white w-3/6 text-black shadow-md rounded border-indigo-200 text-sm px-2 py-3 border focus:outline-none"
                                >
                                  Video
                                </button>

                                <button
                                  onClick={() =>
                                    setFilePreviews((prevState) => {
                                      delete prevState.video;
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
                            {/*  */}
                            {filePreviews["video"] &&
                              filePreviews["video"].isOpen && (
                                <CommonModal>
                                  <div className="flex justify-between items-center pb-3">
                                    <p className="text-2xl font-bold">
                                      Your Video
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
                                            prevState.video.isOpen = !prevState
                                              .video.isOpen;
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
                                  <div className="player-wrapper">
                                    <Plyr
                                      source={{
                                        type: "video",
                                        sources: [
                                          {
                                            src: filePreviews["video"].url,
                                            type: filePreviews["video"].type,
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
                                </CommonModal>
                              )}
                          </>
                        ) : (
                          <>
                            {!filePreviews["audioPreview"] && (
                              <div className="flex flex-col cursor-pointer">
                                <label className="text-sm leading-loose">
                                  Audio Preview
                                </label>
                                <Controller
                                  name="audioPreview"
                                  control={control}
                                  render={({ onChange }) => (
                                    <DropzoneAudio
                                      name="audioPreview"
                                      onChange={(e) => {
                                        if (
                                          e.target.files[0].size >
                                          1048576 * 10
                                        ) {
                                          Swal.fire(
                                            "Oops...",
                                            "Please select image with max size of 10 MB",
                                            "error"
                                          );
                                        } else {
                                          setFilePreviews((prevState) => ({
                                            ...prevState,
                                            [e.target.name]: {
                                              url: URL.createObjectURL(
                                                e.target.files[0]
                                              ),
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
                            {/*  */}
                            {filePreviews["audioPreview"] && (
                              <div className="flex justify-between items-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFilePreviews((prevState) => {
                                      prevState.audioPreview.isOpen = !prevState
                                        .audioPreview.isOpen;
                                      return {
                                        ...prevState,
                                      };
                                    });
                                  }}
                                  className="bg-white w-3/6 text-black shadow-md rounded border-indigo-200 text-sm px-2 py-3 border focus:outline-none"
                                >
                                  Audio Preview
                                </button>

                                <button
                                  onClick={() =>
                                    setFilePreviews((prevState) => {
                                      delete prevState.audioPreview;
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
                            {/*  */}
                            {filePreviews["audioPreview"] &&
                              filePreviews["audioPreview"].isOpen && (
                                <CommonModal>
                                  <div className="flex justify-between items-center pb-3">
                                    <p className="text-2xl font-bold">
                                      Your Audio Preview
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
                                            prevState.audioPreview.isOpen = !prevState
                                              .audioPreview.isOpen;
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
                                  <div className="player-wrapper">
                                    <Plyr
                                      source={{
                                        type: "audio",
                                        sources: [
                                          {
                                            src:
                                              filePreviews["audioPreview"].url,
                                            type:
                                              filePreviews["audioPreview"].type,
                                            isOpen: false,
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
                                </CommonModal>
                              )}

                            {!filePreviews["audio"] && (
                              <div className="flex flex-col cursor-pointer">
                                <label className="text-sm leading-loose">
                                  Audio
                                </label>
                                <Controller
                                  name="audio"
                                  control={control}
                                  render={({ onChange }) => (
                                    <DropzoneAudio
                                      name="audio"
                                      onChange={(e) => {
                                        if (
                                          e.target.files[0].size >
                                          1048576 * 10
                                        ) {
                                          Swal.fire(
                                            "Oops...",
                                            "Please select image with max size of 10 MB",
                                            "error"
                                          );
                                        } else {
                                          setFilePreviews((prevState) => ({
                                            ...prevState,
                                            [e.target.name]: {
                                              url: URL.createObjectURL(
                                                e.target.files[0]
                                              ),
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
                            {/*  */}
                            {filePreviews["audio"] && (
                              <div className="flex justify-between items-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFilePreviews((prevState) => {
                                      prevState.audio.isOpen = !prevState.audio
                                        .isOpen;
                                      return {
                                        ...prevState,
                                      };
                                    });
                                  }}
                                  className="bg-white w-3/6 text-black shadow-md rounded border-indigo-200 text-sm px-2 py-3 border focus:outline-none"
                                >
                                  Audio
                                </button>

                                <button
                                  onClick={() =>
                                    setFilePreviews((prevState) => {
                                      delete prevState.audio;
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
                            {/*  */}
                            {filePreviews["audio"] &&
                              filePreviews["audio"].isOpen && (
                                <CommonModal>
                                  <div className="flex justify-between items-center pb-3">
                                    <p className="text-2xl font-bold">
                                      Your Audio
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
                                            prevState.audio.isOpen = !prevState
                                              .audio.isOpen;
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
                                  <div className="player-wrapper">
                                    <Plyr
                                      source={{
                                        type: "audio",
                                        sources: [
                                          {
                                            src: filePreviews["audio"].url,
                                            type: filePreviews["audio"].type,
                                            isOpen: false,
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
                                </CommonModal>
                              )}
                          </>
                        )}
                      </div>
                      {/* ----------------------------------------------- */}
                      {recordModal ? renderRecorder() : null}
                      {/* ----------------------------------------------- */}
                      <div className="pt-4 flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() => Router.back()}
                          className="flex justify-center items-center w-full text-gray-900 px-4 py-3 rounded-md focus:outline-none"
                        >
                          <svg
                            className="w-6 h-6 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>{" "}
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-indigo-600 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

async function getSignature() {
  const res = await fetch("/api/sign");
  const { signature, timestamp } = await res.json();
  return { signature, timestamp };
}

export default DropInAdd;
