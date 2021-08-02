var layers = {
  dim0: {
    name: "Overworld",
    attribution:
      '<a href="./OWMap/map.html">Overworld</a>',
    minNativeZoom: 12,
    minZoom: 12,
    maxNativeZoom: 20,
    maxZoom: 22,
    noWrap: true,
    tileSize: 512,
    folder: "dim0",
    fileExtension: "png"
   },
  dim1: {
    name: "Nether Y 1-60",
    attribution:
      '<a href="./OWMap/map.html">Nether</a>',
    minNativeZoom: 12,
    minZoom: 12,
    maxNativeZoom: 20,
    maxZoom: 22,
    noWrap: true,
    tileSize: 512,
    folder: "./map/dim1",
    fileExtension: "png" 
  }
};

var config = {
  factor: 1
};

layers = {
  "dim0":
    {
      "name":"Overworld",
      //"attribution":"Generated by <a href=\"https://github.com/mjungnickel18/papyruscs\">PapyrusCS</a>",
      "minNativeZoom":12,
      "maxNativeZoom":20,
      "noWrap":true,
      "tileSize":512,
      "folder":"map/dim0",
      "fileExtension":"png"
    },
  "dim0_underground":
    {
      "name":"Underground",
      //"attribution":"Generated by <a href=\"https://github.com/mjungnickel18/papyruscs\">PapyrusCS</a>",
      "minNativeZoom":12,
      "maxNativeZoom":20,
      "noWrap":true,
      "tileSize":512,
      "folder":"map/dim0_underground",
      "fileExtension":"png"
    },
/*  "dim0_stronghold":
    {
      "name":"Strongholds",
      "attribution":"Generated by <a href=\"https://github.com/mjungnickel18/papyruscs\">PapyrusCS</a>",
      "minNativeZoom":15,
      "maxNativeZoom":20,
      "noWrap":true,
      "tileSize":512,
      "folder":"./map/dim0_stronghold",
      "fileExtension":"png"
    },*/
  "dim0_ore":
    {
      "name":"All Ore",
      //"attribution":"Generated by <a href=\"https://github.com/mjungnickel18/papyruscs\">PapyrusCS</a>",
      "minNativeZoom":12,
      "maxNativeZoom":20,
      "noWrap":true,
      "tileSize":512,
      "folder":"map/dim0_ore",
      "fileExtension":"png"
    },
  "dim0_ore12":
    {
      "name":"Ore y1-12",
      //"attribution":"Generated by <a href=\"https://github.com/mjungnickel18/papyruscs\">PapyrusCS</a>",
      "minNativeZoom":12,
      "maxNativeZoom":20,
      "noWrap":true,
      "tileSize":512,
      "folder":"slice12/map/dim0_ore",
      "fileExtension":"png"
    },
  "dim0_aquatic":
    {
      "name":"Aquatic",
      //"attribution":"Generated by <a href=\"https://github.com/mjungnickel18/papyruscs\">PapyrusCS</a>",
      "minNativeZoom":12,
      "maxNativeZoom":20,
      "noWrap":true,
      "tileSize":512,
      "folder":"map/dim0_aquatic",
      "fileExtension":"png"
    },
    "dim1":
    {
      "name":"Nether Y 1-80",
      //"attribution":"Generated by <a href=\"https://github.com/mjungnickel18/papyruscs\">PapyrusCS</a>",
      "minNativeZoom":15,
      "maxNativeZoom":20,
      "noWrap":true,
      "tileSize":512,
      "folder":"map/dim1",
      "fileExtension":"png"
    },
  "dim1_underground":
    {
      "name":"Nether Underground",
      //"attribution":"Generated by <a href=\"https://github.com/mjungnickel18/papyruscs\">PapyrusCS</a>",
      "minNativeZoom":15,
      "maxNativeZoom":20,
      "noWrap":true,
      "tileSize":512,
      "folder":"map/dim1_underground",
      "fileExtension":"png"
    },
  "dim1_15":
    {
      "name":"Nether Y level 15",
      //"attribution":"Generated by <a href=\"https://github.com/mjungnickel18/papyruscs\">PapyrusCS</a>",
      "minNativeZoom":15,
      "maxNativeZoom":20,
      "noWrap":true,
      "tileSize":512,
      "folder":"nether15/map/dim1",
      "fileExtension":"png"
    }
  }; 
config = {"factor":65536.0,"globalMinZoom":12,"globalMaxZoom":20,"tileSize":512,"blocksPerTile":32};
let map;
let locationElement;

