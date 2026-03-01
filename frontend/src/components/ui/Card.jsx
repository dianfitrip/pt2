export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-200
                  p-6 hover:shadow-lg transition-all duration-300
                  ${className}`}
    >
      {children}
    </div>
  );
}
