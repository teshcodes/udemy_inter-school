import SubHeader from "@/app/components/SubHeader";

export default function DashboardPage() {
  return (
    <div>
      <SubHeader
        title="Manage your team easily with task man"
        subtitle="Statisda is a school management solution that offers a personalized portal to each type of user."
        action={
          <button className="bg-[#0A92DD] text-white px-6 py-2 rounded-full text-sm">
            Get Started
          </button>
        }
      />

    </div>
  );
}
