import Head from "next/head";
import ActiveLink from "../components/ActiveLink";
import { useCookies } from "react-cookie";

export default function Home() {
  const [cookies, setCookie] = useCookies();

  return (
    <div>
      <Head>
        <title>Dropify - A Creator's Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gradient-to-r from-gray-700 via-gray-900 to-black md:h-screen">
        <nav id="header" className="w-full z-30 top-0 text-white py-1 lg:py-6">
          <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 px-2 py-2 lg:py-6">
            <div className="pl-4 flex items-center">
              <a
                className="text-white no-underline hover:no-underline font-bold text-2xl lg:text-3xl"
                href="#"
              >
                <svg
                  className="h-6 w-6 inline-block fill-current text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V0L8.11 5.87 3 12h4v8L17 8h-4z" />
                </svg>
                Dropify
              </a>
            </div>
          </div>
        </nav>

        <div className="m-auto">
          <div className="text-center my-12">
            <h1 className="my-4 text-2xl md:text-3xl lg:text-5xl font-black text-white leading-tight">
              An ultimate short content creator platform
            </h1>
            <p className="leading-normal text-white text-base md:text-xl lg:text-2xl mb-8">
              Create, share and earn with small audio/video content online !
            </p>
          </div>

          <div className="md:flex lg:flex xl:flex justify-around align-center rounded w-3/4 m-auto">
            <span className="p-6 mx-4 items-center text-gray-100 text-center w-2/12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="max-h-44"
              >
                <path
                  fillRule="evenodd"
                  d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="font-bold leading-tight">
                <span>Authentication</span>
                <br />
                <span>Authorization</span>
              </div>
            </span>
            <span className="p-6 mx-4 items-center text-gray-100 text-center w-2/12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="max-h-44"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="font-bold leading-tight">
                <span>Stripe Onboarding</span>
                <br />
                <span>Stripe Checkout</span>
              </div>
            </span>
            <span className="p-6 mx-4 items-center text-gray-100 text-center w-2/12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="max-h-44"
              >
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="font-bold leading-tight">
                <br />
                <span>Audio</span>
              </div>
            </span>
            <span className="p-6 mx-4 items-center text-gray-100 text-center w-2/12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="max-h-44"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              <div className="font-bold leading-tight">
                <br />
                <span>Video</span>
              </div>
            </span>
            <span className="p-6 mx-4 items-center text-gray-100 text-center w-2/12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="max-h-44"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="font-bold leading-tight">
                <br />
                <span>User Profile</span>
              </div>
            </span>
          </div>
        </div>
        <div className="mt-12 flex items-center justify-center">
          {!cookies.token ? (
            <>
              <ActiveLink href="/signup">
                <button className="mx-5 bg-gradient-to-r from-blue-500 to-blue-600 hover:underline text-white font-extrabold rounded py-4 px-8 shadow-lg w-48">
                  Sign Up
                </button>
              </ActiveLink>
              <ActiveLink href="/signin">
                <button className="mx-5 bg-gradient-to-r from-blue-500 to-blue-600 hover:underline text-white font-extrabold rounded py-4 px-8 shadow-lg w-48">
                  Sign In
                </button>
              </ActiveLink>
            </>
          ) : (
            <ActiveLink href="/my-dropins">
              <button className="mx-5 bg-gradient-to-r from-blue-500 to-blue-600 hover:underline text-white font-extrabold rounded py-4 px-8 shadow-lg w-60">
                Go to App
              </button>
            </ActiveLink>
          )}
        </div>
      </main>
    </div>
  );
}
