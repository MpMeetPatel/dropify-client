import Router from "next/router";
import { useCookies } from "react-cookie";
import React, { useEffect } from "react";

const withAuth = (Component) => {
  const Auth = (props) => {
    const [cookies, _] = useCookies();
    useEffect(function () {
      if (!cookies.token) {
        Router.push("/signin");
      }
    }, []);

    // If user is logged in, return original component
    return <Component {...props} />;
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export { withAuth };
