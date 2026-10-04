import type { Metadata } from "next";
import Link from "next/link";

import { UiLegalPage, type LegalSection } from "@/components/UiLegalPage";
import { LEGAL, MAIL_FROM } from "@/config/constants";

export const metadata: Metadata = {
  title: "Política de seguridad",
  description: "Cómo protege TaskFlow tu cuenta y tus datos, y cómo reportar una vulnerabilidad.",
};

const mail = <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>;

const SECTIONS: LegalSection[] = [
  {
    title: "Cómo protegemos tu cuenta",
    body: (
      <ul>
        <li>Las contraseñas se guardan cifradas con bcrypt, un algoritmo irreversible: nadie puede leerlas.</li>
        <li>Tu sesión caduca a los 30 días, y al cambiar o restablecer la contraseña se cierran las demás sesiones.</li>
        <li>Cambiar el correo o eliminar la cuenta exige tu contraseña actual, y el correo nuevo debe verificarse.</li>
        <li>
          Limitamos los intentos de inicio de sesión, registro, recuperación de contraseña y contacto para frenar
          ataques automatizados.
        </li>
        <li>
          Los códigos de recuperación de contraseña se guardan cifrados, caducan a los 15 minutos y se invalidan tras
          5 intentos fallidos.
        </li>
      </ul>
    ),
  },
  {
    title: "Cómo protegemos tus datos",
    body: (
      <ul>
        <li>Todo el tráfico viaja cifrado con HTTPS.</li>
        <li>
          Cada usuario solo puede ver y modificar su propio contenido. Las funciones de administración están
          restringidas por roles y permisos, verificados en el servidor en cada petición.
        </li>
        <li>La base de datos no es accesible desde internet: solo la aplicación puede conectarse a ella.</li>
        <li>
          El sitio aplica cabeceras de seguridad (Content-Security-Policy, protección contra clickjacking y
          otras) para reducir el riesgo de ataques en el navegador.
        </li>
        <li>Hacemos copias de seguridad periódicas de la base de datos.</li>
        <li>Revisamos las dependencias del proyecto en busca de vulnerabilidades conocidas y las actualizamos.</li>
      </ul>
    ),
  },
  {
    title: "Lo que puedes hacer tú",
    body: (
      <ul>
        <li>Usa una contraseña larga y que no uses en otros sitios.</li>
        <li>Cierra sesión cuando uses TaskFlow en un dispositivo compartido.</li>
        <li>
          Desconfía de correos que pidan tu contraseña: TaskFlow nunca te la pedirá por correo. Nuestros correos
          llegan desde la dirección {MAIL_FROM}.
        </li>
      </ul>
    ),
  },
  {
    title: "Reportar una vulnerabilidad",
    body: (
      <>
        <p>
          Si encuentras un fallo de seguridad, escríbenos a {mail} con una descripción y los pasos para reproducirlo.
          Te pedimos que:
        </p>
        <ul>
          <li>No accedas, modifiques ni borres datos de otros usuarios.</li>
          <li>No hagas pruebas que degraden el servicio (por ejemplo, de denegación de servicio).</li>
          <li>Nos des un tiempo razonable para corregirlo antes de hacerlo público.</li>
        </ul>
        <p>
          Responderemos lo antes posible y te mantendremos al tanto. No emprenderemos acciones legales contra quien
          reporte de buena fe siguiendo estas pautas.
        </p>
      </>
    ),
  },
  {
    title: "Si ocurre un incidente",
    body: (
      <p>
        Si un incidente de seguridad afecta a tus datos personales, lo investigaremos, tomaremos medidas para
        contenerlo y te lo comunicaremos, junto con la Autoridad Nacional de Protección de Datos Personales cuando la
        ley lo exija. Más información sobre tus datos en la <Link href="/privacy">Política de privacidad</Link>.
      </p>
    ),
  },
];

export default function SecurityRoute() {
  return (
    <UiLegalPage
      badge="Seguridad"
      title="Política de seguridad"
      intro={<p>Así protegemos tu cuenta y tus datos en TaskFlow, y así puedes ayudarnos a mantenerlo seguro.</p>}
      sections={SECTIONS}
    />
  );
}
