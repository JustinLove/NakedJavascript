/*
===============================================================================
Chili is the jQuery code highlighter plugin
...............................................................................
                                               Copyright 2007 / Andrea Ercolino
-------------------------------------------------------------------------------
LICENSE: http://www.opensource.org/licenses/mit-license.php
WEBSITE: http://noteslog.com/chili/
===============================================================================
*/

/*
this file shows how to configure a static setup
it must be linked from the head of a page like:
<script type="text/javascript" src="chili/recipes.js"></script>
*/

ChiliBook.recipeLoading = false;


ChiliBook.recipes[ "html.js" ] = 
{
    steps: {
          mlcom : { exp: /\<!--(?:\w|\W)*?--\>/ }
        , tag   : { exp: /(?:\<\!?[\w:]+)|(?:\>)|(?:\<\/[\w:]+\>)|(?:\/\>)/ }
        , aname : { exp: /\s+?[\w-]+:?\w+(?=\s*=)/ }
        , avalue: { exp: /(=\s*)(([\"\'])(?:(?:[^\3\\]*?(?:\3\3|\\.))*?[^\3\\]*?)\3)/
			, replacement: '$1<span class="$0">$2</span>' }
        , entity: { exp: /&[\w#]+?;/ }
    }
};

ChiliBook.recipes[ "javascript.js" ] = 
{
	steps: {
		  mlcom   : { exp: /\/\*[^*]*\*+(?:[^\/][^*]*\*+)*\// }
		, com     : { exp: /\/\/.*/ }
		, regexp  : { exp: /\/[^\/\\\n]*(?:\\.[^\/\\\n]*)*\/[gim]*/ }
		, string  : { exp: /(?:\'[^\'\\\n]*(?:\\.[^\'\\\n]*)*\')|(?:\"[^\"\\\n]*(?:\\.[^\"\\\n]*)*\")/ }
		, numbers : { exp: /\b[+-]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?\b/ }
		, keywords: { exp: /\b(arguments|break|case|catch|continue|default|delete|do|else|false|for|function|if|in|instanceof|new|null|return|switch|this|true|try|typeof|var|void|while|with)\b/ }
		, global  : { exp: /\b(toString|valueOf|window|self|element|prototype|constructor|document|escape|unescape|parseInt|parseFloat|setTimeout|clearTimeout|setInterval|clearInterval|NaN|isNaN|Infinity)\b/ }
	}
};

ChiliBook.recipes[ "css.js" ] = 
{
	steps: {
		  mlcom : { exp: /\/\*[^*]*\*+(?:[^\/][^*]*\*+)*\// }
		, string: { exp: /(?:\'[^\'\\\n]*(?:\\.[^\'\\\n]*)*\')|(?:\"[^\"\\\n]*(?:\\.[^\"\\\n]*)*\")/ }
		, number: { exp: /(?:\b[+-]?(?:\d*\.?\d+|\d+\.?\d*))(?:%|(?:(?:px|pt|em|)\b))/ }
		, attrib: { exp: /\b(?:z-index|x-height|word-spacing|widths|width|widows|white-space|volume|voice-family|visibility|vertical-align|units-per-em|unicode-range|unicode-bidi|text-transform|text-shadow|text-indent|text-decoration|text-align|table-layout|stress|stemv|stemh|src|speech-rate|speak-punctuation|speak-numeral|speak-header|speak|slope|size|right|richness|quotes|position|play-during|pitch-range|pitch|pause-before|pause-after|pause|page-break-inside|page-break-before|page-break-after|page|padding-top|padding-right|padding-left|padding-bottom|padding|overflow|outline-width|outline-style|outline-color|outline|orphans|min-width|min-height|max-width|max-height|mathline|marks|marker-offset|margin-top|margin-right|margin-left|margin-bottom|margin|list-style-type|list-style-position|list-style-image|list-style|line-height|letter-spacing|height|font-weight|font-variant|font-style|font-stretch|font-size-adjust|font-size|font-family|font|float|empty-cells|elevation|display|direction|descent|definition-src|cursor|cue-before|cue-after|cue|counter-reset|counter-increment|content|color|clip|clear|centerline|caption-side|cap-height|bottom|border-width|border-top-width|border-top-style|border-top-color|border-top|border-style|border-spacing|border-right-width|border-right-style|border-right-color|border-right|border-left-width|border-left-style|border-left-color|border-left|border-color|border-collapse|border-bottom-width|border-bottom-style|border-bottom-color|border-bottom|border|bbox|baseline|background-repeat|background-position|background-image|background-color|background-attachment|background|azimuth|ascent)\b/ }
		, value : { exp: /\b(?:xx-small|xx-large|x-soft|x-small|x-slow|x-low|x-loud|x-large|x-high|x-fast|wider|wait|w-resize|visible|url|uppercase|upper-roman|upper-latin|upper-alpha|underline|ultra-expanded|ultra-condensed|tv|tty|transparent|top|thin|thick|text-top|text-bottom|table-row-group|table-row|table-header-group|table-footer-group|table-column-group|table-column|table-cell|table-caption|sw-resize|super|sub|status-bar|static|square|spell-out|speech|solid|soft|smaller|small-caption|small-caps|small|slower|slow|silent|show|separate|semi-expanded|semi-condensed|se-resize|scroll|screen|s-resize|run-in|rtl|rightwards|right-side|right|ridge|rgb|repeat-y|repeat-x|repeat|relative|projection|print|pre|portrait|pointer|overline|outside|outset|open-quote|once|oblique|nw-resize|nowrap|normal|none|no-repeat|no-open-quote|no-close-quote|ne-resize|narrower|n-resize|move|mix|middle|message-box|medium|marker|ltr|lowercase|lower-roman|lower-latin|lower-greek|lower-alpha|lower|low|loud|local|list-item|line-through|lighter|level|leftwards|left-side|left|larger|large|landscape|justify|italic|invert|inside|inset|inline-table|inline|icon|higher|high|hide|hidden|help|hebrew|handheld|groove|format|fixed|faster|fast|far-right|far-left|fantasy|extra-expanded|extra-condensed|expanded|embossed|embed|e-resize|double|dotted|disc|digits|default|decimal-leading-zero|decimal|dashed|cursive|crosshair|cross|crop|counters|counter|continuous|condensed|compact|collapse|code|close-quote|circle|center-right|center-left|center|caption|capitalize|braille|bottom|both|bolder|bold|block|blink|bidi-override|below|behind|baseline|avoid|auto|aural|attr|armenian|always|all|absolute|above)\b/ }
		, color : { exp: /(?:\#[a-zA-Z0-9]{3,6})|(?:yellow|white|teal|silver|red|purple|olive|navy|maroon|lime|green|gray|fuchsia|blue|black|aqua)/ }
	}
};
