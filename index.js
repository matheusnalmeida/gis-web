window.onload = function(){
    let map = L.map('map').setView([-12.89021, -50.181427], 5);
    let osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    });//.addTo(map);

    googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });

    googleSat.addTo(map);

    addPopUp(map);

    let shpEspessura = loadShapefile(map, './data/espessura.zip');
    let shpLimiteProvincias = loadShapefile(map, './data/limite_provincias.zip');

    var baseMaps = {
        "OpenStreetMap": osm,
        "Satellite": googleSat
    };

    var overlays = {
            "Espessura": shpEspessura,
            "LimiteProvincias": shpLimiteProvincias
        };

    L.control.layers(baseMaps,overlays).addTo(map);
}

let loadShapefile = (map, path) => {
    let shpfile = new L.Shapefile(path, {
        onEachFeature: function(feature, layer) {
            if (feature.properties) {
                layer.bindPopup(Object.keys(feature.properties).map(function(k) {
                    if(k === '__color__'){
                        return;
                    }
                    return k + ": " + feature.properties[k];
                }).join("<br />"), {
                    maxHeight: 200
                });
            }
        },
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                opacity: 1,
                fillOpacity: 0.7,
                color: '#783c00',
                radius: 5
            });
        },
        /*style: function(feature) {
            return {
                opacity: 1,
                fillOpacity: 0.7,
                radius: 6,
                color: 'red'
            }
        }*/
    });
    shpfile.addTo(map);

    shpfile.once("data:loaded", function() {
        console.log("finished loaded shapefile");
    });

    return shpfile;
}

let addPopUp = (map) => {
    let popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }

    map.on('click', onMapClick);
}