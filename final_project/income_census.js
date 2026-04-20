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

    renderTransitOverlay(year);
}


inc_year_slider.oninput = function () {
    render(this.value);
};


var transitRouteLines = L.layerGroup().addTo(incmap);
var transitStationMarkers = L.layerGroup().addTo(incmap);

render(2001);

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function(map) {
    var div = L.DomUtil.create('div');
    div.innerHTML = `
        <div style="background: white; border-radius: 0.5rem; padding: 1rem; font-family: sans-serif; ">
            <p style="font-size: 1rem; font-weight: 500;">Median household income</p>
             <div style="display: flex; flex-direction: row; align-items: flex-start; gap: 1rem;">
            <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem;">
                <div style="min-width: 12rem; width: 100%; height: 1rem; border-radius: 0.25rem; opacity: 0.5; background: linear-gradient(to right, #2126ae, #007ee5, #50B8F9, #90F8FF, #7EFFDD, #AFFF98, #f2ff90); flex-shrink: 0;"></div>
                <div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%; color: #8c8c8c;">
                    <span style="font-size: 0.8rem">Higher</span>
                    <span style="font-size: 0.8rem">Lower</span>
                </div>
            </div>
            <div style="display: flex; flex-direction:column; align-items: center; gap: 0.5rem; ">
                <div style="width: 1rem; height: 1rem; border-radius: 0.25rem; background: #c6c6c6; flex-shrink: 0;"></div>
                <span style="font-size: 0.8rem;">No data</span>
            </div>
            </div>
        </div>
    `;
    return div;
};

legend.addTo(incmap);

function addStationToIncMap(station, year) {
    var fill = 'white';
    var size = 6;
    if(station.openDate == year) {fill = '#7bca7f'; size = 10;}
    var marker = L.circleMarker([station.x, station.y], {radius: size, color: station.color, fillColor: fill, fillOpacity: 1, weight: 5}).addTo(transitStationMarkers);
    marker.bindPopup(`<h3>${station.name}</h3> <h4>Opened in <span style="font-weight: 500; color: #008A07">${station.openDate}</span></h4>`);
}
 
