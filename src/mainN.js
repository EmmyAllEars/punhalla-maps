var layers = {
  dim0: {
    name: "Nether Y 1-60",
    attribution:
      '<a href="./OWMap/map.html">Overworld</a>',
    minNativeZoom: 15,
    minZoom: 15,
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

layers = {"dim0":{"name":"Nether Y 1-80","attribution":"Generated by <a href=\"https://github.com/mjungnickel18/papyruscs\">PapyrusCS</a>","minNativeZoom":15,"maxNativeZoom":20,"noWrap":true,"tileSize":512,"folder":"./map/dim1","fileExtension":"png"},"dim0_underground":{"name":"Underground Nether","attribution":"Generated by <a href=\"https://github.com/mjungnickel18/papyruscs\">PapyrusCS</a>","minNativeZoom":15,"maxNativeZoom":20,"noWrap":true,"tileSize":512,"folder":"./map/dim1_underground","fileExtension":"png"},"dim0_stronghold":{"name":"Strongholds","attribution":"Generated by <a href=\"https://github.com/mjungnickel18/papyruscs\">PapyrusCS</a>","minNativeZoom":15,"maxNativeZoom":20,"noWrap":true,"tileSize":512,"folder":"./map/dim1_stronghold","fileExtension":"png"},"dim0_underground":{"name":"Underground","attribution":"Generated by <a href=\"https://github.com/mjungnickel18/papyruscs\">PapyrusCS</a>","minNativeZoom":15,"maxNativeZoom":20,"noWrap":true,"tileSize":512,"folder":"./map/dim1_underground","fileExtension":"png"},"dim0_15":{"name":"Y level 15","attribution":"Generated by <a href=\"https://github.com/mjungnickel18/papyruscs\">PapyrusCS</a>","minNativeZoom":15,"maxNativeZoom":20,"noWrap":true,"tileSize":512,"folder":"./nether15/map/dim1","fileExtension":"png"}}; 
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
                runtimeLayer.metaLayerKey == layerKey
              );
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



    form.appendChild(hr);

    linkElement = document.createElement("div");
    linkElement.innerHTML = "<div><a href='./mapOW.html'><img src='./Nether_portal.png' style='width: 20px;margin-left: auto;margin-right: auto;display: block;margin-top: 5px;' title='Overworld Map' alt='Overworld Map'></a></div>";
    form.appendChild(linkElement);

    form.appendChild(hr);

    locationElement = document.createElement("div");
    locationElement.innerText = "X: 0, Z: 0";
    form.appendChild(locationElement);

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
    new ol.control.Attribution(),
    new PapyrusControls()
  ]
});

map.on("pointermove", function(event) {
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

if (typeof(playersData) !== "undefined") {
  var playerFeatures = [];

  for (var playerIndex in playersData.players)
  {
      var player = playersData.players[playerIndex];

      if (!player.visible) {
          continue;
      }

      var style = new ol.style.Style({
          text: new ol.style.Text({
              text: player.name , //+ "\n\uf041" // map-marker
              font: "900 18px 'Font Awesome 5 Free'",
              textBaseline: "bottom",
              fill: new ol.style.Fill({color: player.color}),
              stroke: new ol.style.Stroke({color: "white", width: 2})
          })
      });

      var playerFeature = new ol.Feature({
          geometry: new ol.geom.Point([
              (player.position[0] * zoomRatioForMaximumZoom) / minecraftTilesAtMostZoomedInLevel,
              (-player.position[2] * zoomRatioForMaximumZoom) / minecraftTilesAtMostZoomedInLevel
          ])
      });

      playerFeature.setStyle(style);

      playerFeatures.push(playerFeature); 
  }

  var vectorSource = new ol.source.Vector({
      features: playerFeatures
  });

  var vectorLayer = new ol.layer.Vector({
      source: vectorSource
  });

  vectorLayer.setMap(map);
  //map.addLayer(vectorLayer);
}