/**
 * Helper to resolve image paths across development (Vite dev) and production builds (Vercel, Cloud Run).
 * 
 * GUIA DE COMO ADICIONAR IMAGENS (SALVO PARA CONSULTA):
 * ----------------------------------------------------------------------------
 * 1. MÉTODOS SUPORTADOS:
 *    - Pasta /src/assets/images/: Todas as fotos (.png, .jpg, .jpeg, .webp, .gif) são 
 *      empacotadas automaticamente por este arquivo usando import.meta.glob().
 *      IMPORTANTE: Certifique-se de que o nome do arquivo no disco não tenha sufixos indesejados
 *      (ex: evite "-1.jpg" se no código você escreveu ".jpg"). O nome tem que ser idêntico!
 *    - Pasta /public/: Você pode jogar imagens diretamente na pasta public/ e referenciá-las
 *      por caminho simples com barra inicial (ex: "/minha_foto.jpg").
 * 
 * In Vite:
 * 1. Static asset strings like "/src/assets/images/foto1_acai.jpg" are ignored by the production bundler unless imported.
 * 2. This helper uses import.meta.glob to automatically bundle all files in /src/assets/images/ and resolve them at runtime.
 * 3. It also supports loading images from the /public directory as a fallback (e.g. converting /src/assets/images/foto.jpg to /foto.jpg).
 */

const bundledImages: Record<string, string> = import.meta.glob('/src/assets/images/*.{png,jpg,jpeg,webp,gif}', { eager: true, import: 'default' }) as Record<string, string>;

export function resolveImageUrl(path: string | undefined): string {
  if (!path) return "";
  
  // 1. Check if Vite bundled this exact path from src/assets/images
  if (bundledImages[path]) {
    return bundledImages[path];
  }

  // 2. Try matching clean filename against bundledImages FIRST (works for "/timeline_2022.jpg", "timeline_2022.jpg", "/assets/timeline_2022-HASH.jpg", etc.)
  const rawFilename = path.split('/').pop() || '';
  const cleanFilename = rawFilename.replace(/-[a-zA-Z0-9]{8,}(\.[a-zA-Z0-9]+)$/, '$1');
  if (cleanFilename) {
    for (const key in bundledImages) {
      if (key.endsWith('/' + cleanFilename) || key.endsWith(cleanFilename)) {
        return bundledImages[key];
      }
    }
  }

  // 3. If it's a base64 data URL, http/https URL, or already a compiled asset URL (/assets/), return as is
  if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/assets/')) {
    return path;
  }

  // 4. If path starts with "/src/assets/images/" or "src/assets/images/" or "/public/", strip prefix so Vercel can serve from /public
  // In Vercel and Vite production, any file placed inside the /public folder is served at the root (e.g., /foto1_acai.jpg)
  if (path.startsWith('/src/assets/images/')) {
    return path.replace('/src/assets/images/', '/');
  }
  if (path.startsWith('src/assets/images/')) {
    return path.replace('src/assets/images/', '/');
  }
  if (path.startsWith('/public/')) {
    return path.replace('/public/', '/');
  }
  if (path.startsWith('public/')) {
    return path.replace('public/', '/');
  }

  // 5. Ensure leading slash if it looks like a relative filename (e.g., "foto1_acai.jpg" or "timeline_2022.jpg")
  if (!path.startsWith('/') && !path.startsWith('http')) {
    return '/' + path;
  }

  return path;
}

/**
 * Fallback helper for Vercel: if a bundled asset or path fails to load (onError),
 * we extract the clean filename and serve directly from Vercel's /public root (e.g., /timeline_2022.jpg).
 */
export function getFallbackImageUrl(path: string | undefined): string {
  if (!path) return "";
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const rawFilename = path.split('/').pop() || '';
  const cleanFilename = rawFilename.replace(/-[a-zA-Z0-9]{8,}(\.[a-zA-Z0-9]+)$/, '$1');
  if (!cleanFilename) return path;
  return !cleanFilename.startsWith('/') ? '/' + cleanFilename : cleanFilename;
}
