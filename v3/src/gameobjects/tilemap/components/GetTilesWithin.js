var GetFastValue = require('../../../utils/object/GetFastValue');

/**
 * Gets the tiles in the given rectangular area (in tile coordinates) of the layer.
 *
 * @param {number} [tileX=0] - [description]
 * @param {number} [tileY=0] - [description]
 * @param {number} [width=max width based on tileX] - [description]
 * @param {number} [height=max height based on tileY] - [description]
 * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
 * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have
 * -1 for an index.
 * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide on
 * at least one side.
 * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that
 * have at least one interesting face.
 * @param {LayerData} layer - [description]
 * @return {array} Array of Tile objects.
 */
var GetTilesWithin = function (tileX, tileY, width, height, filteringOptions, layer)
{
    if (tileX === undefined) { tileX = 0; }
    if (tileY === undefined) { tileY = 0; }
    if (width === undefined) { width = layer.width; }
    if (height === undefined) { height = layer.height; }

    var isNotEmpty = GetFastValue(filteringOptions, 'isNotEmpty', false);
    var isColliding = GetFastValue(filteringOptions, 'isColliding', false);
    var hasInterestingFace = GetFastValue(filteringOptions, 'hasInterestingFace', false);

    // Clip x, y to top left of map, while shrinking width/height to match.
    if (tileX < 0)
    {
        width += tileX;
        tileX = 0;
    }
    if (tileY < 0)
    {
        height += tileY;
        tileY = 0;
    }

    // Clip width and height to bottom right of map.
    if (tileX + width > layer.width)
    {
        width = Math.max(layer.width - tileX, 0);
    }
    if (tileY + height > layer.height)
    {
        height = Math.max(layer.height - tileY, 0);
    }

    var results = [];

    for (var ty = tileY; ty < tileY + height; ty++)
    {
        for (var tx = tileX; tx < tileX + width; tx++)
        {
            var tile = layer.data[ty][tx];
            if (tile !== null)
            {
                if (isNotEmpty && tile.index === -1) { continue; }
                if (isColliding && !tile.collides) { continue; }
                if (hasInterestingFace && !tile.hasInterestingFace) { continue; }
                results.push(tile);
            }
        }
    }

    return results;
};

module.exports = GetTilesWithin;
