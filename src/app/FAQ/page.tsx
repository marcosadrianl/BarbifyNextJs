"use client";

import useTheme from "@/hooks/useTheme";

type FaqPart = {
  text: string;
  href?: string;
  bold?: boolean;
};

type FaqLine = {
  parts: FaqPart[];
  className?: string;
};

type FaqItem = {
  question: string;
  answers: FaqLine[];
};

type FaqSection = {
  title: string;
  titleClassName: string;
  items: FaqItem[];
};

const FAQ_SECTIONS: FaqSection[] = [
  {
    title: "Preguntas sobre la aplicación",
    titleClassName: "text-3xl my-4",
    items: [
      {
        question: "¿Cómo puedo agregar clientes?",
        answers: [
          {
            parts: [
              {
                text: 'Puedes agregar clientes haciendo clic en el botón "Nuevo Cliente".',
              },
            ],
          },
          {
            parts: [
              { text: "- Completa el formulario con los datos del cliente." },
            ],
          },
          { parts: [{ text: '- Haz clic en el botón "Crear Cliente".' }] },
        ],
      },
      {
        question: "La lista de clientes está vacía, ¿qué puedo hacer?",
        answers: [
          {
            parts: [
              {
                text: 'La lista de clientes puede demorar en actualizarse; sin embargo, en caso de producirse un error, se mostrará un mensaje: "No hay clientes registrados"',
              },
            ],
          },
          {
            parts: [
              { text: "- Revisa que la conexión a internet sea estable." },
            ],
          },
          {
            parts: [
              {
                text: "- Revisa que el nombre del cliente ingresado sea correcto.",
              },
            ],
          },
          {
            parts: [
              {
                text: '- Puedes volver a la pagina inicial haciendo clic en "Clientes"',
              },
            ],
          },
          { parts: [{ text: "- Intenta cerrar y volver a iniciar sesión." }] },
          {
            parts: [
              {
                text: "Si el problema persiste, contáctanos indicando los detalles del error.",
              },
            ],
          },
        ],
      },
      /* {
        question: "¿Puedo recuperar un cliente que oculte?",
        answers: [
          {
            parts: [
              {
                text: "Sí, puedes volver a visualizar o recuperar los datos de clientes ocultos.",
              },
            ],
          },
          {
            className: "mt-2",
            parts: [{ text: "Si quieres recuperar un cliente oculto:" }],
          },
          {
            parts: [
              {
                text: '- Haz click en el buscador de clientes y busca por nombre el cliente oculto. Veras que se indica en rojo "Oculto"',
              },
            ],
          },
          { parts: [{ text: "- Haz click en el boton de editar cliente." }] },
          {
            parts: [
              {
                text: '- Por defecto los clientes se guardan como "Activos", por lo que puedes simplemente hacer click en "Actualizar" para volver a ver al cliente en la lista.',
              },
            ],
          },
        ],
      }, */
      /*  {
        question: "¿Qué es ese id en la sección de Liquidaciones?",
        answers: [
          {
            parts: [
              {
                text: "El id es un identificador generado automáticamente para cada servicio. Allí se encuentra la información de la fecha y hora de creación del servicio o registro del turno.",
              },
            ],
          },
        ],
      }, */
      {
        question:
          "¿Cómo puedo asignar diferentes empleados (Barbers) a un servicio?",
        answers: [
          {
            parts: [
              { text: "Para asignar diferentes empleados a un servicio:" },
            ],
          },
          {
            parts: [
              {
                text: '- Haz clic en el botón de "+ Nuevo Servicio" en la pagina personal del cliente.',
              },
            ],
          },
          {
            parts: [
              {
                text: "- Elige de la lista desplegable 'Atendido por'.",
              },
            ],
          },
          {
            className: "mt-4",
            parts: [
              {
                text: 'Puedes agregar más colaboradores (a.k.a "Barbers") llenando el formulario de "Crear Nuevo Barber" en la vista de "Cuenta > Barbers > Crear Nuevo Barber":',
              },
            ],
          },
          {
            parts: [
              { text: '- Haz clic en la vista de "' },
              {
                text: 'Cuenta"',
                href: "https://barbify.glownest.app/account/barbers",
              },
            ],
          },

          {
            parts: [
              {
                text: '- Completa el formulario "Crear Nuevo Barber" con los datos requeridos.',
              },
            ],
          },
          { parts: [{ text: '- Haz clic en "Crear Barber".' }] },
          {
            parts: [
              {
                text: "Verás el nombre del empleado en la lista de empleados del servicio.",
              },
            ],
          },
          {
            className: "mt-4",
            parts: [
              {
                text: '💭 En "Rol" puedes indicar si es un "Empleado" o un "Administrador" o el rol que tú elijas.',
              },
            ],
          },
        ],
      },
      {
        question: "¿Cómo puedo imprimir resumenes de los servicios realizados?",
        answers: [
          {
            parts: [
              {
                text: 'Puedes hacer resumenes de los servicios en la sección "',
              },
              {
                text: 'insights"',
                href: "https://barbify.glownest.app/insights",
              },
            ],
          },
          {
            parts: [
              {
                text: "En la tarjeta 'Exportar Servicios' puedes elegir el periodo a resumir.",
              },
              {
                text: " Si dejas el periodo sin marcar, obtendras todo el historial de servicios.",
              },
            ],
          },
          {
            className: "mt-2",
            parts: [{ text: "Haz clic en Generar Documento" }],
          },
          {
            parts: [
              {
                text: "- Una vez generado el documento, se abrira una nueva pestana.",
              },
            ],
          },
          {
            parts: [
              { text: "- En el menu de impresión, haz clic en imprimir" },
            ],
          },

          {
            className: "mt-4",
            parts: [
              {
                text: "💭 Puedes elegir opciones de impresión en el menú de impresión.",
              },
            ],
          },
        ],
      },
      {
        question: "¿Cómo puedo registrar turnos a futuro?",
        answers: [
          {
            className: "mt-2",
            parts: [
              {
                text: "Para registrar un turno a futuro, en el panel de Clientes busca al cliente a registrar turno:",
              },
            ],
          },
          { parts: [{ text: '- Haz clic en "Nuevo Servicio".' }] },
          {
            parts: [
              {
                text: "- En los campos fecha y hora, registra la fecha y hora que desees asignar.",
              },
            ],
          },
          {
            parts: [
              { text: "- Verás el turno aparecer en la " },
              { text: '"Agenda"', bold: true },
              { text: " en la fecha indicada." },
            ],
          },
          {
            className: "mt-4",
            parts: [
              {
                text: '💭 Aprovecha el campo "Notas" para dejar en claro que es un turno a futuro, si el cliente te adelantó el pago o lo que creas relevante.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Preguntas sobre facturación",
    titleClassName: "text-3xl mb-4 mt-8",
    items: [
      {
        question: "¿Cómo puedo cancelar mi suscripción?",
        answers: [
          {
            parts: [
              { text: 'Consulta la sección "Tus suscripciones" en ' },
              {
                text: "MercadoPago",
                href: "https://www.mercadopago.com.ar/suscripciones",
              },
              { text: " y sigue los pasos que allí se detallan." },
            ],
          },
          {
            className: "mt-2",
            parts: [
              {
                text: "Si tienes dudas sobre la suscripción, no dudes en contactarnos.",
              },
            ],
          },
          {
            className: "mt-4",
            parts: [
              {
                text: '❗ Ten en cuenta que si cancelas tu suscripción, tu usuario entrará en estado "Pausado" y no podrás acceder a la aplicación; sin embargo, tus datos estarán seguros.',
              },
            ],
          },
        ],
      },
      {
        question: "¿Cómo puedo cambiar mi nivel de suscripción?",
        answers: [
          {
            parts: [
              {
                text: "Ponte en contacto con nosotros para guiarte en el proceso de cambio de nivel.",
              },
            ],
          },
          {
            parts: [
              { text: "- Envíanos tu solicitud de cambio de nivel desde el " },
              { text: "formulario de contacto", href: "/#contact" },
              { text: "." },
            ],
          },
        ],
      },
      {
        question: "¿Qué ocurre si no pago a tiempo?",
        answers: [
          {
            parts: [
              {
                text: "No te preocupes. Puedes seguir haciendo uso de Barbify hasta tres meses después de tu vencimiento de pago.",
              },
            ],
          },
          {
            parts: [
              {
                text: 'Una vez transcurridos los 3 meses, tu usuario entrará en estado "Pausado" y no podrás acceder a la aplicación; sin embargo, tus datos estarán seguros.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Preguntas sobre los niveles de suscripción",
    titleClassName: "text-3xl my-4",
    items: [
      {
        question: "¿Qué niveles de suscripción hay?",
        answers: [
          {
            parts: [
              { text: "En Barbify ofrecemos tres niveles de suscripción:" },
            ],
          },
          {
            parts: [
              { text: "- " },
              { text: "Bronze", bold: true },
              {
                text: ": Acceso a la sección de clientes, administración y liquidación.",
              },
            ],
          },
          {
            parts: [
              { text: "- " },
              { text: "Silver", bold: true },
              {
                text: ": Acceso a la sección de clientes, Dashboard, liquidación ampliada.",
              },
            ],
          },
          {
            parts: [
              { text: "- " },
              { text: "Gold", bold: true },
              {
                text: ": Acceso a la sección de clientes, agenda, liquidación mejorada y turnos a futuro.",
              },
            ],
          },
        ],
      },
      {
        question: "¿Qué niveles de suscripción me conviene?",
        answers: [
          {
            parts: [
              {
                text: "Depende de tus necesidades y el tamaño de tu negocio. En Barbify ofrecemos tres niveles para que elijas el que mejor se adapte a tu trabajo:",
              },
            ],
          },
          {
            parts: [
              { text: "- " },
              { text: "Bronze", bold: true },
              {
                text: ": Ideal si estás comenzando o querés algo simple. Incluye acceso a la sección de clientes, administración y funciones básicas de liquidación.",
              },
            ],
          },
          {
            parts: [
              { text: "- " },
              { text: "Silver", bold: true },
              {
                text: ": Recomendado si querés una mejor visión de tu negocio. Además de la sección de clientes, accedés a un Dashboard con estadísticas y una liquidación ampliada.",
              },
            ],
          },
          {
            parts: [
              { text: "- " },
              { text: "Gold", bold: true },
              {
                text: ": Pensado para quienes necesitan una gestión integral. Incluye agenda de turnos, liquidación mejorada y la posibilidad de organizar citas a futuro, además de todo lo anterior.",
              },
            ],
          },
          {
            className: "mt-4",
            parts: [
              {
                text: "💭 ¿No estás seguro aún? Podés comenzar con un nivel más bajo y subirlo cuando lo necesites.",
              },
            ],
          },
        ],
      },
      {
        question: "¿No tengo MercadoPago, puedo suscribirme igualmente?",
        answers: [
          {
            parts: [
              {
                text: "No, para acceder a los niveles de suscripción Silver y Gold de Barbify, debes tener una cuenta de MercadoPago.",
              },
            ],
          },
          {
            parts: [
              { text: "Si no tienes una cuenta, puedes crearla en " },
              { text: "MercadoPago", href: "https://www.mercadopago.com.ar/" },
            ],
          },
          {
            parts: [
              {
                text: "Al registrarte mediante MercadoPago podrás disfrutar de los niveles de suscripción de Barbify, incluyendo los días gratis.",
              },
            ],
          },
        ],
      },
    ],
  },
];

export default function FAQ() {
  return (
    <section className="flex flex-col bg-[#F5FFFF] text-[#43553b]">
      <div className="w-full flex flex-col md:flex-row p-4 border-b border-amber-950">
        <p className="mx-auto text-3xl md:text-4xl lg:text-5xl">
          Centro de ayuda y preguntas frecuentes
        </p>
      </div>
      {FAQ_SECTIONS.map((section) => (
        <div key={section.title} className="block px-4">
          <p className={section.titleClassName}>{section.title}</p>
          {section.items.map((item) => (
            <details key={item.question} className="faq-item">
              <summary className="faq-question">{item.question}</summary>
              <div className="faq-answer">
                {item.answers.map((line, lineIndex) => (
                  <p
                    key={`${item.question}-${lineIndex}`}
                    className={line.className}
                  >
                    {line.parts.map((part, partIndex) => {
                      if (part.href) {
                        return (
                          <a
                            key={`${item.question}-${lineIndex}-${partIndex}`}
                            href={part.href}
                            className="hover:underline text-blue-500"
                            target="_blank"
                          >
                            {part.text}
                          </a>
                        );
                      }

                      if (part.bold) {
                        return (
                          <b key={`${item.question}-${lineIndex}-${partIndex}`}>
                            {part.text}
                          </b>
                        );
                      }

                      return (
                        <span
                          key={`${item.question}-${lineIndex}-${partIndex}`}
                        >
                          {part.text}
                        </span>
                      );
                    })}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
      ))}
    </section>
  );
}