const tileLayers = Object.keys(layers)
  .sort()
  .map(function(layerKey, idx) {
    const layer = layers[layerKey];
    const tileLayer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        tileUrlFunction: function(tileCoord, pixelRatio, projection) {
          const z = tileCoord[0];
          const x = tileCoord[1];
          const y = tileCoord[2];
          return (
            "./" +
            layer.folder +
            "/" +
            z +
            "/" +
            x +
            "/" +
            y +
            "." +
            layer.fileExtension
          );
        },
        projection: projection,
        tileGrid: tilegrid,
        attributions: layer.attribution
      }),
      visible: idx == 0
    });
    tileLayer.metaLayerKey = layerKey;
    return tileLayer;
  });

const initialLayer = layers[Object.keys(layers).sort()[0]];

if (Object.keys(layers).sort()[0] == "dim0_stronghold") {
  document.getElementById("map").style.background = "#000";
} else {
  document.getElementById("map").style.background = "#202020";
}
          
const view = new ol.View({
  projection: projection,
  center: [0, 0],
  zoom: 5,
  minZoom: 0,
  maxZoom: config.globalMaxZoom - config.globalMinZoom
});

const PapyrusControls = (function(Control) {
  function PapyrusControls(opt_options) {
    const options = opt_options || {};

    const element = document.createElement("div");
    element.className = "layer-select ol-unselectable";

    const card = document.createElement("div");
    card.className = "card";
    element.appendChild(card);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body p-3 px-3";
    card.appendChild(cardBody);

    const form = document.createElement("form");
    cardBody.appendChild(form);

    let currentSelectedLayer = Object.keys(layers).sort()[0];
    let rememberedCenters = {};
    let rememberedZoom = {};

    Object.keys(layers)
      .sort()
      .forEach(function(layerKey, idx) {
        const layer = layers[layerKey];

        const radioContainer = document.createElement("div");
        radioContainer.className = "custom-control custom-radio";

        const radioInput = document.createElement("input");
        radioInput.type = "radio";
        radioInput.id = layerKey;
        radioInput.name = "layers";
        radioInput.className = "custom-control-input";
        radioInput.checked = idx == 0;
        radioInput.value = layerKey;
        radioContainer.appendChild(radioInput);

        const radioLabel = document.createElement("label");
        radioLabel.htmlFor = layerKey;
        radioLabel.className = "custom-control-label";
        radioLabel.innerText = layer.name;
        radioContainer.appendChild(radioLabel);

        const selectLayer = function(e) {
          if (layerKey == "dim0_stronghold") {
            document.getElementById("map").style.background = "#000";
          } else {
            document.getElementById("map").style.background = "#202020";
          }
  
          if (currentSelectedLayer != layerKey) {
            const runtimeLayers = map.getLayers();
            runtimeLayers.forEach(function(runtimeLayer) {
              runtimeLayer.setVisible(
                runtimeLayer.metaLayerKey == layerKey ||
                      runtimeLayer.metaLayerKey == "players_" + layerKey.substr(0, 4)
                    ); // show image layer, and player layer based on dimension
            });
            
            const oldFocusGroup = currentSelectedLayer.substr(0, 4);
            const newFocusGroup = layerKey.substr(0, 4);

            rememberedCenters[oldFocusGroup] = view.getCenter();
            if (rememberedCenters[newFocusGroup] === undefined) {
              // refocus the map to 0, 0
              view.setCenter([0, 0]);
            } else {
              // set back to where we were
              view.setCenter(rememberedCenters[newFocusGroup]);
            }

            rememberedZoom[oldFocusGroup] = view.getZoom();
            view.setMinZoom(layer.minNativeZoom - config.globalMinZoom);
            view.setMaxZoom(layer.maxNativeZoom - config.globalMinZoom);
            if (rememberedZoom[newFocusGroup] === undefined) {
              // rezoom the map to minimum zoom
              view.setZoom(layer.minNativeZoom - config.globalMinZoom);
            } else {
              // set back to where we were
              view.setZoom(rememberedZoom[newFocusGroup]);
            }

            const radios = $("input[name='layers']");
            radios.each(function(idx, elem) {
              if (elem.value == layerKey) {
                elem.checked = true;
              } else {
                elem.checked = false;
              }
            });

            currentSelectedLayer = layerKey;
          }
        };

        radioInput.addEventListener(
          "click",
          selectLayer.bind(this),
          false
        );

        form.appendChild(radioContainer);
      });

    const hr = document.createElement("hr");
   
    form.appendChild(hr);

    linkElement = document.createElement("div");
    linkElement.innerHTML = "<hr><div><a href='https://www.chunkbase.com/apps/seed-map#-1836633836' target='_blank'>Seed Map on Chunkbase</a></div>";
    form.appendChild(linkElement);

    form.appendChild(hr);

    locationElement = document.createElement("div");
    locationElement.innerText = "Click map for coords.";
    form.appendChild(locationElement);

    /*pinElement = document.createElement("div");
    pinElement.innerHTML = "<hr><button onclick='showForm()' id='coordsbutton' type='button'>Enter coords</button><div id='pinform' style='display:none;margin-top:5px;'><form id='pindrop'><label for='Xpos'>X</label><input type='text' id='Xpos' name='Xpos' style='width: 75%; margin-left:5px;'><br><label for='Zpos'>Z</label><input type='text' id='Zpos' name='Zpos' style='width: 75%; margin-left:5px;'><input type='button' onclick='dropPin()' style='margin:2px;' value='Go' onsubmit='return false'></form><button onclick='removePin()' style='margin:2px;display:none;' id='clearPin' type='button'>Remove Pin</button></div>";
    form.appendChild(pinElement);*/

    Control.call(this, {
      element: element,
      target: options.target
    });
  }

  if (Control) PapyrusControls.__proto__ = Control;
  PapyrusControls.prototype = Object.create(Control && Control.prototype);
  PapyrusControls.prototype.constructor = PapyrusControls;

  return PapyrusControls;
})(ol.control.Control);

