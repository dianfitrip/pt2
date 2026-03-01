import { useState } from "react";

export default function LoginDropdown() {
  const [open, setOpen] = useState(false);

  const roles = [
    "Asesor",
    "Peserta (Asesi)",
    "Administrator",
    "Komite Teknis",
    "TUK",
  ];

  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="px-5 py-2 rounded-lg bg-orange-500 text-white
                   font-semibold hover:bg-orange-600
                   transition-all"
      >
        Login
      </button>

      {open && (
        <div
          className="absolute right-0 mt-3 w-56 bg-white
                     rounded-xl shadow-lg border border-gray-200
                     overflow-hidden z-50"
        >
          {roles.map((role, index) => (
            <a
              key={index}
              href="/login"
              className="block px-5 py-3 text-sm text-gray-700
                         hover:bg-orange-50 hover:text-orange-600
                         transition-colors"
            >
              Login sebagai {role}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
