import sketch from 'sketch';

// Importing from custom
const { randomEmoji } = require('./shared');

export default function () {
  const doc = sketch.getSelectedDocument()
  const selected_layers = doc.selectedLayers;
  const selected_count = selected_layers.length;
  const page = doc.selectedPage;

  // const grad_list = ['#1458EA', '#1CE1AC', '#ff7d50', '#ff007f', '#8338EC', '#FFBE0B'];
  let grad_list = [];

  selected_layers.forEach(function (layer, i) {
    console.log((i + 1) + '. ' + layer.style.fills[0].color);
    grad_list.push(layer.style.fills[0].color);
  });

  // Colors

  // Swatch
  const swatch = {};
  swatch.w = 50;
  swatch.h = 35;
  swatch.offset = {};
  swatch.offset.x = 0;
  swatch.offset.y = 0;
  swatch.spacing = 0;
  const swatches = [];

  // Artboard
  const artb_w = swatch.offset.x + ((grad_list.length - 1) * swatch.spacing) + (grad_list.length * swatch.w);
  const artb_h = swatch.offset.y + ((grad_list.length - 1) * swatch.spacing) + (grad_list.length * swatch.hopen);
  let my_artboard = new sketch.Artboard({
    parent: page,
    frame: { x: 0, y: 0, width: artb_w, height: artb_h },
    flowStartPoint: true,
  });
  console.log(my_artboard);

  for (let i = 0; i < grad_list.length; i++) {
    const color_row = grad_list[i];
    const swatch_y = swatch.offset.y + i * swatch.h;
    for (let j = 0; j < grad_list.length; j++) {
      const color_column = grad_list[j];
      const swatch_x = swatch.offset.x + j * swatch.w;

      var my_style = new sketch.Style()
      my_style.fills = [color_column];
      my_style.borders = [];

      let my_square = new sketch.ShapePath({
        parent: my_artboard,
        frame: { x: swatch_x, y: swatch_y, width: swatch.w, height: swatch.h },
        style: my_style
        // style: { fills: ['#35E6C9'] }
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