function renderTransitOverlay(year) {
    transitRouteLines.clearLayers();
    transitStationMarkers.clearLayers();
 
    /*  ///     EXPO LINE      ///*/
    var expoStations = [
        {name:'Waterfront Station', openDate: 1914, x: 49.285833, y: -123.111667, color: '#005DAA'},
        {name:'Burrard Station', openDate: 1985, x: 49.285616, y: -123.120157, color: '#005DAA'},
        {name:'Granville Station', openDate: 1985, x: 49.28275, y: -123.116639, color: '#005DAA'},
        {name:'Stadium–Chinatown Station', openDate: 1990, x: 49.279444, y: -123.109444, color: '#005DAA'},
        {name:'Main Street–Science World Station', openDate: 1985, x: 49.273114, y: -123.100348, color: '#005DAA'},
        {name:'Commercial–Broadway Station', openDate: 1985, x: 49.2625, y: -123.068889, color: '#005DAA'},
        {name:'Nanaimo Station', openDate: 1985, x: 49.248184, y: -123.05564, color: '#005DAA'},
        {name:'29th Avenue Station', openDate: 1985, x: 49.244084, y: -123.045931, color: '#005DAA'},
        {name:'Joyce–Collingwood Station', openDate: 1985, x: 49.23835, y: -123.031704, color: '#005DAA'},
        {name:'Patterson Station', openDate: 1985, x: 49.22967, y: -123.012376, color: '#005DAA'},
        {name:'Metrotown Station', openDate: 1985, x: 49.225463, y: -123.003182, color: '#005DAA'},
        {name:'Royal Oak Station', openDate: 1985, x: 49.220004, y: -122.988381, color: '#005DAA'},
        {name:'Edmonds Station', openDate: 1985, x: 49.212054, y: -122.959226, color: '#005DAA'},
        {name:'22nd Street Station', openDate: 1985, x: 49.2, y: -122.949167, color: '#005DAA'},
        {name:'New Westminster Station', openDate: 1985, x: 49.201354, y: -122.912716, color: '#005DAA'},
        {name:'Columbia Station', openDate: 1985, x: 49.20476, y: -122.906161, color: '#005DAA'},
        {name:'Scott Road Station', openDate: 1990, x: 49.204444, y: -122.874167, color: '#005DAA'},
        {name:'Gateway Station', openDate: 1994, x: 49.198945, y: -122.850559, color: '#005DAA'},
        {name:'Surrey Central Station', openDate: 1994, x: 49.189473, y: -122.847871, color: '#005DAA'},
        {name:'King George Station', openDate: 1994, x: 49.1827, y: -122.8446, color: '#005DAA'},
    ]
    var expoRoute = [];
    expoStations.forEach((station) => {
        if(station.openDate <= year) {
            expoRoute.push([station.x, station.y]);
            addStationToIncMap(station, year);
        }
    })
    if(expoRoute.length > 1) L.polyline(expoRoute, {color: '#005DAA', weight: 7}).addTo(transitRouteLines);
 
    var expoStations_extension;
    if(year < 2016) { expoStations_extension = [
        {name:'Columbia Station', openDate: 1985, x: 49.20476, y: -122.906161, color: '#005DAA'},
        {name:'Sapperton Station', openDate: 2002, x: 49.22443, y: -122.88964, color: '#FFD200'},
        {name:'Braid Station', openDate: 2002, x: 49.23322, y: -122.88283, color: '#FFD200'},
        {name:'Lougheed Town Centre Station', openDate: 2002, x: 49.24846, y: -122.89702, color: '#FFD200'},
        {name:'Production Way-University Station', openDate: 2002, x: 49.25337, y:-122.91815, color: '#FFD200'},
    ]}
    else { expoStations_extension = [
        {name:'Columbia Station', openDate: 1985, x: 49.20476, y: -122.906161, color: '#005DAA'},
        {name:'Sapperton Station', openDate: 2002, x: 49.22443, y: -122.88964, color: '#005DAA'},
        {name:'Braid Station', openDate: 2002, x: 49.23322, y: -122.88283, color: '#005DAA'},
        {name:'Lougheed Town Centre Station', openDate: 2002, x: 49.24846, y: -122.89702, color: '#FFD200'},
        {name:'Production Way-University Station', openDate: 2002, x: 49.25337, y:-122.91815, color: '#FFD200'},
    ]}
 
    var expoRoute_extension = [];
    expoStations_extension.forEach((station) => {
        expoRoute_extension.push([station.x, station.y]);
    })
    if(year < 2016 && year >= 2002) {
        L.polyline(expoRoute_extension, {color: '#FFD200', weight: 5}).addTo(transitRouteLines);
    }
    if(year >= 2016) {
        L.polyline(expoRoute_extension, {color: '#005DAA', weight: 7}).addTo(transitRouteLines);
    }
    // Station Markers
    for (let i = 0; i < expoStations_extension.length; i++) {
        var currMarkerData = expoStations_extension[i];
        if(currMarkerData.openDate <= year){
             addStationToIncMap(currMarkerData, year);
        }
    }
 
    /*  ///     MILLENNIUM LINE      ///*/
    var millStations = [

        // opened in 2002
        {name:'VCC–Clark', openDate: 2006, x: 49.265753, y:-123.078825, color: '#FFD200'},
        {name:'Commercial–Broadway', openDate: 2002, x: 49.2625, y: -123.068889, color: '#FFD200'},
        {name:'Renfrew Station', openDate: 2002, x: 49.258889, y: -123.045278, color: '#FFD200'},
        {name:'Rupert Station', openDate: 2002, x: 49.260833, y: -123.032778, color: '#FFD200'},
        {name:'Gilmore', openDate: 2002, x: 49.26489, y: -123.01351, color: '#FFD200'},
        {name:'Brentwood Town Centre', openDate: 2002, x: 49.26633, y: -123.00163, color: '#FFD200'},
        {name:'Holdom Station', openDate: 2002, x: 49.26469, y: -122.98222, color: '#FFD200'},
        {name:'Sperling-Burnaby Lake Station', openDate: 2002, x: 49.25914, y:-122.96391, color: '#FFD200'},
        {name:'Lake City Way', openDate: 2003, x: 49.25458, y:-122.93903, color: '#FFD200'},
        {name:'Production Way-University Station', openDate: 2002, x: 49.25337, y:-122.91815, color: '#FFD200'},
        {name:'Lougheed Town Centre Station', openDate: 2002, x: 49.24846, y:-122.89702, color: '#FFD200'},
        
        // opened in 2016 – Evergreen Extension
        {name:'Burquitlam Station', openDate: 2016, x:49.261389, y:-122.889722, color: '#FFD200'},
        {name:'Moody Centre Station', openDate: 2016, x: 49.27806, y: -122.84579, color: '#FFD200'},
        {name:'Inlet Centre Station', openDate: 2016, x: 49.277222, y: -122.827778, color: '#FFD200'},
        {name:'Coquitlam Central Station', openDate: 2016, x:49.273889, y: -122.8, color: '#FFD200'},
        {name:'Lincoln Station', openDate: 2016, x: 49.280425, y: -122.793915, color: '#FFD200'},
        {name:'Lafarge Lake–Douglas Station', openDate: 2016, x: 49.285556, y: -122.791667, color: '#FFD200'},
    ]
    // Route polyLine
    var millRoute = [];
    millStations.forEach((station) => {
        if(station.openDate > year) return;
        millRoute.push([station.x, station.y]);
    })
    if(year >= 2002) L.polyline(millRoute, {color: '#FFD200', weight: 5}).addTo(transitRouteLines);
    for (let i = 0; i < millStations.length; i++) {
        var currMarkerData = millStations[i];
        if(currMarkerData.openDate <= year) addStationToIncMap(currMarkerData, year);
    }
 
    /*  ///     CANADA LINE      ///*/
    const YVR = {name:'YVR-Airport Station', openDate: 2009, x: 49.193056, y: -123.158056, color: '#009AC8', l_node: null, r_node: null};
    const Sea_Island = {name:'Sea Island Center', openDate: 2009, x: 49.193056, y: -123.158056, color: '#009AC8', l_node: YVR, r_node: null};
    const Templeton = {name:'Templeton', openDate: 2009, x: 49.196667, y: -123.146389, color: '#009AC8', l_node: Sea_Island, r_node: null};

    const Richmond = {name:'Richmond-Brighouse', openDate: 2009, x: 49.168056, y: -123.136389, color: '#009AC8', l_node: null, r_node: null};
    const Lansdown = {name:'Lansdown', openDate: 2009, x: 49.174722, y: -123.136389, color: '#009AC8', l_node: Richmond, r_node: null};
    const Aberdeen = {name:'Aberdeen', openDate: 2009, x: 49.183889, y: -123.136389, color: '#009AC8', l_node: Lansdown, r_node: null};
    const Capstan = {name:'Capstan', openDate: 2024, x: 49.189254, y: -123.131677, color: '#009AC8', l_node: Aberdeen, r_node: null};

    const Bridgeport = {name:'Bridgeport', openDate: 2009, x: 49.195556, y: -123.126111, color: '#009AC8', l_node: Templeton, r_node: Capstan};
    const MarineDrive = {name:'Marine Drive', openDate: 2009, x: 49.209722, y: -123.116944, color: '#009AC8', l_node: Bridgeport, r_node: null};
    const Langara = {name:'Langara-49th Avenue', openDate: 2009, x: 49.226389, y: -123.116111, color: '#009AC8', l_node: MarineDrive, r_node: null};
    const Oakridge = {name:'Oakridge-41st Avenue', openDate: 2009, x: 49.233056, y: -123.116667, color: '#009AC8', l_node: Langara, r_node: null};
    const KingEdward = {name:'King Edward Station', openDate: 2009, x: 49.249167, y: -123.115833, color: '#009AC8', l_node: Oakridge, r_node: null};
    const Broadway = {name:'Broadway-City Hall', openDate: 2009, x: 49.262778, y: -123.114444, color: '#009AC8', l_node: KingEdward, r_node: null};
    const Olympic = {name:'Olympic Village', openDate: 2009, x: 49.266389, y: -123.115833, color: '#009AC8', l_node: Broadway, r_node: null};
    const Yaletown = {name:'Yaletown-Roundhouse', openDate: 2009, x: 49.27455, y: -123.1219, color: '#009AC8', l_node: Olympic, r_node: null};
    const VCC = {name:'Vancouver City Center', openDate: 2009, x: 49.28202, y: -123.11875, color: '#009AC8', l_node: Yaletown, r_node: null};

    const waterfront = {name:'Waterfront Station', openDate: 1914, x: 49.285833, y: -123.111667, color: '#005DAA', l_node: VCC, r_node: null};


    function add_line_recursive(curStation, prevStation) {
        if(curStation.l_node != null && curStation.l_node.openDate <= year) {
            add_line_recursive(curStation.l_node, curStation);
        }
        if(curStation.l_node != null && curStation.l_node.openDate > year) {
            if(curStation.l_node.l_node != null) add_line_recursive(curStation.l_node.l_node, curStation);
            if(curStation.l_node.r_node != null) add_line_recursive(curStation.l_node.r_node, curStation);
        }
 
        if(curStation.r_node != null && curStation.r_node.openDate <= year) {
            add_line_recursive(curStation.r_node, curStation);
        }
        if(curStation.r_node != null && curStation.r_node.openDate > year) {
            if(curStation.r_node.l_node != null) add_line_recursive(curStation.r_node.l_node, curStation);
            if(curStation.r_node.r_node != null) add_line_recursive(curStation.r_node.r_node, curStation);
        }
        // add polyline
        if(prevStation != null && curStation.openDate <= year) {
            L.polyline([[prevStation.x, prevStation.y],[curStation.x, curStation.y]], {color: curStation.color, weight: 5}).addTo(transitRouteLines);
        }
 
        if(curStation.openDate <= year){
            addStationToIncMap(curStation, year);
        }
        return;
    }
 
    if(year >= 2009)add_line_recursive(waterfront, null);
 
    transitRouteLines.eachLayer(l => l.bringToFront());
    transitStationMarkers.eachLayer(l => l.bringToFront());
}
 