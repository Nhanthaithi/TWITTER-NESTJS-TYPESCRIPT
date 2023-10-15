import { PayPalButtons } from "@paypal/react-paypal-js";

import { useUser } from "../../../Context/UserContext";
import { updateUserVerify } from "../../../Utils/commonFunction";

type Props = {
  verify: number;
  amount: number;
  setIsverify: (data: boolean) => void;
};

const PaypalComponent = (props: Props) => {
  const { verify, amount, setIsverify } = props;
  const { setUser } = useUser();

  const handlePaymentSuccess = async () => {
    const data = await updateUserVerify({ verify: verify, price: amount });
    const user = data.user;
    setUser(user);
    setIsverify(true);
  };
  return (
    <PayPalButtons
      style={{
        layout: "horizontal",
        height: 48,
      }}
      createOrder={(_data, actions) => {
        {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: String(amount), // Sử dụng giá trị totalAmount ở đây
                },
                description: `Purchase at ${new Date().toLocaleString()}`,
              },
            ],
          });
        }
      }}
      onApprove={(_, actions): any => {
        return actions.order?.capture().then(() => handlePaymentSuccess());
      }}
    />
  );
};

export default PaypalComponent;
