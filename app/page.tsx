import TopMenu from "./components/TopMenu";
import SubHeader from "./components/SubHeader";

export default function Home() {
  return (
    <>
      <TopMenu />
      <SubHeader
        title="The Best Platform for Managing Your School"
        subtitle="Manage teachers, students, classes and more — all in one place."
        action={
          <a
            href="/login"
            className="bg-[#D89925] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#c4871f] transition"
          >
            Get Started
          </a>
        }
      />
    </>
  );
}
