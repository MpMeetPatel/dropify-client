import Router from "next/router";
import React from "react";

export default function Card({
  data: {
    name,
    description,
    createdAt,
    thumbnail,
    _id,
    audioPreview,
    videoPreview,
  },
  onClick,
}) {
  let thumb = null;
  if (audioPreview) {
    if (thumbnail) {
      thumb = thumbnail;
    } else {
      thumb =
        "https://res.cloudinary.com/dcebpawbc/image/upload/v1617125377/audio-thumb_j5kgq7.png";
    }
  } else if (videoPreview) {
    if (videoPreview && thumbnail) {
      thumb = thumbnail;
    } else {
      thumb =
        "https://res.cloudinary.com/dcebpawbc/image/upload/v1617125377/video-thumb_ipgpnk.png";
    }
  }
  
  return (
    <>
      <div
        onClick={onClick}
        className="cursor-pointer my-5 m-auto flex shadow-lg modal-container bg-white w-11/12 md:max-w-2xl rounded z-50 overflow-y-auto"
      >
        <img src={thumb} alt="My profile" className="w-36 h-auto" />
        <div className="flex-grow px-5 py-1 mt-3 ml-5">
          <div className="text-indigo-600 text-md">{name}</div>
          <div className="text-gray-500 text-sm">{description}</div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              Router.push(`/dropin/edit/${_id}`);
            }}
            className="z-50 cursor-pointer w-6 h-6 text-indigo-500 -translate-x-3/4 -translate-y-12 flex float-right h-6 justify-end text-indigo-500 transform w-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <div className="text-indigo-500 text-sm float-right mt-5 md:mt-10">
            <span className="text-gray-700">Created: </span>
            {new Date(createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </>
  );
}
