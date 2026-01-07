import ServicesDashboard from "@/components/insightDashboard";
import ServicesPDFGenerator from "@/lib/ServicesPDFGenerator";

export default function Insights() {
  return (
    <div className="flex flex-col p-4 w-full h-fit gap-4 ">
      <ServicesPDFGenerator />
      <ServicesDashboard />
    </div>
  );
}
