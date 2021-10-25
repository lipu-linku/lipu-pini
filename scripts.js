function Get(yourUrl) {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

function add_text(parent_node, text) {
	var text_node = document.createTextNode(text);
	parent_node.appendChild(text_node);
}

function build_word(word) {
	var p = document.getElementsByTagName("p")[0];
	var content = word["word"] + "	" + word["def_english"]
	add_text(p, content);
	p.appendChild(document.createElement("br"))
}

function generate_words() {
	for (var i = 0; i < data.length; i++) {
		build_word(data[i])
	}
}

const data_url = "https://lipu-linku.github.io/jasima/data.json"
var data = JSON.parse(Get(data_url));