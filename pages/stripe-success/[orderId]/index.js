import Image from "next/image";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

export default function checkoutSessionSuccess() {
  const [cookies, _] = useCookies();
  // const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { orderId } = router.query;

  useEffect(() => {
    if (!cookies.token) {
      Router.push("/signin");
    }
    setIsLoading(false);
  }, []);

  useEffect(async () => {
    if (orderId) {
      setTimeout(async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/stripe-success/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: cookies.token,
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: JSON.stringify({
                orderId,
              }),
            }
          );
          const data = await res.json();
          setIsLoading(false);
          if (data.success) {
            Router.push("/my-order");
          }
        } catch (error) {
          Swal.fire("Oops...", error, "error");
          setIsLoading(false);
        }
      }, 2000);
    }
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center">
            <Image src="/dropify.png" alt="dropify" width={100} height={100} />
          </div>
          <h2 className="mt-6 text-center text-green-600 text-3xl font-extrabold">
            Order Successful
          </h2>
          <h2 className="mt-6 text-center text-indigo-600 text-2xl font-extrabold">
            Redirecting to order ...
          </h2>
        </div>
      </div>
    </div>
  );
}
