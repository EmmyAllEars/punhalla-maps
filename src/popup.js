/**
 * Elements that make up the popup.
 */
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};
/**
 * Add a click handler to the map to render the popup.
 */
map.on('singleclick', function (evt) {
  var x = Math.floor(
    (event.coordinate[0] / zoomRatioForMaximumZoom) *
      minecraftTilesAtMostZoomedInLevel
  );
  var z = Math.floor(
    (-event.coordinate[1] / zoomRatioForMaximumZoom) *
      minecraftTilesAtMostZoomedInLevel
  );

  content.innerHTML = "X: " + x + " Z: " + z;
  overlay.setPosition(coordinate);
});