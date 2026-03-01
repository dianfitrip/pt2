import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Persyaratan from "./Persyaratan";
import Jadwal from "./Jadwal";
import TUK from "./TUK";
import Skema from "./Skema";

export default function InfoTabs() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("persyaratan");

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  const renderContent = () => {
    switch (activeTab) {
      case "persyaratan":
        return <Persyaratan />;
      case "jadwal":
        return <Jadwal />;
      case "tuk":
        return <TUK />;
      case "skema":
        return <Skema />;
      default:
        return <Persyaratan />;
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Informasi Uji Kompetensi
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Informasi lengkap terkait persyaratan, jadwal pelaksanaan,
            tempat uji kompetensi, dan skema sertifikasi.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {[
            { key: "persyaratan", label: "Persyaratan" },
            { key: "jadwal", label: "Jadwal" },
            { key: "tuk", label: "TUK" },
            { key: "skema", label: "Skema Kompetensi" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded-lg font-semibold text-sm
                transition-all
                ${
                  activeTab === tab.key
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-orange-500 shadow-sm"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-md p-8 min-h-[400px]">
          {renderContent()}
        </div>

      </div>
    </section>
  );
}