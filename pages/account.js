import Head from "next/head";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

export default function Account() {
  const [btnFlag, setBtnFlag] = useState(false);
  const [onBoradingUrl, setOnBoradingUrl] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [cookies, _] = useCookies();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!cookies.token) {
      Router.push("/signin");
    }
    setIsLoading(false);
    if (cookies.token) {
      getAccountStatus();
    }
  }, []);

  async function getAccountStatus() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/account-status`,
        {
          headers: {
            Authorization: cookies.token,
            "Content-Type": "application/json",
          },
          method: "GET",
        }
      );
      const { data } = await res.json();
      setAccountData(data);

      if (data.charges_enabled) {
        const resBalance = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/balance`,
          {
            headers: {
              Authorization: cookies.token,
              "Content-Type": "application/json",
            },
            method: "GET",
          }
        );
        const { data: balanceData } = await resBalance.json();
        setBalanceData(balanceData);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  async function handleCreateOnBoardingAccount() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/create-connected-account`,
        {
          headers: {
            Authorization: cookies.token,
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );
      const data = await res.text();
      setOnBoradingUrl(data);
      setIsLoading(false);
    } catch (error) {
      Swal.fire("Oops...", error, "error");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (
      (accountData && accountData.charges_enabled === false) ||
      !accountData
    ) {
      setBtnFlag(true);
    }
  }, [accountData]);

  return (
    <div>
      <Head>
        <title>Dropify - A Creator's Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gray-100 h-screen">
        <Navbar />
        <div className="w-11/12 md:max-w-2xl m-auto">
          {isLoading && <Loader />}
          {!isLoading && (
            <div className="cursor-pointer my-5 p-5 shadow-lg modal-container bg-white rounded z-50 overflow-y-auto">
              <div className="font-semibold text-gray-700">Account Details</div>
              <div className="flex items-center pt-1">
                <div
                  className={`text-sm ${
                    accountData && accountData.charges_enabled
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {accountData && accountData.charges_enabled
                    ? "Charges enabled"
                    : "Charges disabled"}
                </div>
              </div>
              <div className="flex items-center pt-1">
                <div
                  className={`text-sm ${
                    accountData && accountData.payouts_enabled
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {accountData && accountData.payouts_enabled
                    ? "Payout enabled"
                    : "Payout disabled"}
                </div>
              </div>
            </div>
          )}
          {!isLoading && (
            <div className="cursor-pointer my-5 p-5 shadow-lg modal-container bg-white rounded z-50 overflow-y-auto">
              <div className="font-semibold text-gray-700">Account Balance</div>
              <div className="flex items-center pt-1">
                <div className="text-md text-green-500 ">
                  {balanceData
                    ? `₹ ${balanceData.pending[0].amount / 100}`
                    : "NILL"}
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            {btnFlag && !isLoading && (
              <button
                onClick={handleCreateOnBoardingAccount}
                type="button"
                disabled={!!onBoradingUrl}
                className="disabled:opacity-50 relative sm:w-1/2 w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none cursor-pointer"
              >
                Create Onboarding Account
              </button>
            )}
            {onBoradingUrl && !isLoading && (
              <a
                target="_blank"
                href={onBoradingUrl}
                className="relative sm:w-1/4 w-full py-2 px-4 border text-center border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none cursor-pointer"
              >
                Finish process
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
