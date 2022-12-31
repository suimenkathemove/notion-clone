import "destyle.css";

import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";

import { client } from "../graphql";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default App;
