import Image from "next/image";

export default function Diary() {
  return (
    <div>
      <h1>Diary</h1>
      <Image
        src="/calendarIdea.png"
        alt="Vercel Logo"
        width={591}
        height={498}
        priority
        className="rounded-2xl p-2 mx-auto"
      />
    </div>
  );
}
