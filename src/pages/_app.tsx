import React, { FC } from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../theme";
import { RecoilRoot } from "recoil";

const MyApp: FC<AppProps> = (props) => {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>成績管理</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta name="description" content="セット用成績管理アプリ" />
        <meta property="og:site_name" content="成績管理" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mahjong-7374d.web.app" />
        <meta property="og:title" content="成績管理" />
        <meta property="og:description" content="セット用成績管理アプリ" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default MyApp;
