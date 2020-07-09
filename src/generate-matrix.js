import sketch from 'sketch';

// Importing from custom
const { randomEmoji } = require('./shared');

export default function () {
  const doc = sketch.getSelectedDocument()
  const page = doc.selectedPage;
  const Style = sketch.Style;

  var selected_layers = doc.selectedLayers;
  var selected_count = selected_layers.length;

  if (selected_count === 0) {
    sketch.UI.message(`⚠️ No layers are selected!.`);
    throw '';
  } else if (selected_count < 2) {
    sketch.UI.message(`⚠️ You need at least 2 color filed layers!`);
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
    const swatch_y = i * (swatch.h + swatch.spacing);
    const color_row = colors[i];

    for (let j = 0; j < colors.length; j++) {
      const swatch_x = j * (swatch.w + swatch.spacing);

      const color_column = colors[j];
      if (color_row == color_column) {
        color_column = color_column + '00';
      }

      let my_style = new Style()
      //my_style.fills = [color_column];
      my_style.borders = [];
      my_style.fills = [
        {
          fillType: Style.FillType.Gradient,
          gradient: {
            gradientType: Style.GradientType.Linear,
            from: {
              x: 0,
              y: 1,
            },
            to: {
              x: 1,
              y: 0,
            },
            stops: [
              {
                position: 0,
                color: color_row,
              },
              // {
              //   position: 0.5,
              //   color: '#0ff1ce',
              // },
              {
                position: 1,
                color: color_column,
              },
            ],
          },
        },
      ];

      let my_square = new sketch.ShapePath({
        parent: my_artboard,
        frame: { x: swatch_x, y: swatch_y, width: swatch.w, height: swatch.h },
        style: my_style
        //style: { fills: ['#35E6C9'] }
      });
      swatches.push(my_square);
    }
  }
}
