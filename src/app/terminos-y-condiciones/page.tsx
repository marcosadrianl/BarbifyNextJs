"use client";

import Link from "next/dist/client/link";
import useTheme from "@/hooks/useTheme";

export default function Page() {
  const { theme } = useTheme();

  return (
    <section className="flex flex-col flex-1">
      <article className="w-full mb-2">
        <section
          className="mx-auto p-6"
          style={{ backgroundColor: theme.bgCard, color: theme.textPrimary }}
        >
          <h1 className="text-2xl font-bold mb-2">
            TÉRMINOS Y CONDICIONES DE USO
          </h1>
          <p className="text-sm mb-6" style={{ color: theme.textSecondary }}>
            Última actualización: 4 de Marzo de 2026
          </p>

          <p className="mb-4" style={{ color: theme.textPrimary }}>
            Bienvenido/a a <strong>Barbify</strong>. Al crear una cuenta y
            utilizar nuestra aplicación, aceptás los presentes Términos y
            Condiciones de Uso. Te recomendamos leerlos detenidamente antes de
            continuar.
          </p>

          <h2 className="text-lg font-semibold mt-6 mb-2">1. SOBRE BARBIFY</h2>
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            Barbify es una aplicación diseñada para ayudar a personas
            aficionadas y profesionales del ámbito de la barbería y peluquería a
            gestionar clientes, servicios, empleados (colaboradores llamados
            Barbers) y aspectos administrativos de su actividad.
          </p>
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            En Barbify nos comprometemos en lograr un entorno seguro y eficiente
            para todos nuestros usuarios. De encontrar algun error o fallo en la
            aplicación, por favor reportalo a nuestro soporte para que podamos
            corregirlo lo antes posible.
          </p>

          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            Tienes sugerencias o comentarios sobre nuestra aplicación? No dudes
            en compartirlos con nosotros.
          </p>

          <h2 className="text-lg font-semibold mt-6 mb-2">
            2. REQUISITOS Y REGISTRO
          </h2>
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            Para utilizar Barbify es obligatorio crear una cuenta. Durante el
            registro se solicitarán los siguientes datos personales:
          </p>
          <ul
            className="list-disc list-inside mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            <li>Nombre completo</li>
            <li>Correo electrónico</li>
            <li>Contraseña</li>
          </ul>
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            Asi mismo se solicitaran otros datos de caracter no obligatorio
            como:
          </p>
          <ul
            className="list-disc list-inside mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            <li>Teléfono</li>
            <li>Dirección</li>
            <li>Fecha de nacimiento</li>
            <li>Género</li>
          </ul>

          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            El usuario es responsable de mantener esta información actualizada,
            veraz y segura.
          </p>
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            Recomendamos utilizar una cuenta de correo a la que tengas acceso
            siempre. Sera nuestro canal de comunicación principal.
          </p>

          <h2 className="text-lg font-semibold mt-6 mb-2">
            3. PLANES Y SUSCRIPCIONES
          </h2>
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            Barbify ofrece un unico nivel de servicio:
          </p>
          <ul
            className="list-disc list-inside mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            <li>
              <strong>All Access</strong> (Con prueba gratuita): incluye acceso
              a todas las funciones de la app sin limitaciones.
            </li>
          </ul>
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            Las suscripciones se procesan mensualmente. No se realizan cobros
            dentro de la app fuera de estas suscripciones.
          </p>

          <h2 className="text-lg font-semibold mt-6 mb-2">
            4. USO RESPONSABLE DE LA APP
          </h2>
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            El usuario se compromete a utilizar la app de forma lícita y
            responsable. En particular:
          </p>
          <ul
            className="list-disc list-inside mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
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
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            Barbify realiza esfuerzos razonables para asegurar el correcto
            funcionamiento de la plataforma. Sin embargo, no se hace responsable
            por:
          </p>
          <ul
            className="list-disc list-inside mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            <li>
              La pérdida total o parcial de acceso al sistema debido a terceros
              como MongoDB, Vercel, MercadoPago, CloudFlare, entre otros.
            </li>
            <li>
              Errores o inconsistencias en herramientas informativas, como las
              funciones de resumen de ingresos o las SmartCards. Si encuentras
              algún error, por favor reportalo a nuestro soporte para que
              podamos corregirlo.
            </li>
          </ul>
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            Barbify es un software en constante evolución. Las funciones,
            disponibilidad y contenido pueden modificarse sin previo aviso.
          </p>

          <h2 className="text-lg font-semibold mt-6 mb-2">
            6. CANCELACIÓN Y ELIMINACIÓN DE CUENTA
          </h2>
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            El usuario puede solicitar la eliminación de su cuenta en cualquier
            momento. Al hacerlo, todos los datos asociados serán eliminados de
            forma permanente.
          </p>
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            Antes de eliminar su cuenta, el usuario puede solicitar una copia de
            su información en formato Excel, CSV o .txt escribiendo a nuestro
            correo de soporte.
          </p>
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            Si la cancelacion se realiza posterior a la fecha de vencimiento del
            plan, se aplicarán las tarifas correspondientes. Caso contrario, la
            cancelación será efectiva de inmediato y no se aplicarán cargos
            adicionales.
          </p>

          <h2 className="text-lg font-semibold mt-6 mb-2">
            7. PROPIEDAD INTELECTUAL
          </h2>
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            Todo el contenido original presente en
            <strong> Barbify</strong>, incluyendo el software, diseño y textos,
            es propiedad de <span className="text-blue-500">GlowNest</span> ,
            salvo donde se indique lo contrario. Se utilizan recursos de
            terceros conforme a sus licencias respectivas.
          </p>

          <h2 className="text-lg font-semibold mt-6 mb-2">
            8. LEGISLACIÓN APLICABLE
          </h2>
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            Barbify no se encuentra registrado como empresa formal en ningún
            país. Sin embargo, ante cualquier conflicto legal, se tomará como
            jurisdicción de referencia la
            <strong> República Argentina</strong>.
          </p>

          <h2 className="text-lg font-semibold mt-6 mb-2">
            9. CONTACTO Y SOPORTE
          </h2>
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            Para consultas, reclamos o soporte, podés escribirnos a:
          </p>
          <ul className="list-none mb-4">
            <li>
              🌐
              <Link
                href="https://barbify.glownest.app/FAQ"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                barbify.glownest.app/FAQ.html
              </Link>{" "}
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
          <p
            className="mb-4"
            style={{
              color: theme.textSecondary,
            }}
          >
            Al registrarte y utilizar <strong>Barbify</strong>, declarás haber
            leído, comprendido y aceptado estos Términos y Condiciones. Si no
            estás de acuerdo, no debés utilizar la aplicación.
          </p>
        </section>
      </article>
    </section>
  );
}
