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

function fill_dictionary() {
	dictionary = document.getElementById("dictionary")
	for (var i = 0; i < data.length; i++) {
		dictionary.appendChild(build_word(data[i]))
		dictionary.appendChild(document.createElement("hr"))
	}
}
function clear_dictionary() {
	dictionary = document.getElementById("dictionary")
	while (dictionary.firstChild) {
		dictionary.removeChild(dictionary.lastChild)
	}
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
		word_container.appendChild(build_element("div", word["sitelen_pona"], "sitelenpona"))
	}
	word_container.appendChild(build_element("div", word["word"], "word"))
	// The switch statement is temporary!
	
	definition = word[language_keys[localStorage.getItem("selected_language")]]
	if (definition) {
		word_container.appendChild(build_element("div", definition, "definition"))
	} else {
		word_container.appendChild(build_element("div", "(en) " + word["def_english"], "shaded definition"))
	}
	
	
	return word_container
}

function main() {
	// Select language
	language_select_default()
	// Generate words
	fill_dictionary()
}

function language_select_default() {
	if (!localStorage.getItem("selected_language")) {
		localStorage.setItem("selected_language", "en")
	}
	
	language_selector = document.getElementById("language_selector")
	for (var key in languages) {
		option = build_select_option(key, languages[key])
		if (key == localStorage.getItem("selected_language")) {
			option.selected = true
		}
		language_selector.appendChild(option)
	}
}
function language_select_changed(select_node) {
	selected_option = select_node.options[select_node.selectedIndex]
	localStorage.setItem("selected_language", selected_option.value)
	clear_dictionary()
	fill_dictionary()
}

function build_select_option(option_value, text) {
	option_node = document.createElement("option")
	option_node.value = option_value
	option_node.appendChild(build_text(text))
	return option_node
}
const data_url = "https://lipu-linku.github.io/jasima/data.json"
var data = JSON.parse(Get(data_url))
const languages = {
	"eo": "Esperanto",
	"en": "English",
	"de": "Deutsch",
	"hi": "हिंदी",
	"id": "bahasa Indonesia",
	"pl": "Polski",
	"pa": "ਪੰਜਾਬੀ",
	"ru": "Русский",
	"es": "Español",
	"tok": "toki pona",
	"ur": "اردو"
}
const language_keys = {
	"eo": "def_esperanto",
	"en": "def_english",
	"de": "def_german",
	"hi": "def_hindi",
	"id": "def_indonesian",
	"pl": "def_polish",
	"pa": "def_punjabi",
	"ru": "def_russian",
	"es": "def_spanish",
	"tok": "def_toki_pona",
	"ur": "def_urdu"
}