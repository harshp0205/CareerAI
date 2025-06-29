import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_component/dashboard-view";
import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await checkUser();

  if (!user) {
    redirect("/sign-in");
  }

  // If not onboarded, redirect to onboarding page
  if (!user.industry) {
    redirect("/onboarding");
  }

  const insights = await getIndustryInsights();

  return <DashboardView insights={insights} />;
}
