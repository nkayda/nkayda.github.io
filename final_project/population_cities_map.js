var pop_map = L.map('cities_pop_map', {
    scrollWheelZoom: false,
    center: [49.206944, -122.911111],
    zoom: 11
})

// MAPTILER API FOR CUSTOM STYLING
const pop_mtLayer = L.maptiler.maptilerLayer({
    apiKey: apikey(),
    style: L.maptiler.MapStyle.DATAVIZ.LIGHT
}).addTo(pop_map);

var boundries = [];
var boundriesGroup = L.layerGroup().addTo(pop_map);

var boundriesAPI_URL = 'https://services6.arcgis.com/56eqCzQ5SZhBaDST/arcgis/rest/services/Administrative_Boundaries/FeatureServer/10/query?where=1%3D1&outFields=MunNum,FullName,Shape__Area,Shape__Length&outSR=4326&f=geojson'

var metroVanCities = ['City of Vancouver', 'City of Burnaby', 'City of Richmond', 'City of New Westminster', 'City of Coquitlam', 'City of Port Coquitlam', 'City of Poort Moody', 'City of Surrey']
const hexChars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
  ];


var city_bounds = L.geoJSON(null);

fetch(boundriesAPI_URL).then(response => {
    // console.log(response);
    if(!response.ok) return;
    return response.json();
}).then(data => {
    console.log(data);
    L.geoJSON(data, {
        filter: feature => {
            return metroVanCities.includes(feature.properties.FullName);
        },
        style: feature => {
            return {color: `#${hexChars[Math.floor(Math.random()*16)]}${hexChars[Math.floor(Math.random()*16)]}${hexChars[Math.floor(Math.random()*16)]}${hexChars[Math.floor(Math.random()*16)]}${hexChars[Math.floor(Math.random()*16)]}${hexChars[Math.floor(Math.random()*16)]}`}
        },
    }).bindPopup(layer => {
        // if(metroVanCities.includes(layer.feature.properties.FullName)) {
        return layer.feature.properties.FullName;
        // }
    }).addTo(boundriesGroup);
})
