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

function add_text_element(parent, text, classname) {
	var div = document.createElement("div")
	div.className = classname
	add_text(div, text)
	parent.appendChild(div)
}

function build_word(word) {
	var word_container = document.createElement("div")
	add_text_element(word_container, word["word"], "word")
	add_text_element(word_container, word["book"], "book")
	add_text_element(word_container, word["def_english"], "def_english")
	add_text_element(word_container, word["etymology"], "etymology")
	add_text_element(word_container, word["creator"], "creator")
	word_container.appendChild(document.createElement("br"))
	return word_container
}

function generate_words() {
	for (var i = 0; i < data.length; i++) {
		dictionary = document.getElementById("dictionary")
		word = build_word(data[i])
		dictionary.appendChild(word)
	}
}

const data_url = "https://lipu-linku.github.io/jasima/data.json"
var data = JSON.parse(Get(data_url))