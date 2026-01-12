import BarbersSettings from "@/components/barbersSetting";

export default function Page() {
  return (
    <div className="">
      <h1 className="text-xl font-bold mb-4 p-4">Barbers</h1>
      <p className="text-muted-foreground mb-6 px-4">
        Ve la información sobre los Barbers.
      </p>
      <BarbersSettings />
    </div>
  );
}
