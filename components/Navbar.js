import React, { useState } from "react";
import Image from "next/image";
import Router from "next/router";
import { useCookies } from "react-cookie";
import ActiveLink from "./ActiveLink";

export default function Navbar() {
  const [toggle, setToggle] = useState(false);
  const [cookies, _, removeCookie] = useCookies();
  function handleSignOut() {
    removeCookie("token", { path: "/" });
    removeCookie("userId", { path: "/" });
    Router.push("/signin");
  }

  function toggleProfile() {
    setToggle((preVal) => !preVal);
  }
  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>

              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => Router.push("/")}
            >
              <Image
                alt="Dropify"
                className="block lg:hidden h-8 w-auto"
                src="/dropify.png"
                alt="dropify"
                width={40}
                height={40}
              />
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <ActiveLink
                  activeClassName="bg-indigo-600 text-white"
                  href="/my-dropins"
                >
                  <a className="hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    My Dropins
                  </a>
                </ActiveLink>
                <ActiveLink
                  activeClassName="bg-indigo-600 text-white"
                  href="/dropins"
                >
                  <a className="hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Explore Dropins
                  </a>
                </ActiveLink>
                <ActiveLink
                  activeClassName="bg-indigo-600 text-white"
                  href="/my-order"
                >
                  <a className="hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Orders
                  </a>
                </ActiveLink>
                <ActiveLink
                  activeClassName="bg-indigo-600 text-white"
                  href="/account"
                >
                  <a className="hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Account
                  </a>
                </ActiveLink>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              className="bg-indigo-600 p-1 rounded-full text-white hover:text-white focus:outline-none"
              onClick={() => Router.push("/dropin/add")}
            >
              {/* <span className="sr-only">View notifications</span> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                className="h-7 w-7 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

            <div className="ml-3 relative">
              <div onClick={toggleProfile}>
                <button
                  type="button"
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://res.cloudinary.com/dcebpawbc/image/upload/v1617129474/user-512_y1vag4.png"
                    alt=""
                  />
                </button>
              </div>

              {toggle && (
                <div
                  className="z-50 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-indigo-600 ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <ActiveLink href="/my-profile">
                    <a
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Your Profile
                    </a>
                  </ActiveLink>
                  <a
                    onClick={handleSignOut}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <ActiveLink
            activeClassName="bg-indigo-600 text-white"
            href="/my-dropins"
          >
            <a className="hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium d-block">
              My Dropins
            </a>
          </ActiveLink>
          <ActiveLink
            activeClassName="bg-indigo-600 text-white"
            href="/dropins"
          >
            <a className="hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium d-block">
              Explore Dropins
            </a>
          </ActiveLink>
          <ActiveLink
            activeClassName="bg-indigo-600 text-white"
            href="/my-order"
          >
            <a className="hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium d-block">
              Orders
            </a>
          </ActiveLink>
          <ActiveLink
            activeClassName="bg-indigo-600 text-white "
            href="/account"
          >
            <a className="hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium d-block">
              Account
            </a>
          </ActiveLink>
        </div>
      </div>
    </nav>
  );
}
