import "../styles/globals.css";
import "plyr-react/dist/plyr.css";
import "sweetalert2/dist/sweetalert2.min.css";
import { CookiesProvider } from "react-cookie";

function MyApp({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <Component {...pageProps} />
    </CookiesProvider>
  );
}

export default MyApp;
