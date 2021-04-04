import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Card from "../components/Card";
import ReactPaginate from "react-paginate";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

function MyDropifies() {
  let limit = 4;
  const [pageCount, setPageCount] = useState(0);
  const [dropIns, setDropIns] = useState([]);
  const [cookies, _] = useCookies();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!cookies.token) {
      Router.push("/signin");
    }
    setIsLoading(false);
    if (cookies.token) {
      fetchDropIns();
    }
  }, []);

  async function fetchDropIns() {
    let page = 1;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/dropin/?limit=${limit}&page=${page}`,
        {
          headers: { Authorization: cookies.token },
        }
      );
      const { data, count } = await res.json();
      setPageCount(Math.ceil(count / limit));
      setDropIns(data || []);
      setIsLoading(false);
    } catch (error) {
      Swal.fire("Oops...", error, "error");
      setIsLoading(false);
    }
  }

  async function handlePageChange(data) {
    setIsLoading(true);
    let page = data.selected + 1;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/dropin/?limit=${limit}&page=${page}`,
        {
          headers: { Authorization: cookies.token },
        }
      );
      const { data } = await res.json();
      setDropIns(data || []);
      setIsLoading(false);
    } catch (error) {
      Swal.fire("Oops...", error, "error");
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>Dropify - A Creator's Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gray-100 h-screen">
        <Navbar />
        {isLoading ? (
          <Loader />
        ) : (
          dropIns.map((d) => (
            <Card
              onClick={() => Router.push(`/dropin/${d._id}`)}
              data={d}
              key={d._id}
            />
          ))
        )}
        {Boolean(pageCount) && (
          <div className="pagination-wrapper shadow-sm modal-container bg-white rounded-full z-50 overflow-y-auto border w-full sm:w-2/4 md:w-3/4">
            <ReactPaginate
              previousLabel={"Prev"}
              nextLabel={"Next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              activeClassName={"active"}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default MyDropifies;
