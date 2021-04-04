import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

function MyProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [cookies, _] = useCookies();

  async function fetchDropIns() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/`, {
        headers: { Authorization: cookies.token },
      });
      const { data } = await res.json();
      setData(data);
      setIsLoading(false);
    } catch (error) {
      Swal.fire("Oops...", error, "error");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDropIns();
  }, []);

  return (
    <div>
      <Head>
        <title>Dropify - A Creator's Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-100 h-screen">
        <Navbar />
        {isLoading && <Loader />}
        {isLoading || !data ? (
          <Loader />
        ) : (
          <div className="mt-5 relative p-5 bg-white mb-2 lg:w-1/2 md:w-2/3 sm:w-2/3 m-auto bg-card-texture bg-no-repeat bg-top rounded-2xl shadow-2xl">
            <div className="flex flex-col items-center justify-center mt-22">
              <img
                src={
                  data.profilePic
                    ? data.profilePic
                    : "https://res.cloudinary.com/dcebpawbc/image/upload/v1617129474/user-512_y1vag4.png"
                }
                alt="my-profile"
                width={75}
                height={75}
              />
              <h1 className="font-bold text-secondary mt-3">
                {data.firstName + " " + data.lastName}
              </h1>
              <h1 className="font-bold text-secondary">
                Email:
                <span className="text-text font-normal ml-2">{data.email}</span>
              </h1>
            </div>
            <div className="flex justify-evenly mt-6 py-6 border border-neutral border-r-0 border-b-0 border-l-0">
              <div className="text-center">
                <h3 className="font-bold text-lg text-green-500">
                  {data && data.stripeAccountId ? "Yes" : "No"}
                </h3>
                <p className="text-md text-text tracking-widest">
                  Seller Accout
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg text-green-500">
                  {data && data.role !== "admin" ? "User" : "Admin"}
                </h3>
                <p className="text-md text-text tracking-widest">Role</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MyProfile;
