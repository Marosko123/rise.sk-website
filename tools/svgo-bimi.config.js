/**
 * SVGO configuration for BIMI compliance
 * Ensures SVG is clean, minimal, and safe for email clients
 */
module.exports = {
  multipass: true,
  plugins: [
    // Remove doctype, XML declarations, comments
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',

    // Remove scripts, styles, and other potentially unsafe elements
    'removeScriptElement',
    'removeStyleElement',
    'removeOffCanvasPaths',

    // Remove external references
    'removeXlink',

    // Clean up attributes and elements
    'removeUnknownsAndDefaults',
    'removeUnusedNS',
    'removeEditorsNSData',
    'removeEmptyAttrs',
    'removeHiddenElems',
    'removeEmptyText',
    'removeEmptyContainers',

    // Remove presentation attributes that could conflict
    'removeDimensions',

    // Clean up paths and shapes
    'convertShapeToPath',
    'mergePaths',
    'convertPathData',
    'removeUselessStrokeAndFill',

    // Security: remove potentially dangerous elements
    {
      name: 'removeAttrs',
      params: {
        attrs: [
          'onclick',
          'onload',
          'onerror',
          'onmouseover',
          'onmouseout',
          'onfocus',
          'onblur',
          'style'
        ]
      }
    },

    // Remove foreign objects (not allowed in BIMI)
    {
      name: 'removeElementsByAttr',
      params: {
        id: 'foreignObject'
      }
    },

    // Ensure no embedded images
    {
      name: 'removeElementsByAttr',
      params: {
        tag: 'image'
      }
    }
  ]
};
