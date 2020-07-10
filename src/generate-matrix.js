import sketch from 'sketch';

export default function () {

  // Skecth objects alias
  const doc = sketch.getSelectedDocument()
  const page = doc.selectedPage;
  const Style = sketch.Style;

  // Get layers
  const selected_layers = doc.selectedLayers;
  const selected_count = selected_layers.length;

  // Check for minimun requirements
  if (selected_count === 0) {
    let msg = '⚠️ No layers are selected!.';
    sketch.UI.message(msg);
    throw msg;
  } else if (selected_count < 2) {
    let msg = '⚠️ You need at least 2 color filed layers!';
    sketch.UI.message(msg);
    throw msg;
  }

  // Create copy of layers and sort by x position
  var layers = Array.from(selected_layers.layers);
  layers.sort((a, b) => b.frame.x < a.frame.x);

  // Base swatch object
  const swatch = {
    w: 50,
    h: 35,
    offset: {
      x: 0,
      y: 0
    },
    spacing: 0
  };

  // Base artboard object
  const artb = {
    x: 0,
    y: 0,
    w: 1024,
    h: 1024
  }

  // Get base positions and colors from layers
  const colors = [];
  layers.forEach(function (layer, i) {
    // console.log(layer.style.fills[0].color);
    colors.push(layer.style.fills[0].color);

    if (i == 0) {
      swatch.w = layer.frame.width;
      swatch.h = layer.frame.height;
      artb.x = layer.frame.x;
      artb.y = layer.frame.y + swatch.h;
    }
    if (i == 1) {
      swatch.spacing = layer.frame.x - (artb.x + swatch.w);
      artb.y += swatch.spacing;
    }
  });

  // Artboard
  artb.w = ((colors.length - 1) * swatch.spacing) + (colors.length * swatch.w);
  artb.h = ((colors.length - 1) * swatch.spacing) + (colors.length * swatch.h);
  let my_artboard = new sketch.Artboard({
    name: 'gradient-matrix-generator-result',
    parent: page,
    frame: { x: artb.x, y: artb.y, width: artb.w, height: artb.h },
    flowStartPoint: true,
  });
  // console.log(my_artboard);

  for (let i = 0; i < colors.length; i++) {
    const swatch_y = i * (swatch.h + swatch.spacing);

    const color_row = colors[i];

    for (let j = 0; j < colors.length; j++) {
      const swatch_x = j * (swatch.w + swatch.spacing);

      const color_column = colors[j];

      // If they are the same color set alpha to 00 on the second one
      if (color_row == color_column) {
        color_column = color_column.substring(0, color_column.length - 2) + '00';
        // console.log(color_column);
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
              {
                position: 1,
                color: color_column,
              },
            ],
          },
        },
      ];

      let my_square = new sketch.ShapePath({
        name: `gmg-swatch-x${j + 1}-y-${i + 1}`,
        parent: my_artboard,
        frame: { x: swatch_x, y: swatch_y, width: swatch.w, height: swatch.h },
        style: my_style //style: { fills: ['#35E6C9'] }
      });
    }
  }
}
