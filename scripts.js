function Get(yourUrl) {
    var Httpreq = new XMLHttpRequest()
    Httpreq.open("GET", yourUrl, false)
    Httpreq.send(null)
    return Httpreq.responseText
}

function add_text(parent, text) {
	var text_node = document.createTextNode(text)
	parent.appendChild(text_node)
}

function add_element(parent, tag, text, classname=null) {
	var div = document.createElement(tag)
	if (classname) {
		div.className = classname
	}
	add_text(div, text)
	parent.appendChild(div)
}

function build_word(word) {
	var word_container = document.createElement("div")
	word_container.id = word["id"]
	word_container.className = "entry"
	
	if (word["source"]) {
		add_element(word_container, "div", word["source"], "source")
	}
	if (word["creator"]) {
		add_element(word_container, "div", word["creator"], "creator")
	}

	if (word["etymology"]) {
		add_element(word_container, "div", word["etymology"], "etymology")
	}
	if (word["coined"]) {
		add_element(word_container, "div", word["coined"], "coined")
	}
	if (word["book"]) {
		add_element(word_container, "div", word["book"], "book")
	}
	
	if (word["sitelen_pona"]) {
		add_element(word_container, "div", word["sitelen_pona"], "sitelenpona")
	}
	add_element(word_container, "div", word["word"], "word")
	add_element(word_container, "div", word["def_english"], "definition")
	
	return word_container
}

function generate_words() {
	for (var i = 0; i < data.length; i++) {
		dictionary = document.getElementById("dictionary")
		word = build_word(data[i])
		dictionary.appendChild(word)
		dictionary.appendChild(document.createElement("hr"))
	}
}

const data_url = "https://lipu-linku.github.io/jasima/data.json"
var data = JSON.parse(Get(data_url))