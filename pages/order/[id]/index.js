import { loadStripe } from "@stripe/stripe-js";
import Router, { useRouter } from "next/router";
import Plyr from "plyr-react";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import CommonModal from "../../../components/CommonModal";
import Loader from "../../../components/Loader";
import Swal from "sweetalert2";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Order() {
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseFlag, setPurchaseFlag] = useState(null);
  const [orderedDropIn, setOrderedDropIn] = useState({});
  const [cookies, _] = useCookies();
  const router = useRouter();
  const { id } = router.query;

  async function getOrder() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/order/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: cookies.token,
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = await res.json();
      setOrderedDropIn(data);
      if (data.dropIn.dropCost === "paid" && data.status !== "completed") {
        setPurchaseFlag(true);
      }
      if (cookies.userId === data.dropIn.creator) {
        setPurchaseFlag(false);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  async function handleOrderCheckout() {
    try {
      setIsLoading(true);
      const stripe = await stripePromise;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/create-stripe-session`,
        {
          method: "POST",
          headers: {
            Authorization: cookies.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId: orderedDropIn._id }),
        }
      );
      const { data } = await res.json();
      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      setIsLoading(false);
    } catch (error) {
      // Swal.fire("Oops...", error, "error");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      getOrder();
    }
  }, [id]);

  return (
    <CommonModal>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold">
              {purchaseFlag ? "Preview" : "Enjoy"}
            </p>
            <div className="modal-close cursor-pointer z-50">
              <svg
                className="fill-current text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                onClick={() => Router.back()}
              >
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          <div className="">
            <div className="player-wrapper">
              <Plyr
                source={{
                  type: orderedDropIn.dropIn.audioPreview ? "audio" : "video",
                  sources: [
                    {
                      src: orderedDropIn.dropIn.audio
                        ? orderedDropIn.dropIn.audio
                        : orderedDropIn.dropIn.video
                        ? orderedDropIn.dropIn.video
                        : orderedDropIn.dropIn.audioPreview
                        ? orderedDropIn.dropIn.audioPreview
                        : orderedDropIn.dropIn.videoPreview,
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
          </div>
          <div className="flex justify-end pt-2">
            {purchaseFlag && (
              <button
                onClick={handleOrderCheckout}
                disabled={cookies.userId === orderedDropIn.dropIn.creator}
                className="disabled:opacity-50 bg-green-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
              >
                {isLoading
                  ? `Creating checkout ...`
                  : `Complete Your Order of ₹ ${orderedDropIn.dropIn.dropPrice}`}
              </button>
            )}
          </div>
        </>
      )}
    </CommonModal>
  );
}
