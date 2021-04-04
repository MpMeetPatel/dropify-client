import { useDropzone } from "react-dropzone";

function DropzoneVideo(props) {
  const { onChange, name } = props;

  const { getRootProps, getInputProps } = useDropzone({
    accept: "video/*",
  });
  return (
    <div
      {...getRootProps()}
      className="mt-1 flex justify-center px-6 pt-5 pb-5 border-2 border-gray-300  focus:outline-none border-dashed rounded-md"
    >
      <input
        {...getInputProps({ onChange })}
        name={name}
        className="px-4 py-2 border w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
      />
      <p className="mr-auto text-sm text-left md:pl-10 pl-5">
        Drag 'n' drop some files here, or click to select files
        <br />
        <span className="text-indigo-500">
          Max size <span className="font-medium">50 MB</span>
        </span>
      </p>
    </div>
  );
}

function DropzoneAudio(props) {
  const { onChange, name } = props;

  const { getRootProps, getInputProps } = useDropzone({
    accept: "audio/*",
  });
  return (
    <div
      {...getRootProps()}
      className="mt-1 flex justify-center px-6 pt-5 pb-5 border-2 border-gray-300  focus:outline-none border-dashed rounded-md"
    >
      <input
        {...getInputProps({ onChange })}
        name={name}
        className="px-4 py-2 border w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
      />
      <p className="mr-auto text-sm text-left md:pl-10 pl-5">
        Drag 'n' drop some files here, or click to select files
        <br />
        <span className="text-indigo-500">
          Max size <span className="font-medium">50 MB</span>
        </span>
      </p>
    </div>
  );
}

function DropzoneImage(props) {
  const { onChange, name } = props;

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
  });
  return (
    <div
      {...getRootProps()}
      className="mt-1 flex justify-center px-6 pt-5 pb-5 border-2 border-gray-300  focus:outline-none border-dashed rounded-md"
    >
      <input
        {...getInputProps({ onChange })}
        name={name}
        className="px-4 py-2 border w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
      />
      <p className="mr-auto text-sm text-left md:pl-10 pl-5">
        Drag 'n' drop some files here, or click to select files
        <br />
        <span className="text-indigo-500">
          Max size <span className="font-medium">1 MB</span>
        </span>
      </p>
    </div>
  );
}

export { DropzoneVideo, DropzoneAudio, DropzoneImage };
