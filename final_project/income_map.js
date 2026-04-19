var income_map = L.map('map-income', {
    scrollWheelZoom: false,
    center: [49.206944, -122.911111],
    zoom: 11
})

// MAPTILER API FOR CUSTOM STYLING
const inc_mtLayer = L.maptiler.maptilerLayer({
    apiKey: apikey(),
    style: L.maptiler.MapStyle.DATAVIZ.LIGHT
}).addTo(income_map);

var inc_boundries = [];
var inc_boundriesGroup = L.layerGroup().addTo(income_map);


var inc_year_slider = document.getElementById('income_years_slider');

var inc_bounds = L.geoJSON(null);

var city_income = [
    {name: 'City of Vancouver', '2001': 42026, '2006': 47299, '2011': 56113, '2016': 65327, '2021': 82000},
    // {name: 'City of Richmond', '2001': null, '2006': null, '2011': null, '2016': null, '2021': null},
    // {name: 'City of Surrey', '2001': null, '2006': null, '2011': null, '2016': null, '2021': null},
    {name: 'City of Burnaby', '2001': 44754, '2006': 50205, '2011': 56136, '2016': 64737, '2021': 83000},
    {name: 'City of New Westminster', '2001': 40784, '2006': 48773, '2011': 54664, '2016': 64695, '2021': 82000},
    {name: 'City of Coquitlam', '2001': 52657, '2006': 59294, '2011': 67787, '2016': 74383, '2021': 92000},
    {name: 'City of Port Coquitlam', '2001': 59926, '2006': 65731, '2011': 72563, '2016': 84096, '2021': 102000},
    {name: 'City of Port Moody', '2001': 64932, '2006': 74527, '2011': 79918, '2016': 92922, '2021': 115000},
]

function setupCityIncFeatures(feature, layer){
    var cityObj = city_income.filter(city => {return (city.name == feature.properties.FullName)});
    if(cityObj.length == 0) {layer.bindPopup(`<h3>${feature.properties.FullName}</h3><p>undef</p>`); return; }
    var inc = cityObj[0][`${inc_year_slider.value}`];
    layer.bindPopup(`<h3>${feature.properties.FullName}</h3><h4>Income: <span style="font-weight: 500; color: #008A07">$${inc}</span></h4>`);

    var min = 9999999;
    var max = 0;
    
    city_income.forEach(city => {
        if(city[inc_year_slider.value] > max) max = city[inc_year_slider.value];
        if(city[inc_year_slider.value] < min) min = city[inc_year_slider.value];
    });

    layer.setStyle({
        fillOpacity: (inc/(min+max))
    })
}
function addCities_inc(){
    fetch(boundriesAPI_URL).then(response => {
        if(!response.ok) return;
        return response.json();
    }).then(data => {
        L.geoJSON(data, {
            filter: feature => {
                return metroVanCities.includes(feature.properties.FullName);
            },
            style: feature => {
                return {color: `rgb(122, 219, 115)`}
            },
            onEachFeature: setupCityIncFeatures
        }).addTo(inc_boundriesGroup);
    })
}

addCities_inc(); 

inc_year_slider.oninput = function (){
    inc_boundriesGroup.eachLayer(layer => {
        inc_boundriesGroup.removeLayer(layer);
    })

    addCities_inc();
}
