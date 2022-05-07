/* global config */
var initLoad = true;
var layerTypes = {
  'fill': ['fill-opacity'],
  'line': ['line-opacity'],
  'circle': ['circle-opacity', 'circle-stroke-opacity'],
  'symbol': ['icon-opacity', 'text-opacity'],
  'raster': ['raster-opacity'],
  'fill-extrusion': ['fill-extrusion-opacity'],
  'heatmap': ['heatmap-opacity']
};

var alignments = {
  'left': 'lefty',
  'center': 'centered',
  'right': 'righty',
  'full': 'fully'
};


var story = document.getElementById('story');
var features = document.createElement('div');
features.setAttribute('id', 'features');

var header = document.createElement('div');

if (config.title) {
  var titleText = document.createElement('h1');
  titleText.innerText = config.title;
  header.appendChild(titleText);
}

if (config.subtitle) {
  var subtitleText = document.createElement('h2');
  subtitleText.innerText = config.subtitle;
  header.appendChild(subtitleText);
}

if (config.byline) {
  var bylineText = document.createElement('p');
  bylineText.innerText = config.byline;
  header.appendChild(bylineText);
}
if (config.author) {
  var authorText = document.createElement('p');
  authorText.innerText = config.author;
  header.appendChild(authorText);
}


if (config.image) {
  let image = new Image();
  image.src = config.image;
  image.id = "virus_image";
  header.appendChild(image);
}

if (header.innerText.length > 0) {
  header.classList.add(config.theme);
  header.setAttribute('id', 'header');
  story.appendChild(header);
}

config.chapters.forEach((record, idx) => {
  var container = document.createElement('div');
  var chapter = document.createElement('div');

  if (record.title) {
    var title = document.createElement('h3');
    title.innerText = record.title;
    chapter.appendChild(title);
  }

  if (record.image) {
    let image = new Image();
    image.src = record.image;
    chapter.appendChild(image);
  }

  if (record.description) {
    let story = document.createElement('p');
    story.innerHTML = record.description;
    chapter.appendChild(story);
  }

  container.setAttribute('id', record.id);
  container.classList.add('step');
  if (idx === 0) {
    container.classList.add('active');
  }

  chapter.classList.add(config.theme);
  container.appendChild(chapter);
  container.classList.add(alignments[record.alignment] || 'centered');
  if (record.hidden) {
    container.classList.add('hidden');
  }
  features.appendChild(container);
});



story.appendChild(features);

var footer = document.createElement('div');

if (config.footer) {
  var footerText = document.createElement('p');
  footerText.innerHTML = config.footer;
  footer.appendChild(footerText);
}

if (footer.innerText.length > 0) {
  footer.classList.add(config.theme);
  footer.setAttribute('id', 'footer');
  story.appendChild(footer);
}

mapboxgl.accessToken = config.accessToken;

const transformRequest = (url) => {
  const hasQuery = url.indexOf("?") !== -1;
  const suffix = hasQuery ? "&pluginName=scrollytellingV2" : "?pluginName=scrollytellingV2";
  return {
    url: url + suffix
  };
};

var map = new mapboxgl.Map({
  container: 'map',
  style: config.style,
  center: config.chapters[0].location.center,
  zoom: config.chapters[0].location.zoom,
  bearing: config.chapters[0].location.bearing,
  pitch: config.chapters[0].location.pitch,
  interactive: false,
  transformRequest,
  projection: config.projection
});


function getLayerPaintType(layer) {
  var layerType = map.getLayer(layer).type;
  return layerTypes[layerType];
}

function setLayerOpacity(layer) {
  var paintProps = getLayerPaintType(layer.layer);
  paintProps.forEach((prop) => {
    var options = {};
    if (layer.duration) {
      var transitionProp = `${prop}-transition`;
      options = { "duration": layer.duration };
      map.setPaintProperty(layer.layer, transitionProp, options);
    }
    map.setPaintProperty(layer.layer, prop, layer.opacity, options);
  });
}

// Create a inset map if enabled in config.js
if (config.inset) {
  var insetMap = new mapboxgl.Map({
    container: 'mapInset', // container id
    style: 'mapbox://styles/mapbox/dark-v10', // hosted style id
    center: config.chapters[0].location.center,
    // Hardcode above center value if you want insetMap to be static.
    zoom: 3, // starting zoom
    hash: false,
    interactive: false,
    attributionControl: false,
    // Future: Once official mapbox-gl-js has globe view enabled,
    // insetmap can be a globe with the following parameter.
    // projection: 'globe'
  });
}

if (config.showMarkers) {
  var marker = new mapboxgl.Marker({ color: config.markerColor });
  marker.setLngLat(config.chapters[0].location.center).addTo(map);
}

// instantiate the scrollama
var scroller = scrollama();



function updateInsetLayer(bounds) {
  insetMap.getSource('boundsSource').setData(bounds);
}


function addInsetLayer(bounds) {
  insetMap.addSource('boundsSource', {
    'type': 'geojson',
    'data': bounds
  });

  insetMap.addLayer({
    'id': 'boundsLayer',
    'type': 'fill',
    'source': 'boundsSource', // reference the data source
    'layout': {},
    'paint': {
      'fill-color': '#fff', // blue color fill
      'fill-opacity': 0.2
    }
  });
  // // Add a black outline around the polygon.
  insetMap.addLayer({
    'id': 'outlineLayer',
    'type': 'line',
    'source': 'boundsSource',
    'layout': {},
    'paint': {
      'line-color': '#000',
      'line-width': 1
    }
  });
}


