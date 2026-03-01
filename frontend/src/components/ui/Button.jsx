export default function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) {
  const baseStyle =
    "px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300";

  const variants = {
    primary:
      "bg-orange-500 text-white hover:bg-orange-600",
    outline:
      "border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200",
    disabled:
      "bg-gray-300 text-gray-500 cursor-not-allowed",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${
        disabled ? variants.disabled : variants[variant]
      } ${className}`}
    >
      {children}
    </button>
  );
}
