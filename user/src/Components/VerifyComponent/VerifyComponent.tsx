import "./VerifyComponent.css";

import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

import { useUser } from "../../Context/UserContext";
import { fetchCurrentUser } from "../../Utils/commonFunction";
import PaypalComponent from "./PaypalComponent /PaypalComponent";

const VerifyAccount = () => {
  const [amount, setAmount] = useState(20);
  const { user: userLogin, setUser } = useUser();
  const [verificationType, setVerificationType] = useState("monthly");
  const [verify, setVerify] = useState(1);
  const [isVerify, setIsVerify] = useState(userLogin?.verify ? true : false);

  useEffect(() => {
    if (verificationType === "monthly") {
      setAmount(20);
      setVerify(1);
    } else if (verificationType === "permanent") {
      setAmount(200);
      setVerify(2);
    }
  }, [verificationType]);

  const handleSelectChange = (event: any) => {
    setVerificationType(event.target.value);
  };
  useEffect(() => {
    fetchCurrentUser().then(setUser);
  }, []);
  useEffect(() => {
    if (userLogin?.verify) {
      setIsVerify(true);
    }
  }, [userLogin]);

  return (
    <div className="verify-account">
      <h2 className="text-2xl font-bold text-center">Verify your account</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label className="me-1">Your Name: </Form.Label>
          <Form.Control
            type="Text"
            placeholder="Verify your name"
            // value={amount}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="me-1">Your Email: </Form.Label>
          <Form.Control
            type="Text"
            placeholder="Verify your email address"
            // value={amount}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="me-1">Amount to pay: </Form.Label>
          <Form.Control
            type="number"
            value={amount}
            name="amount"
            readOnly // Prevent user from changing the amount manually
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="me-1">Type of verify: </Form.Label>
          <Form.Select
            onChange={handleSelectChange}
            value={verificationType}
            name="verificationType"
          >
            <option value="monthly">Monthly - 20$</option>
            <option value="permanent">Forever - 200$</option>
          </Form.Select>
        </Form.Group>
        {isVerify ? (
          <h3 className="bg-blue-500 text-white font-bold text-center p-2">
            You have already verified
          </h3>
        ) : (
          <PaypalComponent
            verify={verify}
            amount={amount}
            setIsverify={setIsVerify}
          />
        )}
      </Form>
    </div>
  );
};

export default VerifyAccount;
