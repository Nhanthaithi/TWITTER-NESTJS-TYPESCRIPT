// Header.tsx

import { Link } from "react-router-dom";

const Header = () => (
  <div className="header">
    <Link to={"/home"} className="text-xs font-bold text-blue-500">
      Back to home
    </Link>
    <div className="title">Message</div>
  </div>
);

export default Header;