map = new ol.Map({
  target: "map",
  layers: tileLayers,
  view: view,
  controls: [
    new ol.control.Zoom(),
    new PapyrusControls()
  ]
});

map.on("click", function(event) {
  var x = Math.floor(
    (event.coordinate[0] / zoomRatioForMaximumZoom) *
      minecraftTilesAtMostZoomedInLevel
  );
  var z = Math.floor(
    (-event.coordinate[1] / zoomRatioForMaximumZoom) *
      minecraftTilesAtMostZoomedInLevel
  );

  locationElement.innerText = "X: " + x + " Z: " + z;
});

/*function showForm() {
  var x = document.getElementById("pinform");
  x.style.display = "block";
  var y = document.getElementById("coordsbutton");
  y.style.display = "none";
};

function removePin() {
  var x = document.getElementById("pinform");
  x.style.display = "none";
  var y = document.getElementById("coordsbutton");
  y.style.display = "block";
  var z = document.getElementById("clearPin");
  z.style.display = "none";
};*/



if (typeof(playersData) !== "undefined") {
  var playerFeatures = [[], [], []];
        // array for each dimension

  for (var playerIndex in playersData.players)
  {
      var player = playersData.players[playerIndex];

      if (!player.visible) {
          continue;
      }

      var style = new ol.style.Style({
          text: new ol.style.Text({
              text: player.name ,//+ "\n\uf041", map-marker
              font: "900 18px 'Font Awesome 5 Free'",
              textBaseline: "bottom",
              fill: new ol.style.Fill({color: player.color}),
              stroke: new ol.style.Stroke({color: "white", width: 2})
          })
      }); 

      var playerFeature = new ol.Feature({
          name: player.name,
          geometry: new ol.geom.Point([
              (player.position[0] * zoomRatioForMaximumZoom) / minecraftTilesAtMostZoomedInLevel,
              (-player.position[2] * zoomRatioForMaximumZoom) / minecraftTilesAtMostZoomedInLevel
          ]),
          popupText: player.position[0] + ", " + player.position[2]
      });

      playerFeature.setStyle(style);

      playerFeatures[player.dimensionId].push(playerFeature);
            // add to the correct array/layer for the dimension 
  }

  for (var dimensionId = 0; dimensionId < 3; dimensionId++) {
    var vectorSource = new ol.source.Vector({
        features: playerFeatures[dimensionId]
    });

    var vectorLayer = new ol.layer.Vector({
      source: vectorSource
  });

  vectorLayer.metaLayerKey = "players_dim" + dimensionId;

  vectorLayer.setMap(map);
  if (dimensionId != 0) {
    // initially display only overworld players
    vectorLayer.values_.visible = false;
  }

  map.addLayer(vectorLayer);
}

/*function dropPin() {
  var Xvalue = document.getElementById("Xpos").value;
  var Zvalue = document.getElementById("Zpos").value;
  var x = document.getElementById("clearPin");
  x.style.display = "block";
  var style = new ol.style.Style({
      text: new ol.style.Text({
          text: "\uf276",
          font: "900 18px 'Font Awesome 5 Free'",
          textBaseline: "bottom",
          fill: new ol.style.Fill({color: "red"}),
          stroke: new ol.style.Stroke({color: "white", width: 1})
      })
  });
  var pinFeature = new ol.Feature({
        geometry: new ol.geom.Point([
          (Xvalue * zoomRatioForMaximumZoom) / minecraftTilesAtMostZoomedInLevel,
          (Zvalue * zoomRatioForMaximumZoom) / minecraftTilesAtMostZoomedInLevel
        ])
    });
  pinFeature.setStyle(style);
  playerFeatures.push(pinFeature);
  map.render();
    
  var pintemp = new Overlay({
    position: pos,
    element: document.getElementById('vienna'),
  });
  map.addOverlay(pin); 
  var point = feature.getGeometry();
  view.centerOn(point.getCoordinates(), size, [570, 500]);
};*/
}