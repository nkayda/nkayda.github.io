var pop_map = L.map('map_city_population', {
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

var metroVanCities = ['City of Vancouver', 'City of Burnaby', 'City of Richmond', 'City of New Westminster', 'City of Coquitlam', 'City of Port Coquitlam', 'City of Port Moody', 'City of Surrey']

var cities_year_slider = document.getElementById('cities_years_slider');

var city_bounds = L.geoJSON(null);

var city_populations = [
    {name: 'City of Vancouver', '2001': 572394, '2006': 600281, '2011': 622467, '2016': 664913, '2021': 696031, coords: [49.260833, -123.113889]},
    {name: 'City of Richmond', '2001': 171269, '2006': 180313, '2011': 194973, '2016': 207610, '2021': 221178, coords: [49.166667, -123.133333]},
    {name: 'City of Surrey', '2001': 363639, '2006': 409229, '2011': 482063, '2016': 543495, '2021': 597141, coords:[49.16547389937119, -122.81818665235177]},
    {name: 'City of Burnaby', '2001': 202682, '2006': 210145, '2011': 229632, '2016': 244567, '2021': 261800, coords: [49.266667, -122.966667]},
    {name: 'City of New Westminster', '2001': 57222, '2006': 60688, '2011': 67949, '2016': 74761, '2021': 82943, coords: [49.206944, -122.911111]},
    {name: 'City of Coquitlam', '2001': 117942, '2006': 118650, '2011': 130540, '2016': 146146, '2021': 155554, coords:[49.29861288226988, -122.7462376038563]},
    {name: 'City of Port Coquitlam', '2001': 53171, '2006': 54028, '2011': 57013, '2016': 61522, '2021': 64205, coords:[49.23417004952855, -122.78388193771077]},
    {name: 'City of Port Moody', '2001': 24958, '2006': 28626, '2011': 33900, '2016': 35065, '2021': 34987, coords:[49.2985952911707, -122.86175954847108]},
]

function setupCityFeatures(feature, layer){
    var cityObj = city_populations.filter(city => {return (city.name == feature.properties.FullName)});
    if(cityObj.length == 0) {layer.bindPopup(`<h3>${feature.properties.FullName}</h3><p>undef</p>`); return; }
    var pop = cityObj[0][`${cities_year_slider.value}`];
    // layer.bindPopup(`<h3>${feature.properties.FullName}</h3><h4>Population: <span style="font-weight: 500; color: #008A07">${pop}</span></h4>`, {permanent: true});

    var min = 24958;
    var max = 696031;
    
    // city_populations.forEach(city => {
    //     if(city[cities_year_slider.value] > max) max = city[cities_year_slider.value];
    //     if(city[cities_year_slider.value] < min) min = city[cities_year_slider.value];
    // });
    // console.log(`${cities_year_slider.value} - ${min}:${max}`)

    layer.setStyle({
        fillOpacity: ((pop-min)/(max-min))
    })

    
}
function addCities(){
    fetch(boundriesAPI_URL).then(response => {
        if(!response.ok) return;
        return response.json();
    }).then(data => {
        L.geoJSON(data, {
            filter: feature => {
                return metroVanCities.includes(feature.properties.FullName);
            },
            style: feature => {
                return {color: `rgb(78, 98, 255)`}
            },
            onEachFeature: setupCityFeatures
        }).addTo(boundriesGroup);
    })
}

addCities(); 
city_populations.forEach(city => {
    L.circle(city.coords, {radius: 200, color: 'white', fillColor: 'white', fillOpacity: 1, weight: 5})
        .bringToFront().bindTooltip(`<h4>${city.name} <br> <span style="font-weight: 400; font-size: .8rem;">${cities_year_slider.value} Population: </span></h4><h5>${city[`${cities_year_slider.value}`]}</h5>`, { permanent: true })
        .addTo(boundriesGroup)
})

cities_year_slider.oninput = function (){
    boundriesGroup.eachLayer(layer => {
        boundriesGroup.removeLayer(layer);
    })

    addCities();

    city_populations.forEach(city => {
        L.circle(city.coords, {radius: 200, color: 'white', fillColor: 'white', fillOpacity: 1, weight: 5})
            .bindTooltip(`<h4>${city.name} <br> <span style="font-weight: 400; font-size: .8rem;">${cities_year_slider.value} Population: </span></h4><h5>${city[`${cities_year_slider.value}`]}</h5>`, { permanent: true })
            .addTo(boundriesGroup);
    })
}
