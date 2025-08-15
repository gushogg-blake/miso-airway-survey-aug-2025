<script>
import {_typeof} from "utils";
import inlineStyle from "utils/dom/inlineStyle";

export let width = null;
export let height = null;
export let widthEm = null;
export let heightEm = null;
export let widthRem = null;
export let heightRem = null;

function getValue(pxOrNameValue, emValue, remValue) {
	if (emValue) {
		return emValue + "em";
	} else if (remValue) {
		return remValue + "rem";
	}
	
	let value = pxOrNameValue;
	
	if (value === null) {
		return "100%";
	} else if (_typeof(value) === "Number") {
		return value;
	} else {
		return "--var(gap-" + value + ")";
	}
}

$: style = {
	width: getValue(width, widthEm, widthRem),
	height: getValue(height, heightEm, heightRem),
};
</script>

<div id="main" style={inlineStyle(style)}></div>
