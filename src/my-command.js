import sketch from 'sketch';

// Importing from custom
const { randomEmoji } = require('./shared');

export default function () {
  const doc = sketch.getSelectedDocument()
  var selected_layers = doc.selectedLayers;
  var selected_count = selected_layers.length;
  const page = doc.selectedPage;

  if (selected_count === 0) {
    sketch.UI.message(`No layers are selected.${randomEmoji()}`);
    throw '';
  } else if (selected_count < 2) {
    sketch.UI.message(`You need at least 2 color filed layers!`);
    throw '';
  }

  // Sort layers by x
  var layers = Array.from(selected_layers.layers);
  layers.sort((a, b) => b.frame.x < a.frame.x);
  // console.log(layers);

  // Swatch
  const swatch = {
    w: 50,
    h: 35,
    offset: {
      x: 0,
      y: 0
    },
    spacing: 0
  };
  const swatches = [];

  // const colors = ['#1458EA', '#1CE1AC', '#ff7d50', '#ff007f', '#8338EC', '#FFBE0B'];
  let colors = [];

  layers.forEach(function (layer, i) {
    // console.log((i + 1) + '. ' + layer.style.fills[0].color);
    colors.push(layer.style.fills[0].color);
    if (i == 0) {
      swatch.offset.x = layer.frame.x;
      swatch.offset.y = layer.frame.y;
      swatch.w = layer.frame.width;
      swatch.h = layer.frame.height;
    }
    if (i == 1) {
      swatch.spacing = layer.frame.x - (swatch.offset.x + swatch.w);
      swatch.offset.y = layer.frame.y + swatch.spacing;
    }
  });

  console.log(swatch);
  // throw 'swatch';

  // Artboard
  const artb_x = swatch.offset.x;
  const artb_y = swatch.offset.y + swatch.h;
  const artb_w = ((colors.length - 1) * swatch.spacing) + (colors.length * swatch.w);
  const artb_h = ((colors.length - 1) * swatch.spacing) + (colors.length * swatch.h);
  let my_artboard = new sketch.Artboard({
    name: 'gradient-matrix-generator-result',
    parent: page,
    frame: { x: artb_x, y: artb_y, width: artb_w, height: artb_h },
    flowStartPoint: true,
  });
  // console.log(my_artboard);

  for (let i = 0; i < colors.length; i++) {
    const color_row = colors[i];
    const swatch_y = i * (swatch.h + swatch.spacing);
    for (let j = 0; j < colors.length; j++) {
      const color_column = colors[j];
      const swatch_x = j * (swatch.w + swatch.spacing);

      var my_style = new sketch.Style()
      my_style.fills = [color_column];
      my_style.borders = [];

      let my_square = new sketch.ShapePath({
        parent: my_artboard,
        frame: { x: swatch_x, y: swatch_y, width: swatch.w, height: swatch.h },
        style: my_style
        //style: { fills: ['#35E6C9'] }
      });
      swatches.push(my_square);
    }
  }



  /*
  if (selected_count === 0) {
    sketch.UI.message(`No layers are selected.${randomEmoji()}`);
  } else {
    sketch.UI.message(`${selected_count} layers selected.`);
  }
  */
}
