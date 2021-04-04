import React, { useEffect, useState } from "react";

export default function CommonModal(props) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div
      className={`main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster bg-black`}
    >
      <div className="border border-teal-500 shadow-lg modal-container bg-white w-11/12 md:max-w-2xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="modal-content py-4 text-left px-6">
          {!isLoading ? props.children : null}
        </div>
      </div>
    </div>
  );
}
