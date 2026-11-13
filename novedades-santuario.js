const news = document.getElementById('santuario-novedad');

async function loadLatestPost() {
  news.hidden = false;
  news.textContent = 'Consultando las novedades del Santuario…';

  try {
    const endpoint = 'https://cms.santuariodelujan.org.ar/wp-json/wp/v2/posts?per_page=1&_fields=title,link,date';
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('La consulta falló');

    const [post] = await response.json();
    const url = new URL(post.link);
    if (url.origin !== new URL(endpoint).origin) throw new Error('Enlace inesperado');

    const title = new DOMParser().parseFromString(post.title.rendered, 'text/html').body.textContent.trim();
    const date = new Date(post.date.slice(0, 10) + 'T12:00:00Z');
    if (!title) throw new Error('Publicación sin título');

    const link = document.createElement('a');
    link.href = url.href;
    link.textContent = title;
    const formattedDate = new Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
    news.replaceChildren(formattedDate + ' · ', link);
  } catch {
    news.textContent = 'La última publicación no está disponible en este momento.';
  }
}

loadLatestPost();
