import Hero from "../../components/hero/Hero";
import Statistics from "../../components/statistics/Statistics";
import AssessorList from "../../components/assessors/AssessorList";
import Agenda from "../../components/agenda/Agenda";
import LatestUpdates from "../../components/updates/LatestUpdates";

export default function Home() {
  return (
    <>
      <Hero />
      <Statistics />
      <AssessorList />
      <Agenda />
      <LatestUpdates />
    </>
  );
}
