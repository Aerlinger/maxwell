/*
Stores Environment-specific settings

These are the global settings for Maxwell and should defined by the user.
Settings do not change by loading a new circuit.
*/


let ColorPalette = undefined;
class Settings {
  static initClass() {
    // Used from https://github.com/matthewbj/Colors/blob/master/colors.js:
    ColorPalette = {
  
    // Voltage scale goes from Red (low voltage) to Green (high volage)
      'voltageScale': [
        // Red color scale
        "#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737",
        "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777",
  
        "#7f7f7f", // Grey
  
        // Green color scale
        "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747", "#3fbf3f",
        "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00"
      ],
  
      'aliceblue': '#f0f8ff',
      'antiquewhite': '#faebd7',
      'aqua': '#00ffff',
      'aquamarine': '#7fffd4',
      'azure': '#f0ffff',
      'beige': '#f5f5dc',
      'bisque': '#ffe4c4',
      'black': '#000000',
      'blanchedalmond': '#ffebcd',
      'blue': '#0000ff',
      'blueviolet': '#8a2be2',
      'brown': '#a52a2a',
      'burlywood': '#deb887',
      'cadetblue': '#5f9ea0',
      'chartreuse': '#7fff00',
      'chocolate': '#d2691e',
      'coral': '#ff7f50',
      'cornflowerblue': '#6495ed',
      'cornsilk': '#fff8dc',
      'crimson': '#dc143c',
      'cyan': '#00ffff',
      'darkblue': '#00008b',
      'darkcyan': '#008b8b',
      'darkgoldenrod': '#b8860b',
      'darkgray': '#a9a9a9',
      'darkgrey': '#a9a9a9',
      'darkgreen': '#006400',
      'darkkhaki': '#bdb76b',
      'darkmagenta': '#8b008b',
      'darkolivegreen': '#556b2f',
      'darkorange': '#ff8c00',
      'darkorchid': '#9932cc',
      'darkred': '#8b0000',
      'darksalmon': '#e9967a',
      'darkseagreen': '#8fbc8f',
      'darkslateblue': '#483d8b',
      'darkslategray': '#2f4f4f',
      'darkslategrey': '#2f4f4f',
      'darkturquoise': '#00ced1',
      'darkviolet': '#9400d3',
      'deeppink': '#ff1493',
      'deepskyblue': '#00bfff',
      'dimgray': '#696969',
      'dimgrey': '#696969',
      'dodgerblue': '#1e90ff',
      'firebrick': '#b22222',
      'floralwhite': '#fffaf0',
      'forestgreen': '#228b22',
      'fuchsia': '#ff00ff',
      'gainsboro': '#dcdcdc',
      'ghostwhite': '#f8f8ff',
      'gold': '#ffd700',
      'goldenrod': '#daa520',
      'gray': '#808080',
      'grey': '#808080',
      'green': '#008000',
      'greenyellow': '#adff2f',
      'honeydew': '#f0fff0',
      'hotpink': '#ff69b4',
      'indianred': '#cd5c5c',
      'indigo': '#4b0082',
      'ivory': '#fffff0',
      'khaki': '#f0e68c',
      'lavender': '#e6e6fa',
      'lavenderblush': '#fff0f5',
      'lawngreen': '#7cfc00',
      'lemonchiffon': '#fffacd',
      'lightblue': '#add8e6',
      'lightcoral': '#f08080',
      'lightcyan': '#e0ffff',
      'lightgoldenrodyellow': '#fafad2',
      'lightgray': '#d3d3d3',
      'lightgrey': '#d3d3d3',
      'lightgreen': '#90ee90',
      'lightpink': '#ffb6c1',
      'lightsalmon': '#ffa07a',
      'lightseagreen': '#20b2aa',
      'lightskyblue': '#87cefa',
      'lightslategray': '#778899',
      'lightslategrey': '#778899',
      'lightsteelblue': '#b0c4de',
      'lightyellow': '#ffffe0',
      'lime': '#00ff00',
      'limegreen': '#32cd32',
      'linen': '#faf0e6',
      'magenta': '#ff00ff',
      'maroon': '#800000',
      'mediumaquamarine': '#66cdaa',
      'mediumblue': '#0000cd',
      'mediumorchid': '#ba55d3',
      'mediumpurple': '#9370d8',
      'mediumseagreen': '#3cb371',
      'mediumslateblue': '#7b68ee',
      'mediumspringgreen': '#00fa9a',
      'mediumturquoise': '#48d1cc',
      'mediumvioletred': '#c71585',
      'midnightblue': '#191970',
      'mintcream': '#f5fffa',
      'mistyrose': '#ffe4e1',
      'moccasin': '#ffe4b5',
      'navajowhite': '#ffdead',
      'navy': '#000080',
      'oldlace': '#fdf5e6',
      'olive': '#808000',
      'olivedrab': '#6b8e23',
      'orange': '#ffa500',
      'orangered': '#ff4500',
      'orchid': '#da70d6',
      'palegoldenrod': '#eee8aa',
      'palegreen': '#98fb98',
      'paleturquoise': '#afeeee',
      'palevioletred': '#d87093',
      'papayawhip': '#ffefd5',
      'peachpuff': '#ffdab9',
      'peru': '#cd853f',
      'pink': '#ffc0cb',
      'plum': '#dda0dd',
      'powderblue': '#b0e0e6',
      'purple': '#800080',
      'red': '#ff0000',
      'rosybrown': '#bc8f8f',
      'royalblue': '#4169e1',
      'saddlebrown': '#8b4513',
      'salmon': '#fa8072',
      'sandybrown': '#f4a460',
      'seagreen': '#2e8b57',
      'seashell': '#fff5ee',
      'sienna': '#a0522d',
      'silver': '#c0c0c0',
      'skyblue': '#87ceeb',
      'slateblue': '#6a5acd',
      'slategray': '#708090',
      'slategrey': '#708090',
      'snow': '#fffafa',
      'springgreen': '#00ff7f',
      'steelblue': '#4682b4',
      'tan': '#d2b48c',
      'teal': '#008080',
      'thistle': '#d8bfd8',
      'tomato': '#ff6347',
      'turquoise': '#40e0d0',
      'violet': '#ee82ee',
      'wheat': '#f5deb3',
      'white': '#ffffff',
      'whitesmoke': '#f5f5f5',
      'yellow': '#ffff00',
      'yellowgreen': '#9acd32'
    };
  
    this.CURENT_TYPE_DOTS = "DOTS";
    this.CURENT_TYPE_DASHES = "DASHES";
  
    this.FRACTIONAL_DIGITS = 2;
    this.CURRENT_SEGMENT_LENGTH = 16;
    this.WIRE_POSTS = true;
  
    // Line Widths:
    this.POST_RADIUS = 2;
    this.CURRENT_RADIUS = 2;
    this.CURRENT_COLOR = "rgba(255, 255, 255, 0.7)";
    this.LINE_WIDTH = 2;
    this.BOLD_LINE_WIDTH = 2;
  
    // Grid
    this.GRID_SIZE = 8;
    this.SMALL_GRID = false;
  
    this.SHOW_VALUES = false;
  
    this.CURRENT_DISPLAY_TYPE = "DASHES";
  
    // ColorPalettes:
    this.SELECT_COLOR = ColorPalette.yellow;
    this.HIGHLIGHT_COLOR = ColorPalette.orange;
    this.POST_COLOR = ColorPalette.black;
    this.DOTS_COLOR = ColorPalette.yellow;
    this.DOTS_OUTLINE = ColorPalette.orange;
  
    this.TEXT_COLOR = ColorPalette.black;
    this.TEXT_ERROR_COLOR = ColorPalette.red;
    this.TEXT_WARNING_COLOR = ColorPalette.yellow;
  
    this.SELECTION_MARQUEE_COLOR = ColorPalette.orange;
  
    this.GREY = "#666";
    this.GRAY = "#666";
  
    this.LIGHT_POST_COLOR = "#333";
    this.COMPONENT_DECIMAL_PLACES = 1;

    this.GRID_COLOR = ColorPalette.darkyellow;
    this.SWITCH_COLOR = "#333";
    this.FILL_COLOR = ColorPalette.white;
    this.BG_COLOR = ColorPalette.white;
    this.FG_COLOR = ColorPalette.white;
    this.STROKE_COLOR = ColorPalette.black;
    this.ERROR_COLOR = ColorPalette.darkred;
    this.WARNING_COLOR = ColorPalette.orange;
  }
}
Settings.initClass();

module.exports = Settings;
