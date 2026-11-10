// Referencias geográficas generales; no coordenadas verificadas de las imágenes.
(() => {
  const english = document.documentElement.lang === 'en';
  const status = document.getElementById('map-status');
  if (!window.L) {
    status.textContent = english ? 'The map could not load. You can still open stories from the list of places.' : 'No se pudo cargar el mapa. Comprueba tu conexión; las historias siguen disponibles desde la lista de lugares.';
    return;
  }
  const places = {
    curitiba: { name: english ? "Curitiba, Brazil" : "Curitiba, Brasil", coordinates: [-25.43, -49.27] },
    ipanema: { name: english ? "Ipanema · Rio de Janeiro, Brazil" : "Ipanema · Río de Janeiro, Brasil", coordinates: [-22.98, -43.20] },
    aldershot: { name: english ? "Aldershot, United Kingdom" : "Aldershot, Reino Unido", coordinates: [51.25, -0.76] },
    nunoa: { name: "Ñuñoa, Chile", coordinates: [-33.45, -70.60] },
    concepcion: { name: "Concepción, Chile", coordinates: [-36.83, -73.05] },
    puntaeste: { name: "Punta del Este, Uruguay", coordinates: [-34.96, -54.95] },
    nacunday: { name: "Ñacunday, Paraguay", coordinates: [-25.97, -54.69] },
    valencia: { name: english ? "Santa Catalina · Valencia, Spain" : "Santa Catalina · Valencia, España", coordinates: [39.47, -0.38] },
    vaticano: { name: english ? "Vatican Gardens" : "Jardines Vaticanos", coordinates: [41.90, 12.45] },
    lujan: { name: english ? "Luján, Argentina · Where the devotion began" : "Luján, Argentina · Origen de la devoción", coordinates: [-34.57, -59.11] },
    pedralba: { name: english ? "Pedralba, Spain" : "Pedralba, España", coordinates: [39.60, -0.73] },
    washington: { name: english ? "Washington, United States" : "Washington, Estados Unidos", coordinates: [38.90, -77.04] },
    tanzania: { name: "Tanzania", coordinates: [-6.37, 34.89] }
  };
  const map = L.map('map', { scrollWheelZoom: false, maxZoom: 18 });
  map.fitBounds(Object.values(places).map(place => place.coordinates), { padding: [30, 30], maxZoom: 3 });
  const background = map.createPane('world-background');
  background.style.zIndex = '190';
  map.getContainer().style.backgroundColor = '#dbeaf0';
  L.geoJSON(fondoMundial, {
    pane: 'world-background',
    interactive: false,
    attribution: '<a href="https://www.naturalearthdata.com/">Natural Earth</a>',
    style: { color: '#7c8f86', weight: 1, fillColor: '#e5e7d8', fillOpacity: 1 }
  }).addTo(map);
  status.textContent = english ? 'The map is available with a simplified world background.' : 'Mapa disponible con un fondo mundial simplificado.';

  const openedAsFile = location.protocol === 'file:';
  if (!openedAsFile) {
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      referrerPolicy: 'strict-origin-when-cross-origin',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    let loadedStreetTile = false;
    tiles.once('tileload', () => {
      loadedStreetTile = true;
      status.textContent = english ? 'Street map available. Zoom in to see more detail.' : 'Mapa de calles disponible. Acercá el mapa para ver más detalles.';
    });
    tiles.once('load', () => {
      if (loadedStreetTile) return;
      status.textContent = english ? 'The street map is unavailable. ' : 'El fondo de calles no pudo cargarse. ';
      const link = document.createElement('a');
      link.href = 'https://www.openstreetmap.org/#map=14/-34.57/-59.11';
      link.textContent = english ? 'View Luján on OpenStreetMap' : 'Ver Luján en OpenStreetMap';
      status.append(link);
    });
    tiles.addTo(map);
  }
  const markers = {};
  function icon(selected, origin) {
    return L.divIcon({ className: 'atlas-marker' + (origin ? ' origin' : '') + (selected ? ' selected' : ''), html: '<span></span>', iconSize: [24, 24], iconAnchor: [12, 12] });
  }
  for (const [key, place] of Object.entries(places)) {
    markers[key] = L.marker(place.coordinates, { icon: icon(false, key === 'lujan'), title: place.name, alt: place.name, keyboard: true })
      .addTo(map).bindTooltip(place.name).on('click', event => showCase(key, event.target.getElement()));
  }
  window.selectMapCase = key => {
    for (const [id, marker] of Object.entries(markers)) marker.setIcon(icon(id === key, id === 'lujan'));
  };
  // Sin zoom automático: elegir una historia no altera la escala de la vista.
})();
