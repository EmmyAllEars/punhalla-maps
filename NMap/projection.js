      // ======
      config = {"factor":65536.0,"globalMinZoom":12,"globalMaxZoom":20,"tileSize":512,"blocksPerTile":32};
      // For the extent sizes specified below, OpenLayers tries to fit
      // the whole extents given in a space [0, 0] -> [2^8, 2^8] visually
      // on screen at zoom level 0.
      //
      // This constant represents that internal tile size that OpenLayers
      // will aim for, so that we can calculate zoom levels correctly later.
      const openLayersInternalTileSize = Math.pow(2, 8); // 256

      // The actual size of the tiles that we're using in Papyrus.
      const tileSize = config.tileSize;

      // The maximum positive extents of the whole map. The units for this
      // value are "number of tiles at the most zoomed out level generated
      // by Papyrus". That is, if Papyrus generates a minimum zoom level
      // of 15, then the units for this extent size are the number of (Papyrus)
      // zoom level 15 tiles to display at (OpenLayers) zoom level 0.
      //
      // The minimum zoom level that Papyrus is using is in config.globalMinZoom.
      const maximumExtentSize = 10000;

      // The minimum negative extents of the whole map. Uses the same units
      // as maximumExtentSize.
      const minimumExtentSize = -10000;

      // Computes the resolutions array to use for OpenLayers. For each OpenLayers
      // zoom level (0 through 42), this computes the ratio such that a single tile
      // at OpenLayers zoom level 0 is a single tile at the minimum Papyrus zoom level.
      const papyrusMinimumZoomScale = Math.pow(2, config.globalMinZoom);
      const convertedFromTilesToPixelsUsingTileSize = papyrusMinimumZoomScale / tileSize;
      const resolutions = new Array(43);
      for (let z = 0; z < 43; ++z) {
        resolutions[z] = convertedFromTilesToPixelsUsingTileSize / Math.pow(2, z);
      }

      // When we calculate resolutions above, we've effectively saying that zoom level 0 is
      // zoom level N, where N is the lowest zoom level. This zoom level N also becomes
      // the range of [0, 0] -> [1, 1] in the coordinate system. We need to be able to translate
      // coordinates in that "zoomed out" coordinate system, back down to the maximum zoom level
      // where each tile represents 32x32 (depending on tilesize) Minecraft tiles.
      const zoomRatioForMaximumZoom = 1 / Math.pow(2, config.globalMaxZoom - config.globalMinZoom);
      const minecraftTilesAtMostZoomedInLevel = config.blocksPerTile;

      // Use a projection where pixels have a 1:1 ratio with the screen at zoom level 0.
      const projection = new ol.proj.Projection({
        code: "ZOOMIFY",
        units: "pixels",
        extent: [
          0,
          0,
          openLayersInternalTileSize / tileSize,
          openLayersInternalTileSize / tileSize
        ]
      });

      // Construct the tile grid using the desired maximum and minimum extents listed above,
      // set the origin to [0, 0] (the center of the map), and the calculated resolutions array.
      const tilegrid = new ol.tilegrid.TileGrid({
        extent: [
          minimumExtentSize,
          minimumExtentSize,
          maximumExtentSize,
          maximumExtentSize
        ],
        origin: [0, 0],
        resolutions: resolutions,
        tileSize: [tileSize, tileSize]
      });