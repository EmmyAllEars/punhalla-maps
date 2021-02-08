var element = document.getElementById('popup');

var popup = new ol.Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -50],
});
map.addOverlay(popup);

// display popup on click
map.on('click', function (evt) {
  $(element).popover('dispose');
  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  if (feature) {
    var coordinates = feature.getGeometry().getCoordinates();
    popup.setPosition(coordinates);
    $(element).popover({
      placement: 'top',
      html: true,
      content: feature.get('popupText'),
    });
    $(element).popover('show');
  } else {
    $(element).popover('dispose');
  }
});

// change mouse cursor when over marker
map.on('pointermove', function (e) {
  if (e.dragging) {
    $(element).popover('dispose');
    return;
  }
/*  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? 'pointer' : '';*/
});