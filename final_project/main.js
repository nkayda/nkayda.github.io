var map = L.map('map', {
    scrollWheelZoom: false,
    center: [49.206944, -122.911111],
    zoom: 11
})

// MAPTILER API FOR CUSTOM STYLING
const mtLayer = L.maptiler.maptilerLayer({
        apiKey: apikey(),
        style: L.maptiler.MapStyle.DATAVIZ.LIGHT
      }).addTo(map);

/*  ///     YEAR SLIDER      ///*/
var yearSlider = document.getElementById("years_slider");
var year = yearSlider.value;

var markers = [];
var stationMarkers = L.layerGroup().addTo(map);

var routeLines = [];
var routeLinesGroup = L.layerGroup().addTo(map);

function addStationToMap(station){
    // console.log(station);
    var fill = 'white';
    var size = 6;
    if(station.openDate == year) {fill = '#7bca7f'; size = 10;}
    var marker = L.circleMarker([station.x, station.y], {radius: size, color: station.color, fillColor: fill, fillOpacity: 1, weight: 5}).addTo(stationMarkers);
    marker.bindPopup(`${station.name} \n ${station.openDate}`);
    markers.push(marker);
}

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
    var coords = [station.x, station.y];
    expoRoute.push(coords);
})
var expoPolyLine = L.polyline(expoRoute, {color: '#005DAA', weight: 7}).addTo(map);

for (let i = 0; i < expoStations.length; i++) {
    var currMarkerData = expoStations[i];
    addStationToMap(currMarkerData);
}

var expoStations_extension;

if(year < 2016) { expoStations_extension = [
    {name:'Columbia Station', openDate: 1985, x: 49.20476, y: -122.906161, color: '#005DAA'},
    {name:'Sapperton Station', openDate: 2002, x: 49.22443, y: -122.88964, color: '#FFD200'},
    {name:'Braid Station', openDate: 2002, x: 49.23322, y: -122.88283, color: '#FFD200'},
    {name:'Lougheed Town Centre Station', openDate: 2002, x: 49.24846, y: -122.89702, color: '#FFD200'},
    {name:'Production Way-University Station', openDate: 2002, x: 49.25337, y:-122.91815, color: '#FFD200'},
]}
else{ expoStations_extension = [
    {name:'Columbia Station', openDate: 1985, x: 49.20476, y: -122.906161, color: '#005DAA'},
    {name:'Sapperton Station', openDate: 2002, x: 49.22443, y: -122.88964, color: '#005DAA'},
    {name:'Braid Station', openDate: 2002, x: 49.23322, y: -122.88283, color: '#005DAA'},
    {name:'Lougheed Town Centre Station', openDate: 2002, x: 49.24846, y: -122.89702, color: '#FFD200'},
    {name:'Production Way-University Station', openDate: 2002, x: 49.25337, y:-122.91815, color: '#FFD200'},
]}

// Route polyLine
var expoRoute_extension = [];
expoStations_extension.forEach((station) => {
    // if(station.openDate > year) return;
    expoRoute_extension.push([station.x, station.y]);
})
var expoPolyLine_extension;
if(year < 2016 && year >= 2002) {
    expoPolyLine_extension = L.polyline(expoRoute_extension, {color: '#FFD200', weight: 5});
    expoPolyLine_extension.addTo(map);
};
if(year >= 2016) {
    expoPolyLine_extension = L.polyline(expoRoute_extension, {color: '#005DAA', weight: 7});
    expoPolyLine_extension.addTo(map);
}

// Station Markers
for (let i = 0; i < expoStations_extension.length; i++) {
    var currMarkerData = expoStations_extension[i];
    if(currMarkerData.openDate <= year){
        addStationToMap(currMarkerData);
    }
}



/*  ///     MILLENNIUM LINE      ///*/
var millStations = [
    // opened in 2006
    {name:'VCC–Clark', openDate: 2006, x: 49.265753, y:-123.078825, color: '#FFD200'},

    // opened in 2002
    {name:'Commercial–Broadway', openDate: 2002, x: 49.2625, y: -123.068889, color: '#FFD200'},
    {name:'Renfrew Station', openDate: 2002, x: 49.258889, y: -123.045278, color: '#FFD200'},
    {name:'Rupert Station', openDate: 2002, x: 49.260833, y: -123.032778, color: '#FFD200'},
    {name:'Gilmore', openDate: 2002, x: 49.26489, y: -123.01351, color: '#FFD200'},
    {name:'Brentwood Town Centre', openDate: 2002, x: 49.26633, y: -123.00163, color: '#FFD200'},
    {name:'Holdom Station', openDate: 2002, x: 49.26469, y: -122.98222, color: '#FFD200'},
    {name:'Sperling-Burnaby Lake Station', openDate: 2002, x: 49.25914, y:-122.96391, color: '#FFD200'},
    {name:'Lake City Way', openDate: 2003, x: 49.25458, y:-122.93903, color: '#FFD200'},
    {name:'Production Way-University Station', openDate: 2002, x: 49.25337, y:-122.91815, color: '#FFD200'},
    {name:'Lougheed Town Centre Station',openDate: 2002, x: 49.24846, y:-122.89702, color: '#FFD200'},

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
    millRoute.push([station.x, station.y])
})
var millPolyLine = L.polyline(millRoute, {color: '#FFD200', weight: 5});


