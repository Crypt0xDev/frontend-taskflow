import type { Metadata } from "next";
import Link from "next/link";

import { UiLegalPage, type LegalSection } from "@/components/UiLegalPage";
import { LEGAL } from "@/config/constants";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Qué datos personales trata TaskFlow, para qué, con quién se comparten y cómo ejercer tus derechos.",
};

const mail = <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>;

const SECTIONS: LegalSection[] = [
  {
    title: "Responsable del tratamiento",
    body: (
      <>
        <p>
          El responsable de tus datos personales es <strong>{LEGAL.owner}</strong> ({LEGAL.country}), titular de
          TaskFlow. Puedes escribir a {mail} para cualquier consulta sobre esta política.
        </p>
        <p>
          Tratamos tus datos conforme a la Ley N.º 29733, Ley de Protección de Datos Personales, y su reglamento. El
          banco de datos de usuarios de TaskFlow está inscrito ante la Autoridad Nacional de Protección de Datos
          Personales (ANPD): {LEGAL.anpdRegistration}.
        </p>
      </>
    ),
  },
  {
    title: "Qué datos tratamos",
    body: (
      <ul>
        <li>
          <strong>Datos de tu cuenta:</strong> nombre de usuario, correo electrónico y contraseña (guardada cifrada
          con un algoritmo irreversible; nadie puede leerla). De forma opcional: fecha de nacimiento y avatar.
        </li>
        <li>
          <strong>Contenido que creas:</strong> tareas, categorías, etiquetas y comentarios.
        </li>
        <li>
          <strong>Mensajes de contacto:</strong> el nombre, correo y mensaje que envías desde el formulario de
          contacto.
        </li>
        <li>
          <strong>Datos técnicos:</strong> registros del servidor con el método, la ruta y el resultado de cada
          petición, sin guardar tu IP ni el contenido de lo que envías.
        </li>
      </ul>
    ),
  },
  {
    title: "Para qué los usamos",
    body: (
      <>
        <ul>
          <li>Crear y mantener tu cuenta, e iniciar sesión.</li>
          <li>Guardar y mostrarte tus tareas, categorías y etiquetas.</li>
          <li>Enviarte correos necesarios del servicio: verificación de correo, recuperación de contraseña y bienvenida.</li>
          <li>Mostrar tus comentarios, junto con tu nombre de usuario, a los demás usuarios registrados.</li>
          <li>Responder los mensajes que nos envías por el formulario de contacto.</li>
          <li>Proteger el servicio frente a abusos (por ejemplo, limitar los intentos de inicio de sesión).</li>
        </ul>
        <p>
          La base para tratarlos es tu consentimiento al crear la cuenta y la necesidad de prestarte el servicio. No
          vendemos tus datos, no los usamos para publicidad y no elaboramos perfiles.
        </p>
      </>
    ),
  },
  {
    title: "Con quién los compartimos",
    body: (
      <>
        <p>Solo con proveedores que necesitamos para que TaskFlow funcione, que tratan los datos por encargo nuestro:</p>
        <ul>
          <li>
            <strong>Resend</strong> (Estados Unidos): envío de los correos del servicio. Recibe tu correo y el
            contenido de esos mensajes.
          </li>
          <li>
            <strong>Cloudflare</strong> (red global): protege y acelera el acceso al sitio. Ve el tráfico que pasa
            hacia nuestros servidores.
          </li>
          <li>
            <strong>Proveedor del servidor (VPS)</strong>: aloja la aplicación y la base de datos.
          </li>
        </ul>
        <p>
          Algunos de estos proveedores están fuera del Perú, por lo que se produce un flujo transfronterizo de datos.
          Al aceptar esta política consientes esa transferencia, limitada a lo necesario para prestar el servicio.
        </p>
      </>
    ),
  },
  {
    title: "Cuánto tiempo los conservamos",
    body: (
      <ul>
        <li>Los datos de tu cuenta y tu contenido, mientras tu cuenta exista.</li>
        <li>
          Al eliminar tu cuenta se borran de inmediato y de forma definitiva de la base de datos. Pueden permanecer en
          copias de seguridad hasta que estas se renueven en su ciclo normal.
        </li>
        <li>Los enlaces de verificación caducan a los 60 minutos y los códigos de recuperación, a los 15 minutos.</li>
        <li>Los mensajes de contacto, en nuestro correo hasta resolver tu consulta.</li>
      </ul>
    ),
  },
  {
    title: "Cookies y almacenamiento en tu navegador",
    body: (
      <>
        <p>Usamos solo almacenamiento técnico, imprescindible para que la aplicación funcione:</p>
        <ul>
          <li>
            <strong>taskflow_token</strong> (almacenamiento local): tu sesión. Caduca a los 30 días o al cerrar sesión.
          </li>
          <li>
            <strong>tf_has_session</strong> (cookie): indica que hay una sesión abierta, sin contener datos personales.
          </li>
          <li>
            <strong>sidebar_state</strong> (cookie) y la preferencia de tema claro u oscuro: recuerdan cómo prefieres
            ver la aplicación.
          </li>
        </ul>
        <p>No usamos cookies de analítica, publicidad ni de terceros.</p>
      </>
    ),
  },
  {
    title: "Tus derechos",
    body: (
      <>
        <p>
          Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, cancelación y oposición (ARCO):
        </p>
        <ul>
          <li>
            <strong>Rectificar</strong> tus datos desde <Link href="/profile">Mi perfil</Link>.
          </li>
          <li>
            <strong>Cancelar</strong> (eliminar) tu cuenta y todos tus datos desde Mi perfil → Eliminar mi cuenta.
          </li>
          <li>
            <strong>Acceder</strong> a tus datos u <strong>oponerte</strong> a un tratamiento escribiendo a {mail}.
          </li>
        </ul>
        <p>
          Responderemos dentro de los plazos que fija la ley. Si consideras que no atendimos tu solicitud, puedes
          presentar un reclamo ante la Autoridad Nacional de Protección de Datos Personales del Ministerio de Justicia
          y Derechos Humanos.
        </p>
      </>
    ),
  },
  {
    title: "Menores de edad",
    body: (
      <p>
        TaskFlow no está dirigido a menores de 14 años. Si eres menor de esa edad, necesitas el consentimiento de tu
        madre, padre o tutor para usarlo.
      </p>
    ),
  },
  {
    title: "Seguridad",
    body: (
      <p>
        Aplicamos medidas técnicas y organizativas para proteger tus datos. Las detallamos en la{" "}
        <Link href="/security">Política de seguridad</Link>.
      </p>
    ),
  },
  {
    title: "Cambios en esta política",
    body: (
      <p>
        Si cambiamos esta política, actualizaremos la fecha de arriba. Si el cambio es importante, te avisaremos por
        correo antes de que entre en vigor.
      </p>
    ),
  },
];

export default function PrivacyRoute() {
  return (
    <UiLegalPage
      badge="Privacidad"
      title="Política de privacidad"
      intro={
        <p>
          En TaskFlow tratamos tus datos personales con el mínimo necesario para que organices tus tareas. Aquí te
          explicamos qué datos usamos, para qué y cómo puedes controlarlos.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
