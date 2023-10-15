import React from "react";

import { Images } from "../../Assets/images";

const NotFound: React.FC = () => {
  return (
    <div
      className="container  flex items-center
    justify-center p-5"
    >
      <img
        src={Images.Notfound}
        alt="not-found"
        style={{ width: "800px", height: "650px", objectFit: "cover" }}
      />
    </div>
  );
};

export default NotFound;