if(year >= 2002) {
    millPolyLine.addTo(map);
}
if(year >= 2016) {

    millRoute = [];
    millStations.forEach((station) => {
        if(station.openDate > year) return;
        millRoute.push([station.x, station.y])
    })
    map.removeLayer(millPolyLine);
    millPolyLine = L.polyline(millRoute, {color: '#FFD200', weight: 5}).addTo(map);
}

// Station Markers
for (let i = 0; i < millStations.length; i++) {
    var currMarkerData = millStations[i];
    if(currMarkerData.openDate <= year){
        addStationToMap(currMarkerData);
    }
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


function add_line_recursive(curStation, prevStation){

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
    if(prevStation != null && curStation.openDate <= year){
        line = L.polyline([[prevStation.x, prevStation.y],[curStation.x, curStation.y]], {color: curStation.color, weight: 5}).addTo(routeLinesGroup);
        routeLines.push(line);
    }
    
    if(curStation.openDate <= year){
        addStationToMap(curStation);
    }

    return;
}

if(year >= 2009) add_line_recursive(waterfront, null);



// When slider changes, updates the displayed ones
yearSlider.oninput = function() {
    year = this.value;

    if(expoPolyLine_extension != undefined) map.removeLayer(expoPolyLine_extension);
    if(year < 2016 && year >= 2002) {
        expoPolyLine_extension = L.polyline(expoRoute_extension, {color: '#FFD200', weight: 5});
        expoPolyLine_extension.addTo(map);

        expoStations_extension = [
            {name:'Columbia Station', openDate: 1985, x: 49.20476, y: -122.906161, color: '#005DAA'},
            {name:'Sapperton Station', openDate: 2002, x: 49.22443, y: -122.88964, color: '#FFD200'},
            {name:'Braid Station', openDate: 2002, x: 49.23322, y: -122.88283, color: '#FFD200'},
            {name:'Lougheed Town Centre Station', openDate: 2002, x: 49.24846, y: -122.89702, color: '#FFD200'},
            {name:'Production Way-University Station', openDate: 2002, x: 49.25337, y:-122.91815, color: '#FFD200'},
        ]
    }
    if(year >= 2016) {
        expoPolyLine_extension = L.polyline(expoRoute_extension, {color: '#005DAA', weight: 7});
        expoPolyLine_extension.addTo(map);

        expoStations_extension = [
            {name:'Columbia Station', openDate: 1985, x: 49.20476, y: -122.906161, color: '#005DAA'},
            {name:'Sapperton Station', openDate: 2002, x: 49.22443, y: -122.88964, color: '#005DAA'},
            {name:'Braid Station', openDate: 2002, x: 49.23322, y: -122.88283, color: '#005DAA'},
            {name:'Lougheed Town Centre Station', openDate: 2002, x: 49.24846, y: -122.89702, color: '#FFD200'},
            {name:'Production Way-University Station', openDate: 2002, x: 49.25337, y:-122.91815, color: '#FFD200'},
        ]
    }

    if(year >= 2002) millPolyLine.addTo(map);
    else map.removeLayer(millPolyLine);

    millRoute = [];
    millStations.forEach((station) => {
        if(station.openDate > year) return;
        millRoute.push([station.x, station.y])
    })
    map.removeLayer(millPolyLine);
    millPolyLine = L.polyline(millRoute, {color: '#FFD200', weight: 5}).addTo(map);

    markers.forEach(marker => {
        stationMarkers.removeLayer(marker);
    });

    expoStations.forEach((station) => {
        if(station.openDate <= year){
            addStationToMap(station);
        }
    });

    for (let i = 0; i < expoStations_extension.length; i++) {
        var currMarkerData = expoStations_extension[i];
        if(currMarkerData.openDate <= year){
            addStationToMap(currMarkerData);
        }
    }
    for (let i = 0; i < millStations.length; i++) {
        var currMarkerData = millStations[i];
        if(currMarkerData.openDate <= year){
            addStationToMap(currMarkerData);
        }
    }

    routeLines.forEach((line) => {
        routeLinesGroup.removeLayer(line);
    })

    add_line_recursive(waterfront);
}

const popvis = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",

    width: 800,
    height: 300,

    data: { url: "datasets/VanPop2001-2025.csv" },

    transform: [
        { filter: "datum.Year != null" },
        { filter: "datum.Year <= 2021" },
        { filter: "datum.Population > 1500000" }
    ],

    mark: {
        type: "line",
        strokeWidth: 4,
        color: "#FFD200",
        point: {
            filled: true,
            size: 100,
            fill: 'white',
            stroke: "#FFD200",
            strokeWidth: 4
        },
    },

    encoding: {
        x: {
            field: "Year",
            type: "ordinal",
            title: "Year",
        },
        y: {
            field: "Population",
            type: "quantitative",
            title: "Population",
            scale: {
                domain: [1900000, 2800000]
            }
        },

        tooltip: [
            { field: "Year", type: "ordinal", title: "Year" },
            { field: "Population", type: "quantitative", title: "Population", format: "," }
        ]
    },
    config: {
        font: "Fira Sans",

        axis: {
            labelFont: "Fira Sans",
            titleFont: "Fira Sans",
            labelFontSize: 12,
            titleFontSize: 16,
            labelColor: "#00355F",
            titleColor: "#00355F",
            grid: true,
            gridColor: "#eeeeee"
        },

    }
};
vegaEmbed("#popvis", popvis
);
