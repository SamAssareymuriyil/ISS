mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtYWJyYWhhbSIsImEiOiJja21qdXhyZ20wdjM1Mm9zN2ZoMndncGExIn0.9Q_7Z9ModTw0kgHBUxg08Q';

function setupMap(center){
    let map = new mapboxgl.Map({
        container: "map",
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: 3
    })

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav,'top-right')

    let geojson = {
        type: 'FeatureCollection',
        features: [{
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: center
        },
        properties: {
            title: 'ISS',
            description: 'The current location of the international space station! ' + '(' + center + ')'
        }
        }]
    };

    geojson.features.forEach(function(marker) {
        var el = document.createElement('div');
        el.className = 'marker';
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
            .addTo(map);
    });
}

function getPos(){
    fetch('https://api.wheretheiss.at/v1/satellites/25544')
    .then(res => res.json())
    .then((out) => {
        console.log(out.latitude, out.longitude)
        setupMap([out.longitude, out.latitude])
    })
    .catch(err => { throw err });
}

function repeat(){
    getPos()
    setTimeout(repeat, 15000);
}

repeat();