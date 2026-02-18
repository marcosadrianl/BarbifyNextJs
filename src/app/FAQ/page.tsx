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
                text: 'Puedes agregar clientes haciendo clic en el botón "Agregar Cliente".',
              },
            ],
          },
          {
            parts: [
              { text: "- Completa el formulario con los datos del cliente." },
            ],
          },
          { parts: [{ text: '- Haz clic en el botón "Cargar".' }] },
        ],
      },
      {
        question: "La lista de clientes está vacía, ¿qué puedo hacer?",
        answers: [
          {
            parts: [
              {
                text: "La lista de clientes puede demorar en actualizarse; sin embargo, en caso de producirse un error, se mostrará un mensaje: \"Error al actualizar la lista de clientes: 'detalles del error' \"",
              },
            ],
          },
          { parts: [{ text: "- Intenta cerrar y volver a iniciar sesión." }] },
          {
            parts: [
              {
                text: "- Si el problema persiste, contáctanos indicando los detalles del error.",
              },
            ],
          },
        ],
      },
      {
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
      },
      {
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
      },
      {
        question: "¿Cómo puedo asignar diferentes empleados a un servicio?",
        answers: [
          {
            parts: [
              { text: "Para asignar diferentes empleados a un servicio:" },
            ],
          },
          { parts: [{ text: '- Haz clic en el botón de "Nuevo Servicio".' }] },
          {
            parts: [
              {
                text: "- Haz clic en el botón de empleados y elige al empleado que deseas asignar.",
              },
            ],
          },
          {
            className: "mt-4",
            parts: [
              {
                text: 'Puedes agregar más empleados llenando el formulario de "Agregar empleados" en la vista de "Admin":',
              },
            ],
          },
          { parts: [{ text: '- Haz clic en la vista de "Admin".' }] },
          {
            parts: [
              {
                text: '- Completa el formulario "Agregar empleados" con los datos requeridos.',
              },
            ],
          },
          { parts: [{ text: '- Haz clic en "Agregar".' }] },
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
        question: "¿Cómo puedo hacer cierres de caja?",
        answers: [
          {
            parts: [
              {
                text: 'Puedes hacer cierres de caja en la sección "Settlements" ("Liquidaciones").',
              },
            ],
          },
          {
            parts: [
              { text: "Según tu tipo de suscripción, sigue estos pasos:" },
            ],
          },
          { className: "mt-2", parts: [{ text: "En Bronze:" }] },
          {
            parts: [
              {
                text: "- Elige el día que quieres calcular (por defecto se muestra la fecha presente).",
              },
            ],
          },
          { parts: [{ text: "- Haz clic en imprimir." }] },
          { className: "mt-2", parts: [{ text: "En Silver:" }] },
          {
            parts: [
              {
                text: "- Elige el día que quieres calcular (por defecto se muestra la fecha presente); puedes elegir por día o por mes.",
              },
            ],
          },
          { parts: [{ text: "- Haz clic en imprimir." }] },
          { className: "mt-2", parts: [{ text: "En Gold:" }] },
          {
            parts: [
              {
                text: "- Elige el día que quieres calcular (por defecto se muestra la fecha presente); puedes elegir por día, mes o año.",
              },
            ],
          },
          { parts: [{ text: "- Haz clic en imprimir." }] },
          {
            className: "mt-4",
            parts: [
              {
                text: "Serás dirigido a una pestaña con tu resumen; si el panel de impresión no aparece automáticamente, intenta lo siguiente:",
              },
            ],
          },
          { parts: [{ text: '- Presiona "Ctrl + P".' }] },
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
            parts: [
              {
                text: 'Los turnos a futuro solo se pueden visualizar en el nivel "Gold".',
              },
            ],
          },
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
    <>
      <section className="flex flex-col bg-[#ffe7c7] text-[#43553b]">
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
                            <b
                              key={`${item.question}-${lineIndex}-${partIndex}`}
                            >
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
    </>
  );
}
