import { Link } from "react-router-dom";

export default function NavItem({ label, href }) {
  return (
    <Link
      to={href}
      className="text-gray-700 font-medium hover:text-orange-500 transition-colors duration-300"
    >
      {label}
    </Link>
  );
}
