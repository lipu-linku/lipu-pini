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
	add_element(word_container, "div", word["word"], "word")
	add_element(word_container, "div", word["book"], "book")
	add_element(word_container, "div", word["def_english"], "def_english")
	
	var etymology_container = document.createElement("div")
	add_element(etymology_container, "span", "← ")
	add_element(etymology_container, "span", word["source"], "source")
	add_element(etymology_container, "span", " ")
	add_element(etymology_container, "span", word["etymology"], "etymology")
	word_container.appendChild(etymology_container)

	var creation_container = document.createElement("div")
	add_element(creation_container, "span", "created by ")
	add_element(creation_container, "span", word["creator"], "creator")
	add_element(creation_container, "span", " in ")
	add_element(creation_container, "span", word["coined"], "coined")
	word_container.appendChild(creation_container)
	
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