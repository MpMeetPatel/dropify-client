import Head from "next/head";
import Navbar from "../../components/Navbar";
import { withAuth } from "../../components/withAuth";

function Dashboard() {
  return (
    <div>
      <Head>
        <title>Dropify - A Creator's Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gray-100 h-screen">
        <Navbar />
      </main>
    </div>
  );
}

export default withAuth(Dashboard);
