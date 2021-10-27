function Get(yourUrl) {
    var Httpreq = new XMLHttpRequest()
    Httpreq.open("GET", yourUrl, false)
    Httpreq.send(null)
    return Httpreq.responseText
}

function build_text(text) {
	return document.createTextNode(text)
}

function build_element(tag, text, classname=null) {
	var div = document.createElement(tag)
	if (classname) {
		div.className = classname
	}
	div.appendChild(build_text(text))
	return div
}

function build_word(word) {
	var word_container = document.createElement("div")
	word_container.id = word["id"]
	word_container.className = "entry"
	
	if (word["source"]) {
		word_container.appendChild(build_element("div", word["source"], "source"))
	}
	if (word["creator"]) {
		word_container.appendChild(build_element("div", word["creator"], "creator"))
	}

	if (word["etymology"]) {
		word_container.appendChild(build_element("div", word["etymology"], "etymology"))
	}
	if (word["coined"]) {
		word_container.appendChild(build_element("div", word["coined"], "coined"))
	}
	if (word["book"]) {
		word_container.appendChild(build_element("div", word["book"], "book"))
	}
	
	if (word["sitelen_pona"]) {
		sp = build_element("div", word["sitelen_pona"], "sitelenpona")
		//<div style="display:flex;justify-content:center;align-items:center;">Text Content</div>//
		sp.style.display = "flex"
		sp.style.justifyContent = "center"
		sp.style.alignItems = "center"
		word_container.appendChild(sp)
	}
	word_container.appendChild(build_element("div", word["word"], "word"))
	word_container.appendChild(build_element("div", word["def_english"], "definition"))
	
	return word_container
}

function main() {
	// Generate words
	for (var i = 0; i < data.length; i++) {
		dictionary = document.getElementById("dictionary")
		dictionary.appendChild(build_word(data[i]))
		dictionary.appendChild(document.createElement("hr"))
	}
}

const data_url = "https://lipu-linku.github.io/jasima/data.json"
var data = JSON.parse(Get(data_url))