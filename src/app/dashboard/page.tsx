import Image from "next/image";
export default function Dashboard() {
  return (
    <div>
      Dashboard
      <Image
        src="/Dashbpoardidea.png"
        alt="Vercel Logo"
        width={817}
        height={395}
        priority
        className="rounded-2xl mx-auto"
      />
    </div>
  );
}
