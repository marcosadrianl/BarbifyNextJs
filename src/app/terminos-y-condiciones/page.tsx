export default function Page() {
  return (
    <div>
      <section className="flex flex-col flex-1">
        <article className="mt-1 w-full mb-2">
          <section className=" mx-auto p-6 bg-white rounded-xl shadow-md text-gray-800">
            <h1 className="text-2xl font-bold mb-2">
              TÉRMINOS Y CONDICIONES DE USO
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Última actualización: 08/08/2025
            </p>

            <p className="mb-4">
              Bienvenido/a a <strong>Barbify</strong>. Al crear una cuenta y
              utilizar nuestra aplicación, aceptás los presentes Términos y
              Condiciones de Uso. Te recomendamos leerlos detenidamente antes de
              continuar.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              1. SOBRE BARBIFY
            </h2>
            <p className="mb-4">
              Barbify es una aplicación diseñada para ayudar a personas
              aficionadas y profesionales del ámbito de la barbería y peluquería
              a gestionar clientes, servicios, empleados (colaboradores llamados
              Barbers) y aspectos administrativos de su actividad.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              2. REQUISITOS Y REGISTRO
            </h2>
            <p className="mb-2">
              Para utilizar Barbify es obligatorio crear una cuenta. Durante el
              registro se solicitarán los siguientes datos personales:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Nombre completo</li>
              <li>Correo electrónico</li>
              <li>Contraseña</li>
            </ul>
            <p className="mb-4">
              El usuario es responsable de mantener esta información
              actualizada, veraz y segura.
            </p>
            <p>
              Recomendamos utilizar la misma cuenta que usas en MercadoPago si
              deseas realizar pagos dentro de la app usando dinero disponible en
              MercadoPago, Aunque no es obligatorio que sean la misma cuenta, se
              pueden realizar los pagos con otros metodos.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              3. PLANES Y SUSCRIPCIONES
            </h2>
            <p className="mb-2">Barbify ofrece dos niveles de servicio:</p>
            <ul className="list-disc list-inside mb-4">
              <li>
                <strong>Standard</strong> (Con prueba gratuita): incluye
                funciones básicas de gestión.
              </li>
              <li>
                <strong>Premium</strong> (de pago): acceso a herramientas
                ampliadas.
              </li>
            </ul>
            <p>
              Las suscripciones se procesan exclusivamente a través de
              <strong> MercadoPago</strong>. No se realizan cobros dentro de la
              app fuera de estas suscripciones.
            </p>
          </section>
          <section className="mt-4 p-6 bg-white rounded-xl shadow-md text-gray-800">
            <h2 className="text-lg font-semibold mt-6 mb-2">
              4. USO RESPONSABLE DE LA APP
            </h2>
            <p className="mb-2">
              El usuario se compromete a utilizar la app de forma lícita y
              responsable. En particular:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>
                No está permitido el uso indebido de la app para fines ilícitos.
              </li>
              <li>
                Está prohibido ingresar información falsa o de terceros sin
                consentimiento.
              </li>
              <li>
                Se debe proteger la confidencialidad de los datos registrados,
                especialmente cuando se ingresa información médica o sensible de
                clientes.
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              5. RESPONSABILIDADES DE LA APP
            </h2>
            <p className="mb-2">
              Barbify realiza esfuerzos razonables para asegurar el correcto
              funcionamiento de la plataforma. Sin embargo, no se hace
              responsable por:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>
                La pérdida total o parcial de acceso al sistema debido a
                terceros como MongoDB, Vercel, MercadoPago, CloudFlare, entre
                otros.
              </li>
              <li>
                Errores o inconsistencias en herramientas informativas, como las
                funciones de liquidación monetaria o las SmartCards.
              </li>
            </ul>
            <p className="mb-4">
              Barbify es un software en constante evolución. Las funciones,
              disponibilidad y contenido pueden modificarse sin previo aviso.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              6. CANCELACIÓN Y ELIMINACIÓN DE CUENTA
            </h2>
            <p className="mb-4">
              El usuario puede solicitar la eliminación de su cuenta en
              cualquier momento. Al hacerlo, todos los datos asociados serán
              eliminados de forma permanente.
            </p>
            <p>
              Antes de eliminar su cuenta, el usuario puede solicitar una copia
              de su información en formato Excel, CSV o .txt escribiendo a
              nuestro correo de soporte.
            </p>
          </section>
          <section className="mt-4 p-6 bg-white rounded-xl shadow-md text-gray-800">
            <h2 className="text-lg font-semibold mt-6 mb-2">
              7. PROPIEDAD INTELECTUAL
            </h2>
            <p className="mb-4">
              Todo el contenido original presente en
              <strong> Barbify</strong>, incluyendo el software, diseño y
              textos, es propiedad del desarrollador, salvo donde se indique lo
              contrario. Se utilizan recursos de terceros conforme a sus
              licencias respectivas.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              8. LEGISLACIÓN APLICABLE
            </h2>
            <p className="mb-4">
              Barbify no se encuentra registrado como empresa formal en ningún
              país. Sin embargo, ante cualquier conflicto legal, se tomará como
              jurisdicción de referencia la
              <strong> República Argentina</strong>.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              9. CONTACTO Y SOPORTE
            </h2>
            <p className="mb-2">
              Para consultas, reclamos o soporte, podés escribirnos a:
            </p>
            <ul className="list-none mb-4">
              <li>
                🌐
                <a
                  href="https://barbify.glownest.app/FAQ.html"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  barbify.glownest.app/FAQ.html
                </a>
              </li>
              <li>
                📧
                <a
                  href="mailto:barbify@glownest.app"
                  className="text-blue-600 hover:underline"
                >
                  barbify@glownest.app
                </a>
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              10. ACEPTACIÓN DE LOS TÉRMINOS
            </h2>
            <p>
              Al registrarte y utilizar <strong>Barbify</strong>, declarás haber
              leído, comprendido y aceptado estos Términos y Condiciones. Si no
              estás de acuerdo, no debés utilizar la aplicación.
            </p>
          </section>
        </article>
      </section>
    </div>
  );
}
