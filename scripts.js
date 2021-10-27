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
		if (localStorage.getItem(books_to_checkboxes[data[i]["book"]]) === "true") {
			dictionary.appendChild(build_word(data[i]))
		}
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
	
	word_container.appendChild(document.createElement("hr"))
	
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
	// Select book
	book_select_default()
	// Generate words
	fill_dictionary()
	// Satisfy search bar
	search_changed(document.getElementById("searchbar"))
}

function build_select_option(option_value, text) {
	option_node = document.createElement("option")
	option_node.value = option_value
	option_node.appendChild(build_text(text))
	return option_node
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

function book_select_default() {
	if (!localStorage.getItem("checkbox_pu")) {
		localStorage.setItem("checkbox_pu", true)
	}
	if (!localStorage.getItem("checkbox_kusuli")) {
		localStorage.setItem("checkbox_kusuli", true)
	}
	if (!localStorage.getItem("checkbox_kulili")) {
		localStorage.setItem("checkbox_kulili", false)
	}
	if (!localStorage.getItem("checkbox_none")) {
		localStorage.setItem("checkbox_none", false)
	}
	book_selector = document.getElementById("book_selector")
	for (var i = 0; i < checkbox_names.length; i++) {
		book_selector.appendChild(build_checkbox_option(checkbox_names[i], localStorage.getItem(checkbox_names[i]) === "true"))
	}
}
function build_checkbox_option(name, value) {
	container = document.createElement("label")
	container.className = "container"
	container.appendChild(build_text(checkbox_labels[name]))
	
	checkbox = document.createElement("input")
	checkbox.type = "checkbox"
	checkbox.id = name
	checkbox.checked = value
	checkbox.onchange = book_select_changed
	
	container.appendChild(checkbox)
	
	checkmark = document.createElement("span")
	checkmark.className = "checkmark"
	container.appendChild(checkmark)
	return container
	/*checkbox = document.createElement("input")
	checkbox.type = "checkbox"
	checkbox.id = name
	checkbox.checked = value
	checkbox.onchange = book_select_changed
	return checkbox*/
}
function book_select_changed() {
	for (var i = 0; i < checkbox_names.length; i++) {
		if ((localStorage.getItem(checkbox_names[i]) === "true") != document.getElementById(checkbox_names[i]).checked) {
			if (localStorage.getItem(checkbox_names[i]) === "true") {
				localStorage.setItem(checkbox_names[i], false)
			} else {
				localStorage.setItem(checkbox_names[i], true)
			}
		}
	}
	clear_dictionary()
	fill_dictionary()
}

function search_changed(searchbar) {
	search = searchbar.value.trim()
	entries = document.getElementsByClassName("entry")
	for (var i = 0; i < entries.length; i++) {
		if (entries[i].id.startsWith(search)) {
			entries[i].style.display = "grid"
		} else {
			entries[i].style.display = "none"
		}
	}
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
const checkbox_names = ["checkbox_pu", "checkbox_kusuli", "checkbox_kulili", "checkbox_none"]
const books_to_checkboxes = {"pu": "checkbox_pu", "ku suli": "checkbox_kusuli", "ku lili": "checkbox_kulili", "none": "checkbox_none"}
const checkbox_labels = {"checkbox_pu": "show pu words", "checkbox_kusuli": "show ku suli words", "checkbox_kulili": "show ku lili words", "checkbox_none": "show other words"}