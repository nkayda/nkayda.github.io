var incmap = L.map('incomemap', {
    scrollWheelZoom: false,
    center: [49.206944, -122.911111],
    zoom: 11
});

// MAPTILER API FOR CUSTOM STYLING
const FSA_pop_mtLayer = L.maptiler.maptilerLayer({
    apiKey: apikey(),
    style: L.maptiler.MapStyle.DATAVIZ.LIGHT
}).addTo(incmap);

var FSA_boundries = [];
var FSA_boundriesGroup = L.layerGroup().addTo(incmap);

var FSA_bounds = L.geoJSON(null);

var inc_year_slider = document.getElementById('income_census_slider');

var geoLayer;
var incomeLookup = {};

function normalizeID(val) {
    return String(val).trim();
}
async function loadCSV(year) {
    
    incomeLookup = {};
    const response = await fetch(`datasets/income-${year}.csv`);
    const text = await response.text();

    const rows = text.split('\n');

    rows.slice(1).forEach(row => {
        if (!row.trim()) return;

        const cols = row.split(',');

        const id = normalizeID(cols[0]);
        const income = parseFloat(cols[1]);

        if (id && !isNaN(income)) {
            incomeLookup[id] = income;
        }
    });
}

async function loadGeoJSON(year) {
    const response = await fetch(`datasets/income-${year}.geojson`);
    return await response.json();
}

// getColor returns a colour based on income which is normalized with inflation.
function getColor(income, year) {
    if (!income) return '#a3a3a3';

    // let modifier;

    console.log("YEAR: ", year)

    const incomeMultipliers = {
        2001 : 1,
        2006 : 0.9,
        2011 : 0.83,
        2016 : 0.7,
        2021 : 0.58
    };

    intYear = parseInt(year, 10);

    const modifier = incomeMultipliers[intYear] ?? 1;
    const normalizedIncome =  income * modifier;

    return normalizedIncome > 70000 ? '#2126ae' :
           normalizedIncome > 60000 ? '#007ee5' :
           normalizedIncome > 55000 ? '#50B8F9' :
           normalizedIncome > 50000 ? '#90F8FF' :
           normalizedIncome > 45000 ? '#7EFFDD' :
           normalizedIncome > 40000 ? '#AFFF98' :
                             '#f2ff90';
}

function styleFeature(feature, year) {
    const id = normalizeID(feature.properties.id);
    const income = incomeLookup[id];

    return {
        color: '#ffffff',
        weight: 0.5,
        fillColor: getColor(income, year),
        fillOpacity: income ? 0.5 : 0
    };
}

function onEachFeature(feature, layer) {
    const id = normalizeID(feature.properties.id);
    const income = incomeLookup[id];

    layer.bindPopup(`
        <h4>Median Household </br> Income in ${intYear}:</h4>
         <h5 >$${income ? income.toLocaleString() : 'N/A'}</h>
    `);
   
}

async function render(year) {
    await loadCSV(year);
    const geoData = await loadGeoJSON(year);
    if (geoLayer) {
        incmap.removeLayer(geoLayer);
    }
    geoLayer = L.geoJSON(geoData, {
        // Closure to pass in the year
        style: function(feature) {
            return styleFeature(feature, year);
        },
        onEachFeature: onEachFeature
    }).addTo(incmap);
}


inc_year_slider.oninput = function () {
    render(this.value);
};

render(2001);