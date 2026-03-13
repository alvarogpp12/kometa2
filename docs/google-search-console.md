# Google Search Console Setup

Este proyecto ya incluye los elementos SEO técnicos clave para Search
Console:

- `src/app/robots.ts`
- `src/app/sitemap.ts`
- metadata con `verification.google` en `src/app/layout.tsx`

## 1) Verificar propiedad de dominio

Método recomendado: **meta tag** gestionado por Next.js.

1. En Search Console, crea la propiedad del dominio/sitio.
2. Copia el token de verificación de Google.
3. Añade el token a tu entorno:

```bash
GOOGLE_SITE_VERIFICATION=tu_token_de_google
```

4. Despliega y pulsa "Verificar" en Search Console.

## 2) Enviar sitemap

Una vez desplegado, envía:

```text
https://tu-dominio.com/sitemap.xml
```

El `robots.txt` ya referencia automáticamente al sitemap.

## 3) Checklist post-despliegue

- Confirmar `https://tu-dominio.com/robots.txt`
- Confirmar `https://tu-dominio.com/sitemap.xml`
- Confirmar meta de verificación en el HTML de home
- Revisar cobertura e indexación en Search Console
- Comprobar Core Web Vitals en informe de experiencia
