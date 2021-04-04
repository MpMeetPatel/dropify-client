import React from "react";
export default function ExploreCard({
  data: {
    name,
    description,
    dropPrice,
    status,
    createdAt,
    audioPreview,
    videoPreview,
    thumbnail,
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
        <img src={thumb} alt="My profile" className="w-40 h-auto" />

        <div className="flex-grow px-5 py-1 mt-3 ml-5">
          <div className="text-indigo-600 text-md">{name}</div>
          <div className="text-gray-500 text-sm">{description}</div>
          <div className="text-gray-500 text-md">
            {status === "created" && (
              <div className="text-red-500 text-md">
                Finish your order of ₹ {dropPrice}
              </div>
            )}
            {status === "completed" && (
              <div className="text-green-500 text-md">
                Purchased order, enjoy
              </div>
            )}
          </div>
          <div className="text-indigo-500 text-sm float-right sm:mt-5 md:mt-10">
            <span className="text-gray-700">Created: </span>
            {new Date(createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </>
  );
}
