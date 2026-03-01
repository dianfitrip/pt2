export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-xl shadow-xl
                      max-w-lg w-full mx-4 p-6">
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-orange-500
                       font-bold text-xl"
          >
            ×
          </button>
        </div>

        <div className="text-sm text-gray-700">
          {children}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg
                       bg-orange-500 text-white
                       hover:bg-orange-600 transition-all"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
