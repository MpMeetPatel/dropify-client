import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Plyr from "plyr-react";
import CommonModal from "../../../components/CommonModal";
import Router, { useRouter } from "next/router";
import Loader from "../../../components/Loader";

export default function Dropin() {
  const [cookies, _] = useCookies();
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseFlag, setPurchaseFlag] = useState(false);
  const [order, setOrder] = useState(null);
  const [dropin, setDropIn] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  async function handleOrderRequest() {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/order/insert`, {
        method: "POST",
        headers: {
          Authorization: cookies.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dropIn: dropin._id }),
      });
      Router.push("/my-order");
    } catch (error) {
      Router.back();
    }
  }

  async function getDropIn() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/dropin/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: cookies.token,
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = await res.json();
      setDropIn(data);
      if (data.dropCost === "free" || cookies.userId === data.creator) {
        setPurchaseFlag(false);
      }

      const resOrder = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/order/dropin/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: cookies.token,
            "Content-Type": "application/json",
          },
        }
      );

      const { data: orderData } = await resOrder.json();
      setOrder(orderData);

      if (data.dropCost === "paid" && !orderData.status) {
        setPurchaseFlag(true);
      } else {
        setDropIn(orderData.dropIn);
        setPurchaseFlag(false);
      }
      if (cookies.userId === data.creator) {
        setPurchaseFlag(false);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      getDropIn();
    }
  }, [id]);

  return (
    <CommonModal>
      {isLoading || !dropin ? (
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
                  type: dropin && dropin.audioPreview ? "audio" : "video",
                  sources: [
                    {
                      src: dropin.audio
                        ? dropin.audio
                        : dropin.video
                        ? dropin.video
                        : dropin.audioPreview
                        ? dropin.audioPreview
                        : dropin.videoPreview,
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
                onClick={handleOrderRequest}
                disabled={cookies.userId === dropin.creator}
                className="disabled:opacity-50 bg-green-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
              >
                {"buy"}
              </button>
            )}
            {order && order.status !== "completed" ? (
              <button
                onClick={() => {
                  Router.push(`/order/${order._id}`);
                }}
                className="bg-green-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
              >
                {"Already bought, go to order"}
              </button>
            ) : order && order.status === "created" ? (
              <button
                onClick={() => {
                  Router.push(`/order/${order._id}`);
                }}
                className="bg-green-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
              >
                {"Order already exists, finish payment"}
              </button>
            ) : null}
          </div>
        </>
      )}
    </CommonModal>
  );
}
