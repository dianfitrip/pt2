import AgendaCard from "./AgendaCard";
import agendaList from "../../data/agenda";

export default function Agenda() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">
            Agenda & Jadwal Uji Kompetensi
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Informasi resmi terkait jadwal pelaksanaan uji kompetensi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agendaList.map((agenda) => (
            <AgendaCard key={agenda.id} {...agenda} />
          ))}
        </div>

        <div className="text-center mt-14">
          <button className="px-8 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all">
            Lihat Semua Jadwal Asesmen
          </button>
        </div>

      </div>
    </section>
  );
}
