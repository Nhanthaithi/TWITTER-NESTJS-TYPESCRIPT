import "./App.css";

import { BrowserRouter } from "react-router-dom";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { FollowersProvider } from "./Context/FollowersContext";
import { FollowingProvider } from "./Context/FollowingContext";
import { TweetProvider } from "./Context/TweetContext";
import { UserProvider } from "./Context/UserContext";
import Router from "./Routes/Route";

function App() {
  const paypalClientId =
    "ARz5aXkRHY6vF-Pz4BdFRN4-VzN8FISqHX1nVzJtpvAXJnHn0EUlN1lP9ClyPDbJasDijhNve6b_9E0j";
  return (
    <>
      <UserProvider>
        <FollowingProvider>
          <FollowersProvider>
            <TweetProvider>
              <BrowserRouter>
                <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                  <Router />
                </PayPalScriptProvider>
              </BrowserRouter>
            </TweetProvider>
          </FollowersProvider>
        </FollowingProvider>
      </UserProvider>
    </>
  );
}

export default App;
