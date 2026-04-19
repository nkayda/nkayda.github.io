var FSA_pop_map = L.map('FSA_pop_map', {
    scrollWheelZoom: false,
    center: [49.206944, -122.911111],
    zoom: 11
})

// MAPTILER API FOR CUSTOM STYLING
const FSA_pop_mtLayer = L.maptiler.maptilerLayer({
    apiKey: apikey(),
    style: L.maptiler.MapStyle.DATAVIZ.LIGHT
}).addTo(FSA_pop_map);

var FSA_boundries = [];
var FSA_boundriesGroup = L.layerGroup().addTo(FSA_pop_map);

var FSA_bounds = L.geoJSON(null);

const Van_FSAs = [
    'V5D','V5F','V5I','V5I','V5K','V5L','V5M','V5N','V5O','V5P','V5Q','V5R','V5S','V5T','V5U','V5V','V5W','V5X','V5Y','V5Z',
    'V6A','V6B','V6C','V6D','V6E','V6F','V6G','V6H','V6I','V6J','V6H','V6I','V6J','V6K','V6L','V6M','V6N','V6O','V6P','V6Q','V6R','V6S','V6T','V6U','V6Z'
]
const Rich_FSAs = [
    'V6V','V6W','V6X','V6Y',
    'V7A','V7B','V7C','V7E'
]
const Burn_FSAs = [
    'V3N',
    'V5A','V5B','V5C','V5E','V5G','V5H','V5J',
]

const NewWest_FSAs = [
    'V3M', 'V3L'
]

const Coquit_FSAs = [
    'V3B','V3C','V3E','V3K','V3J'
]

var census_geo_2016 = fetch('https://www12.statcan.gc.ca/rest/census-recensement/CR2016Geo.json?lang=E&geos=FSA&cpt=59')
    .then(response => {
        if(!response.ok) return;
        return response.json();
    })

var census_2016 = fetch('https://www12.statcan.gc.ca/rest/census-recensement/CPR2016.json?lang=E&dguid=2016A0011V3L&topic=13&notes=0&stat=0')
    .then(response => {
        if(!response.ok) return;
        // console.log(response);
        return response.json();
        return res.slice(2);
    }).then(data => {
        console.log(data);
    })


async function getPop(CFSAUID) {
    var pop = await fetch(`https://www12.statcan.gc.ca/rest/census-recensement/CPR2016.json?lang=E&dguid=2016A0011${CFSAUID}&topic=13&notes=0&stat=0`)
        .then(response => {
            if(!response.ok) return;
            return response.json();
        }).then(data => {
            return data.DATA[0][13];
        }).then(pop => {
            return pop;
        })
    return pop;
}

async function setupFeature(feature, layer) {
    var pop = await getPop(feature.properties.CFSAUID);
    layer.bindPopup(`<h3>${feature.properties.CFSAUID}</h3><p>Population: ${pop}</p>`);
    layer.setStyle({
        fillOpacity: pop/60000
    })
}

async function setupMap() {
    var data = await fetch('./datasets/TEST.geojson')
        .then(response => {
            if(!response.ok) return;
            return response.json();
        })

    console.log(data);
        
    // L.geoJSON(data, {
    //     filter: feature => {
    //         if(feature.properties.PRNAME == "British Columbia / Colombie-Britannique") {
    //             // console.log(feature);
    //             return true;
    //         }
    //     },
    //     style: feature => {
    //         switch (true){
    //             case Van_FSAs.includes(feature.properties.CFSAUID) :{
    //                 return {color: `rgb(136, 0, 0)`, opacity: 0.8, fillColor: 'rgb(136, 0, 0)', fillOpacity: 0.9}
    //             }
    //             case Rich_FSAs.includes(feature.properties.CFSAUID):{
    //                 return {color: `rgb(78, 249, 255)`, opacity: 0.8, fillColor: 'rgb(78, 249, 255)', fillOpacity: 0.9}
    //             }
    //             case Burn_FSAs.includes(feature.properties.CFSAUID):{
    //                 return {color: `rgb(172, 78, 255)`, opacity: 0.8, fillColor: 'rgb(172, 78, 255)', fillOpacity: 0.9}
    //             }
    //             case NewWest_FSAs.includes(feature.properties.CFSAUID):{
    //                 return {color: `rgb(156, 227, 255)`, opacity: 0.8, fillColor: 'rgb(156, 227, 255)', fillOpacity: 0.9}
    //             }
    //             case Coquit_FSAs.includes(feature.properties.CFSAUID):{
    //                 return {color: `rgb(73, 196, 102)`, opacity: 0.8, fillColor: 'rgb(73, 196, 102)', fillOpacity: 0.9}
    //             }
    //             default :{
    //                 return {color: `#088`, opacity: 0.8, fillColor: '#088', fillOpacity: 0.9}
    //             }
    //         }
            
    //     },
    // }).bindPopup(async (layer) => {
    //     var population = await getPop(layer.feature.properties.CFSAUID);
    //     return `<p>${layer.feature.properties.CFSAUID}</p><p>${population}</p>`
    // }).addTo(FSA_boundriesGroup);

    var geoMap = L.geoJSON(data,{
        onEachFeature: setupFeature,
        style: feature => {
            switch (true){
                case Van_FSAs.includes(feature.properties.CFSAUID) :{
                    return {color: `rgb(136, 0, 0)`, opacity: 0.8, fillColor: 'rgb(136, 0, 0)', fillOpacity: 0}
                }
                case Rich_FSAs.includes(feature.properties.CFSAUID):{
                    return {color: `rgb(78, 249, 255)`, opacity: 0.8, fillColor: 'rgb(78, 249, 255)', fillOpacity: 0}
                }
                case Burn_FSAs.includes(feature.properties.CFSAUID):{
                    return {color: `rgb(172, 78, 255)`, opacity: 0.8, fillColor: 'rgb(172, 78, 255)', fillOpacity: 0}
                }
                case NewWest_FSAs.includes(feature.properties.CFSAUID):{
                    return {color: `rgb(156, 227, 255)`, opacity: 0.8, fillColor: 'rgb(156, 227, 255)', fillOpacity: 0}
                }
                case Coquit_FSAs.includes(feature.properties.CFSAUID):{
                    return {color: `rgb(73, 196, 102)`, opacity: 0.8, fillColor: 'rgb(73, 196, 102)', fillOpacity: 0}
                }
                default :{
                    return {color: `#088`, opacity: 0.8, fillColor: '#088', fillOpacity: 0.9}
                }
            }
            
        },
    }).addTo(FSA_pop_map);
}

setupMap();