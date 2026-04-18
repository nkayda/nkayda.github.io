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

fetch('./datasets/TEST.geojson')
    .then(response => {
        // console.log(response);
        if(!response.ok) return;
        return response.json();
    }).then(data => {
        // console.log(data);
        L.geoJSON(data, {
            filter: feature => {
                if(feature.properties.PRNAME == "British Columbia / Colombie-Britannique") {
                    console.log(feature);
                    return true;
                }
            },
            style: feature => {
                switch (feature.properties.CFSAUID){
                    case 'V5R' :{
                        return {color: `#088`, opacity: 0.8, fillColor: 'rgb(136, 0, 0)', fillOpacity: 0.9}
                    }
                    default :{
                        return {color: `#088`, opacity: 0.8, fillColor: '#088', fillOpacity: 0.9}
                    }
                }
                
            },
        }).bindPopup(layer => {
            return layer.feature.properties.PRNAME;
        }).addTo(FSA_boundriesGroup);
    })
