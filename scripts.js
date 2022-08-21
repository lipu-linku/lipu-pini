String.prototype.fuzzy = function(s) {
    var i = 0, n = -1, l;
    for (; l = s[i++];) if (!~(n = this.indexOf(l, n + 1))) return false;
    return true;
};

function Get(yourUrl) {
    var Httpreq = new XMLHttpRequest()
    Httpreq.open("GET", yourUrl, false)
    Httpreq.send(null)
    return Httpreq.responseText
}

function build_text(text) {
    return document.createTextNode(text)
}

const tag_link_map = { "a": "href", "audio": "src", "video": "src", "img": "src" }

function build_element(tag, text, classname = null, src = null) {
    var div = document.createElement(tag)
    if (classname) {
        div.className = classname
    }
    if (src) {
        div[tag_link_map[tag]] = src
    }
    div.appendChild(build_text(text))
    return div
}

function fill_dictionary() {
    dictionary = document.getElementById("dictionary")
    if (show_word) {
        dictionary.appendChild(build_word(show_word, data[show_word], true))
        return;
    } else {
        for (var id in data) {
            if (localStorage.getItem(books_to_checkboxes[data[id]["book"]]) === "true") {
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

function build_word(id, word, force = false) {
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
        // Iterating over an object in reverse. this feels dirty.
        for (var date in Object.fromEntries(Object.entries(word["recognition"]).reverse())) {
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
        word_container.appendChild(build_element("img", "", "sitelensitelen", word["sitelen_sitelen"]))
    }
    if (word["see_also"]) {
        word_container.appendChild(build_element("div", "{see " + word["see_also"] + "}", "seealso"))
    }
    var details = document.getElementById("checkbox_detailed").checked
    if (details === true | force === true) {
        var details_div = build_element("div", "", "details")
        var details_container = build_element("details", "")
        details_container.appendChild(build_element("summary", "more info"))
        details_container.appendChild(details_div)

        if (word["commentary"]) {
            details_div.appendChild(build_element("div", word["commentary"], "commentary"))
        }
        if (word["ku_data"]) {
            details_div.appendChild(build_element("div", word["ku_data"], "kudata"))
        }
        if (word["sitelen_pona_etymology"]) {
            details_div.appendChild(build_element("div", word["sitelen_pona_etymology"], "sitelenponaetymology", word["sitelen_pona_etymology"]))
        }

        // NOTE: not currently working; third party links to the site won't load the image
        if (word["luka_pona"]) {
            details_div.appendChild(build_element("div", "luka pona coming later!", "lukapona"))
            // details_div.appendChild(build_element("img", "", "lukapona", word["luka_pona"]["gif"]))
        }
        if (word["sitelen_emosi"]) {
            details_div.appendChild(build_element("div", word["sitelen_emosi"], "sitelenemosi"))
        }

        if (word["audio"]) {
            audio_kalaasi = build_element("a", "kala asi speaks", "audio_kalaasi", word["audio"]["kala_asi"])
            audio_janlakuse = build_element("a", "jan lakuse speaks", "audio_janlakuse", word["audio"]["jan_lakuse"])
            // audio_kalaasi = build_element("audio", "", "audio_kalaasi", word["audio"]["kala_asi"])
            // audio_janlakuse = build_element("audio", "", "audio_janlakuse", word["audio"]["jan_lakuse"])
            // audio_kalaasi.controls = true
            // audio_janlakuse.controls = true
            details_div.appendChild(audio_kalaasi)
            details_div.appendChild(audio_janlakuse)
        }

        // TODO: hide or show by default?
        details_container.open = true;
        if (details_div.childNodes.length > 1) {
            // only append if non-empty; # text is present tho
            word_container.appendChild(details_container)
        }
    }


    return word_container
}

function main() {
    if (urlParams.get('q')) {
        single_word_mode()
    }
    // Select language
    language_select_default()
    // Select options
    checkbox_select_default()
    // Generate words
    fill_dictionary()

    checkbox_lightmode = document.getElementById("checkbox_lightmode")
    checkbox_lightmode.checked = localStorage.checkbox_lightmode === 'true';
    if (checkbox_lightmode.checked) {
        document.body.classList.add('lightmode');
    }
    checkbox_lightmode.addEventListener('change', function(e) {
        localStorage.checkbox_lightmode = e.target.checked;
        if (e.target.checked) { document.body.classList.add('lightmode'); }
        else document.body.classList.remove('lightmode')
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

function checkbox_select_default() {
    for (let [checkbox, dvalue] of Object.entries(checkbox_defaults)) {
        if (!localStorage.getItem(checkbox)) {
            localStorage.setItem(checkbox, dvalue)
        }
    }
    for (let [checkbox_div, checkboxes] of Object.entries(selector_map)) {
        div = document.getElementById(checkbox_div);
        for (const checkbox of checkboxes) {
            div.appendChild(build_checkbox_option(checkbox, localStorage.getItem(checkbox) === "true"))
        }
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
    checkbox.onchange = checkbox_changed
    checkbox.autocomplete = 'off' // prevent refresh refill; only localStorage
    container.appendChild(checkbox)

    checkmark = document.createElement("span")
    checkmark.className = "checkmark"
    container.appendChild(checkmark)
    return container
    /*checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.id = name
    checkbox.checked = value
    checkbox.onchange = checkbox_changed
    return checkbox*/
}
function checkbox_changed() {
    for (let checkbox of Object.keys(checkbox_labels)) {
        let is_checked = document.getElementById(checkbox).checked

        // only store if it had a default
        if (checkbox in checkbox_defaults) {
            localStorage.setItem(checkbox, is_checked)
        }
    }
    clear_dictionary()
    fill_dictionary()
}

function str_matches(str1, str2) {
    // ignore_diacritics = document.getElementById("checkbox_ignore_diacritics").checked
    // if (ignore_diacritics) { }
    // ignore_case = document.getElementById("checkbox_ignore_case").checked
    // if (ignore_case) { }
    str1 = str1.normalize("NFD").replace(/\p{Diacritic}/gu, "")
    str2 = str2.normalize("NFD").replace(/\p{Diacritic}/gu, "")
    str1 = str1.toLowerCase()
    str2 = str2.toLowerCase()
    definition_search = document.getElementById("checkbox_definitions").checked
    if (definition_search) { // INTENDED: don't fuzzy search defs, it sucks
        return str1.includes(str2);
    } return str1.fuzzy(str2)
}

function search_changed(searchbar) {
    search = searchbar.value.trim()
    search_defs = document.getElementById("checkbox_definitions").checked
    entries = document.getElementsByClassName("entry")
    for (var i = 0; i < entries.length; i++) {
        var match = entries[i].id
        if (search_defs) {
            match = entries[i].querySelector(".definition").textContent
        }

        if (str_matches(match, search)) {
            entries[i].style.display = ""
        } else {
            entries[i].style.display = "none"
        }
    }
}

function single_word_mode() {
    show_word = urlParams.get('q')
    document.getElementById("searchbar").value = ""
    for (let checkbox_div of Object.keys(selector_map)) {
        document.getElementById(checkbox_div).style.display = "none"
    }
    document.getElementById("searchbar").style.display = "none"
    document.getElementById("normal_mode_button").style.display = "initial"
}
function normal_mode() {
    show_word = null
    clear_dictionary()
    fill_dictionary()
    for (let checkbox_div of Object.keys(selector_map)) {
        document.getElementById(checkbox_div).style.display = ""
    }
    document.getElementById("searchbar").style.display = ""
    document.getElementById("normal_mode_button").style.display = "none"
    window.location.search = "" // remove query from url
}


const bundle_url = "https://lipu-linku.github.io/jasima/data.json"
const bundle = JSON.parse(Get(bundle_url))
const data = bundle["data"]
const languages = bundle["languages"]

const selector_map = {
    // these keys must have a corresponding div in index.html
    "book_selector": [
        "checkbox_pu",
        "checkbox_kusuli",
        "checkbox_kulili",
        "checkbox_none",
    ],
    "search_selector": [
    ],
    "settings_selector": [
        "checkbox_lightmode",
        "checkbox_detailed",
        "checkbox_definitions",
        // TODO: move 'definitions' to search selector
        // whenever the page looks prettier
    ]
}
const books_to_checkboxes = {
    "pu": "checkbox_pu",
    "ku suli": "checkbox_kusuli",
    "ku lili": "checkbox_kulili",
    "none": "checkbox_none"
}
const checkbox_labels = {
    "checkbox_pu": "pu words",
    "checkbox_kusuli": "ku suli words",
    "checkbox_kulili": "ku lili words",
    "checkbox_none": "other words",
    "checkbox_definitions": "definition search",
    "checkbox_detailed": "detailed mode",
    "checkbox_lightmode": "light mode"
}

// must be strings bc localstorage only saves strings
const checkbox_defaults = {
    "checkbox_pu": 'true',
    "checkbox_kusuli": 'true',
    "checkbox_kulili": 'false',
    "checkbox_none": 'false',
    // "checkbox_definitions": 'false',  // do not save, user consideration
    // "checkbox_detailed": 'false', // INTENDED: do not save this setting, it's Laggy
    "checkbox_lightmode": 'false',
}
const urlParams = new URLSearchParams(window.location.search)
var show_word = null
