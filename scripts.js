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
	for (var id in data) {
		if (!show_word) {
			if (localStorage.getItem(books_to_checkboxes[data[id]["book"]]) === "true") {
				dictionary.appendChild(build_word(id, data[id]))
			}
		} else {
			if (show_word == id) {
				dictionary.appendChild(build_word(id, data[id]))
			}
		}
	}
	search_changed(document.getElementById("searchbar"))
}
function clear_dictionary() {
	dictionary = document.getElementById("dictionary")
	while (dictionary.firstChild) {
		dictionary.removeChild(dictionary.lastChild)
	}
}

function build_word(id, word) {
	var word_container = document.createElement("div")
	word_container.id = id
	word_container.className = "entry"
	
	word_container.appendChild(document.createElement("hr"))
	
	if (word["source_language"]) {
		word_container.appendChild(build_element("div", word["source_language"], "sourcelanguage"))
	}
	if (word["creator"]) {
		word_container.appendChild(build_element("div", word["creator"], "creator"))
	}

	if (word["etymology"]) {
		word_container.appendChild(build_element("div", word["etymology"], "etymology"))
	}
	coined = [word["coined_year"] ? word["coined_year"] + " " : "", word["coined_era"] ? "(" + word["coined_era"] + ")" : ""].join(" ")
	if (coined) {
		word_container.appendChild(build_element("div", coined, "coined"))
	}
	if (word["book"]) {
		word_container.appendChild(build_element("div", word["book"], "book"))
	}
	if (word["recognition"]) {
		for (var date in word["recognition"]) {
			percent = word["recognition"][date]
			recognition = "recognition: " + percent + "% (" + date + ")"
			word_container.appendChild(build_element("div", recognition, "recognition"))
			break
		}
	}
	
	if (word["sitelen_pona"]) {
		word_container.appendChild(build_element("div", word["sitelen_pona"], "sitelenpona"))
	}
	word_container.appendChild(build_element("div", word["word"], "word"))
	// The switch statement is temporary!
	
	definition = word["def"][localStorage.getItem("selected_language")]
	if (definition) {
		word_container.appendChild(build_element("div", definition, "definition"))
	} else {
		word_container.appendChild(build_element("div", "(en) " + word["def"]["en"], "shaded definition"))
	}
	if (word["sitelen_sitelen"]) {
		sitelen_sitelen = document.createElement("img")
		sitelen_sitelen.className = "sitelensitelen"
		//sitelen_sitelen.style.filter = "invert(100%)"
		//sitelen_sitelen.style.height = "50px"
		//sitelen_sitelen.style.width = "50px"
		//sitelen_sitelen.style.margin = "auto"
		sitelen_sitelen.src = word["sitelen_sitelen"]
		word_container.appendChild(sitelen_sitelen)
	}
	if (word["see_also"]) {
		word_container.appendChild(build_element("div", "{see " + word["see_also"] + "}", "seealso"))
	}
	if (word["ku_data"]) {
		word_container.appendChild(build_element("div", word["ku_data"], "kudata"))
	}
	if (word["commentary"]) {
		word_container.appendChild(build_element("div", word["commentary"], "commentary"))
	}
	
	
	return word_container
}

function main() {
	if (urlParams.get('q')) {
		single_word_mode()
	}
	// Select language
	language_select_default()
	// Select book
	book_select_default()
	// Generate words
	fill_dictionary()
	
	// Yes, it doesn't belong here. yes, its a hack. no, i don't care
	checkbox_ku_data = document.getElementById("checkbox_ku_data")
	checkbox_ku_data.checked = localStorage.display_ku_data === 'true';
	if (checkbox_ku_data.checked) document.body.classList.add('display_ku_data');
	checkbox_ku_data.addEventListener('change', function(e) {
		localStorage.display_ku_data = e.target.checked;
		if (e.target.checked) document.body.classList.add('display_ku_data');
		else document.body.classList.remove('display_ku_data')
	});
	// Yes, its the same code copied twice. no, i don't care
	checkbox_light_mode = document.getElementById("checkbox_light_mode")
	checkbox_light_mode.checked = localStorage.light_mode === 'true';
	if (checkbox_light_mode.checked) document.body.classList.add('light_mode');
	checkbox_light_mode.addEventListener('change', function(e) {
		localStorage.light_mode = e.target.checked;
		if (e.target.checked) document.body.classList.add('light_mode');
		else document.body.classList.remove('light_mode')
	});
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
	for (var id in languages) {
		option = build_select_option(id, languages[id]["name_endonym"])
		if (id == localStorage.getItem("selected_language")) {
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
		if (entries[i].id.includes(search)) {
			entries[i].style.display = ""
		} else {
			entries[i].style.display = "none"
		}
	}
}

function single_word_mode() {
	show_word = urlParams.get('q')
	document.getElementById("searchbar").value = ""
	document.getElementById("book_selector").style.display = "none"
	document.getElementById("searchbar").style.display = "none"
	document.getElementById("normal_mode_button").style.display = "initial"
	/*normal_mode_button = document.createElement("button")
	normal_mode_button.appendChild(build_text("Show other words"))
	normal_mode_button.id = "normal_mode_button"
	normal_mode_button.addEventListener("click", normal_mode)
	document.getElementsByClassName("page_width_limiter")[0].appendChild(normal_mode_button)*/
}
function normal_mode() {
	show_word = null
	clear_dictionary()
	fill_dictionary()
	document.getElementById("book_selector").style.display = ""
	document.getElementById("searchbar").style.display = ""
	document.getElementById("normal_mode_button").style.display = "none"
}


const bundle_url = "https://lipu-linku.github.io/jasima/data.json"
const bundle = JSON.parse(Get(bundle_url))
const data = bundle["data"]
const languages = bundle["languages"]

const checkbox_names = ["checkbox_pu", "checkbox_kusuli", "checkbox_kulili", "checkbox_none"]
const books_to_checkboxes = {"pu": "checkbox_pu", "ku suli": "checkbox_kusuli", "ku lili": "checkbox_kulili", "none": "checkbox_none"}
const checkbox_labels = {"checkbox_pu": "show pu words", "checkbox_kusuli": "show ku suli words", "checkbox_kulili": "show ku lili words", "checkbox_none": "show other words"}
const urlParams = new URLSearchParams(window.location.search)
var show_word = null
