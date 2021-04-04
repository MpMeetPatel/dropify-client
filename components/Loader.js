import React from "react";
import LoaderSpinner from "react-loader-spinner";

export default function Loader() {
  return (
    <div className="divide-y divide-gray-200">
      <div className="py-8 h-full text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
        <div className="flex flex-col justify-center align-center">
          <LoaderSpinner
            type="Watch"
            color="rgb(79, 70, 229)"
            height={100}
            width={100}
            className="m-auto"
            // timeout={3000} //3 secs
          />
        </div>
      </div>
    </div>
  );
}
