// components/Calendar.jsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // opcional

/**aseccion de fetch clients */


export default function Calendar() {
  const handleDateClick = (arg: any) => {
    alert(`Fecha clickeada: ${arg.dateStr}`);
  };

  return ( 
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      dateClick={handleDateClick}
      events={[
        { title: "Evento 1", date: "2025-10-15", color: "red" },
        { title: "Evento 2", date: "2025-10-20" },
      ]}
    />
  );
}
