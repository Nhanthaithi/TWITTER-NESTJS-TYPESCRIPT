import React from "react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import VerifyAccount from "../Components/VerifyAccount/VerifyAccount";

const PUBLIC_KEY =
  "pk_test_51NfnAuA3cQQ5MzVnu0Go9inhCUmf94fM9oRjh4Xhpk1kAIVS53iCiMLH2dpAy51GkjjI5Kjvn8imnntDKj9BIfZ400YNSmoyDe";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const StripePayment = () => {
  return (
    <Elements stripe={stripeTestPromise}>
      <VerifyAccount />
    </Elements>
  );
};

export default StripePayment;
