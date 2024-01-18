// Layout.js

import { Link, Outlet } from "react-router-dom";
import "./layout.css"; // Import your CSS file

export default function Layout() {
  return (
    <div className="layout-container">
      <ul className="nav-unlisted">
        <li className="nav-link">
          <Link to="/">Home</Link>
        </li>
        <li className="nav-link">
          <Link to="/registry">World Registry</Link>
        </li>
        <li className="nav-link">
          <Link to="/transmute">Transmutation</Link>
        </li>
      </ul>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