// Helper functions for insetmap
function getInsetBounds() {
  let bounds = map.getBounds();

  let boundsJson = {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              bounds._sw.lng,
              bounds._sw.lat
            ],
            [
              bounds._ne.lng,
              bounds._sw.lat
            ],
            [
              bounds._ne.lng,
              bounds._ne.lat
            ],
            [
              bounds._sw.lng,
              bounds._ne.lat
            ],
            [
              bounds._sw.lng,
              bounds._sw.lat
            ]
          ]
        ]
      }
    }]
  };

  if (initLoad) {
    addInsetLayer(boundsJson);
    initLoad = false;
  } else {
    updateInsetLayer(boundsJson);
  }
}


map.on("load", () => {
  if (config.use3dTerrain) {
    map.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
      'tileSize': 512,
      'maxzoom': 14
    });
    // add the DEM source as a terrain layer with exaggerated height
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

    // add a sky layer that will show when the map is highly pitched
    map.addLayer({
      'id': 'sky',
      'type': 'sky',
      'paint': {
        'sky-type': 'atmosphere',
        'sky-atmosphere-sun': [0.0, 0.0],
        'sky-atmosphere-sun-intensity': 15
      }
    });
  }



  // As the map moves, grab and update bounds in inset map.
  if (config.inset) {
    map.on('move', getInsetBounds);
  }
  // setup the instance, pass callback functions
  scroller
    .setup({
      step: '.step',
      offset: 0.5,
      progress: true
    })
    .onStepEnter(async response => {
      var chapter = config.chapters.find(chap => chap.id === response.element.id);
      response.element.classList.add('active');
      map[chapter.mapAnimation || 'flyTo'](chapter.location);
      // Incase you do not want to have a dynamic inset map,
      // rather want to keep it a static view but still change the
      // bbox as main map move: comment out the below if section.
      if (config.inset) {
        if (chapter.location.zoom < 5) {
          insetMap.flyTo({ center: chapter.location.center, zoom: 0 });
        } else {
          insetMap.flyTo({ center: chapter.location.center, zoom: 3 });
        }
      }
      if (config.showMarkers) {
        marker.setLngLat(chapter.location.center);
      }
      if (chapter.onChapterEnter.length > 0) {
        chapter.onChapterEnter.forEach(setLayerOpacity);
      }
      if (chapter.callback) {
        window[chapter.callback]();
      }
      if (chapter.rotateAnimation) {
        map.once('moveend', () => {
          const rotateNumber = map.getBearing();
          map.rotateTo(rotateNumber + 180, {
            duration: 30000,
            easing(t) {
              return t;
            }
          });
        });
      }

      // if (chapter. id === 'five-chapter'){
      // map.addLayer({
      //     'id': 'maine',
      //     'type': 'fill',
      //     'source': {
      //         'type': 'geojson',
      //         'data': hexGrid
      //     },
      //     'layout': {},
      //     'paint': {
      //         'fill-color': '#088',
      //         'fill-opacity': [
      //         "interpolate", ["linear"], ["get", "density"],
      //         0, 0.3,
      //         1, 1
      //         ]
      //     }
      // });

      // let locations = [];
      // sanitation.features.forEach(function(element) {
      //     let coords = element.geometry.coordinates;
      //     let location = [coords[1], coords[0], 0.5];
      //     locations.push(location);
      //     });
      // L.heatLayer(locations, {radius: 20, minOpacity: 0.5}).addTo(map);

      // } bugs here
    })
    .onStepExit(response => {
      var chapter = config.chapters.find(chap => chap.id === response.element.id);
      response.element.classList.remove('active');
      if (chapter.onChapterExit.length > 0) {
        chapter.onChapterExit.forEach(setLayerOpacity);
      }
    });
});

// make a slider to select a year to show
let fourthChapCard = document.getElementById('fourth-chapter').getElementsByClassName('dark')[0];
fourthChapCard.innerHTML += '<label id="year">2007</label> <input id="slider" type="range" min="2007" max="2021" step="1" value="2007">';


function filterBy(year) {
  const filters = ['==', 'season_year', year];
  map.setFilter('3D-extrusions', filters);

  // Set the label to the year
  document.getElementById('year').textContent = year;
}

document.getElementById('slider').addEventListener('input', (e) => {
  const year = parseInt(e.target.value, 10);
  filterBy(year);
});



// add popup

map.on('load', () => {
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  let hoveredStateId = null;
  let clickStateId = null;

  map.on('mousemove', 'choropleth-fill', (e) => {
    if (e.features.length > 0) {
      if (hoveredStateId) {
        this.map.setFeatureState(
          {
            source: "composite",
            sourceLayer: 'choropleth-fill',
            id: hoveredStateId
          },
          { hover: false }
        );
      }
      hoveredStateId = e.features[0].id;
      this.map.setFeatureState(
        {
          source: "composite",
          sourceLayer: 'choropleth-fill',
          id: hoveredStateId
        },
        { hover: true }
      );
    }
    // Copy coordinates array.
    const death = e.features[0].properties.Deaths;
    const name = e.features[0].properties.State;
    const totalcase = e.features[0].properties['Total cases'];
    const description = `<p>State: <strong>${name}</strong><br>Deaths:${death}<br>Total case: ${totalcase}</p>`;
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.

    popup
      .trackPointer()
      .setHTML(description)
      .addTo(map);
  });

  map.on('mouseleave', 'choropleth-fill', () => {
    if (hoveredStateId) {
      this.map.setFeatureState(
        {
          source: "composite",  // just tried out but really don't know why the source is composite
          sourceLayer: 'choropleth-fill',
          id: hoveredStateId
        },
        { hover: false }
      );
    }
    popup.remove();
  });
});

// setup resize event
window.addEventListener('resize', scroller.resize);

