// ============================================
// Havenly — Mapbox Dark Theme Integration
// ============================================

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: listing.geometry.coordinates,
    zoom: 9,
});

// Add navigation controls
map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// Custom cyan marker
const marker = new mapboxgl.Marker({ color: "#00D8FF" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl
            .Popup({ offset: 25, className: 'havenly-popup' })
            .setHTML(
                `<div style="font-family: 'Poppins', sans-serif;">
                    <h4 style="margin: 0 0 8px 0; font-size: 1rem; font-weight: 600; color: #fff;">${listing.title}</h4>
                    <p style="margin: 0; font-size: 0.85rem; color: rgba(255,255,255,0.7);">Exact location will be provided after booking</p>
                </div>`
            )
    )
    .addTo(map);