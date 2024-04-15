"use strict";
// === BEGIN: MIT license from https://github.com/gustf/js-levenshtein/blob/master/LICENSE
const levenshtein = (function () {
  function _min(d0, d1, d2, bx, ay) {
    return d0 < d1 || d2 < d1
      ? d0 > d2
        ? d2 + 1
        : d0 + 1
      : bx === ay
      ? d1
      : d1 + 1;
  }

  return function (a, b) {
    if (a === b) {
      return 0;
    }

    if (a.length > b.length) {
      var tmp = a;
      a = b;
      b = tmp;
    }

    var la = a.length;
    var lb = b.length;

    while (la > 0 && a.charCodeAt(la - 1) === b.charCodeAt(lb - 1)) {
      la--;
      lb--;
    }

    var offset = 0;

    while (offset < la && a.charCodeAt(offset) === b.charCodeAt(offset)) {
      offset++;
    }

    la -= offset;
    lb -= offset;

    if (la === 0 || lb < 3) {
      return lb;
    }

    var x = 0;
    var y;
    var d0;
    var d1;
    var d2;
    var d3;
    var dd;
    var dy;
    var ay;
    var bx0;
    var bx1;
    var bx2;
    var bx3;

    var vector = [];

    for (y = 0; y < la; y++) {
      vector.push(y + 1);
      vector.push(a.charCodeAt(offset + y));
    }

    var len = vector.length - 1;

    for (; x < lb - 3; ) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      bx1 = b.charCodeAt(offset + (d1 = x + 1));
      bx2 = b.charCodeAt(offset + (d2 = x + 2));
      bx3 = b.charCodeAt(offset + (d3 = x + 3));
      dd = x += 4;
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        ay = vector[y + 1];
        d0 = _min(dy, d0, d1, bx0, ay);
        d1 = _min(d0, d1, d2, bx1, ay);
        d2 = _min(d1, d2, d3, bx2, ay);
        dd = _min(d2, d3, dd, bx3, ay);
        vector[y] = dd;
        d3 = d2;
        d2 = d1;
        d1 = d0;
        d0 = dy;
      }
    }

    for (; x < lb; ) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      dd = ++x;
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        vector[y] = dd = _min(dy, d0, dd, bx0, vector[y + 1]);
        d0 = dy;
      }
    }

    return dd;
  };
})();
// END: MIT license

String.prototype.fuzzy = function (s) {
  var i = 0,
    n = -1,
    l;
  for (; (l = s[i++]); ) if (!~(n = this.indexOf(l, n + 1))) return false;
  return true;
};

function Get(yourUrl) {
  var Httpreq = new XMLHttpRequest();
  Httpreq.open("GET", yourUrl, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}

function build_text(text) {
  return document.createTextNode(text);
}

const tag_link_map = { a: "href", audio: "src", video: "src", img: "src" };

function build_element(tag, text, classname = null, src = null) {
  var div = document.createElement(tag);
  if (classname) {
    div.className = classname;
  }
  if (src) {
    div[tag_link_map[tag]] = src;
  }
  div.appendChild(build_text(text));
  return div;
}

function set_visibility(elem, display) {
  if (elem) {
    elem.style.display = display;
  }
}

function find_vis_state(search_term, id, word_elem) {
  if (show_word === id) {
    return "";
  }

  let usage_cat_set = localStorage.getItem(
    usages_to_checkboxes[data[id]["usage_category"]]
  );
  // hide if not in current usage categories
  if (usage_cat_set !== "true") return "none";
  if (search_term === "") return ""; // no need to check search behaviors

  let match = id;
  if (should_search_definitions) {
    match = word_elem.querySelector(".definition").textContent;
  }

  return str_matches(match, search_term) ? "" : "none";
}

function __update_visibility(search_term) {
  // returns whether at least one word would have been visible
  let dictionary = document.getElementById("dictionary");
  let any_visible = false;
  for (var id in data) {
    let word = dictionary.querySelector("#" + id);
    let vis_state = find_vis_state(search_term, id, word);
    if (vis_state === "") {
      any_visible = true;
    }

    set_visibility(word, vis_state);
  }
  return any_visible;
}

function update_visibility(search_term) {
  // works together with search_changed, but solely changes visibility
  // NOTE: disable definition search at start so we always switch back to word search on time
  should_search_definitions = false;
  let any_visible = __update_visibility(search_term);
  if (!any_visible) {
    // no words were visible, so retry with def search on
    should_search_definitions = true;
    __update_visibility(search_term);
  }
}

function fill_dictionary() {
  let dictionary = document.getElementById("dictionary");
  if (show_word) {
    if (!(show_word in data)) {
      alert("Couldn't find word '" + show_word + "'!");
    }

    dictionary.appendChild(build_word(show_word, data[show_word]));
    return;
  } else {
    for (var id in data) {
      dictionary.appendChild(build_word(id, data[id]));
    }
  }
}
function clear_dictionary() {
  let dictionary = document.getElementById("dictionary");
  while (dictionary.firstChild) {
    dictionary.removeChild(dictionary.lastChild);
  }
}


function build_word(id, word) {
  let word_container = document.createElement("div");
  word_container.id = id;
  word_container.className = "entry";

  let word_compact = build_element("div", "", "word_compact");
  word_container.appendChild(word_compact);

  let sitelen_pona = word["representations"]["ligatures"][0] || "";
  word_compact.appendChild(
    build_element("div", sitelen_pona, "sitelenpona")
  );

  let word_main = build_element("div", "", "word_main");
  word_compact.appendChild(word_main);

  let word_info = build_element("div", "", "word_info");
  word_main.appendChild(word_info);

  word_info.appendChild(build_element("div", word["word"], "word"));

  let book = word["book"] || "none";

  let categories = word["usage_category"] || "";

  let usage_score = Object.values(word["usage"])[Object.values(word["usage"]).length - 1] || "0";
  categories = categories + "  ·  " + usage_score + "%";
  if (book !== "none") {
    categories = categories + "  ·  " + book;
  }

  word_info.appendChild(build_element("div", categories, "categories"));

  let definition = word["translations"][localStorage.getItem("selected_language")]["definition"];
  word_main.appendChild(build_element("div", definition, "definition"));

  if (localStorage.getItem("selected_layout") == "detailed" || urlParams.get("q")) {

    let word_detailed = build_element("div", "", "word_detailed");
    word_container.appendChild(word_detailed);

    let coined = "Coined";
    if (word["creator"].length > 0) {
      coined += " by " + word["creator"].join(", ");
    }
    if (word["coined_year"]) {
      coined += " in " + word["coined_year"];
    }

    let etymology = format_etymology(word);
    if (etymology) word_detailed.appendChild(build_element("div", etymology, "shaded"));

    let commentary = word["translations"][localStorage.getItem("selected_language")]["commentary"];
    if (commentary) word_detailed.appendChild(build_element("div", commentary, "shaded"));

    if (word["see_also"].length > 0) {
      let see_also_div = build_element("div", "{see ", "seealso shaded");
      let see_alsos = word["see_also"];
      for (let i = 0; i < see_alsos.length; i++) {
        let seen = see_alsos[i];
        see_also_div.appendChild(
          build_element("a", seen, "seealsolink", "#" + seen)
        );
        // why i didn't forEach
        if (i != see_alsos.length - 1) {
          see_also_div.appendChild(build_text(", "));
        }
      }
      see_also_div.appendChild(build_text("}"));
      word_detailed.appendChild(see_also_div);
    }

  }
  return word_container;
}

function format_etymology(word) {
  let coined = "Coined";
  if (word["creator"].length > 0) {
    coined += " by " + word["creator"].join(", ");
  }
  if (word["coined_year"]) {
    coined += " in " + word["coined_year"];
  }

  let etymology = [];
  let etymology_translated = word["translations"][localStorage.getItem("selected_language")]["etymology"];

  for (let i = 0; i < word["etymology"].length; i++) {
    let etym_alt = word["etymology"][i]["alt"];
    let etym_word = word["etymology"][i]["word"];
    let etym_defs = (etymology_translated.length > i) ? etymology_translated[i]["definition"] : "";
    let etym_lang = (etymology_translated.length > i) ? etymology_translated[i]["language"] : "";

    let etym_string = etym_lang;
    if (etym_word) etym_string += ` ${etym_word}`;
    if (etym_alt)  etym_string += ` ${etym_alt}`;
    if (etym_defs) etym_string += ` ‘${etym_defs}’`;
    etymology.push(etym_string);
  }
  let etymology_full = "from " + etymology.join("; ");
  if (coined != "Coined") {
    etymology_full = coined + "\u2002·\u2002" + etymology_full;
  }
  return etymology_full
}

function main() {
  if (urlParams.get("q")) {
    single_word_mode();
  }
  // Select layout
  layout_select_default();
  // Select language
  language_select_default();
  // Select options
  checkbox_select_default();
  // Generate words
  fill_dictionary();

  // show based on settings
  checkbox_changed();
  search_changed(document.getElementById("searchbar"));
  document.getElementById("searchbar").focus();
}

function build_select_option(option_value, text) {
  let option_node = document.createElement("option");
  option_node.value = option_value;
  option_node.appendChild(build_text(text));
  return option_node;
}
function layout_select_default() {
  if (!localStorage.getItem("selected_layout")) {
    localStorage.setItem("selected_layout", "compact");
  }
  let layout_selector = document.getElementById("layout_selector");
  for (let i = 0; i < layout_selector.children.length; i++) {
    if (layout_selector[i].value == localStorage.getItem("selected_layout")) {
      layout_selector[i].selected = true;
    }
  }
}
function layout_select_changed(select_node) {
  let selected_option = select_node.options[select_node.selectedIndex];
  localStorage.setItem("selected_layout", selected_option.value);
  clear_dictionary();
  fill_dictionary();
  search_changed(document.getElementById("searchbar"));
}

function language_select_default() {
  if (!localStorage.getItem("selected_language")) {
    localStorage.setItem("selected_language", "en");
  }

  let language_selector = document.getElementById("language_selector");
  for (let id in languages) {
    let option = build_select_option(id, languages[id]["name"]["endonym"]);
    if (id == localStorage.getItem("selected_language")) {
      option.selected = true;
    }
    language_selector.appendChild(option);
  }
}
function language_select_changed(select_node) {
  let selected_option = select_node.options[select_node.selectedIndex];
  localStorage.setItem("selected_language", selected_option.value);
  clear_dictionary();
  fill_dictionary();
  search_changed(document.getElementById("searchbar"));
}

function checkbox_select_default() {
  for (let [checkbox, dvalue] of Object.entries(checkbox_defaults)) {
    if (!localStorage.getItem(checkbox)) {
      localStorage.setItem(checkbox, dvalue);
    }
  }
  for (let [checkbox_div, checkboxes] of Object.entries(selector_map)) {
    let div = document.getElementById(checkbox_div);
    for (const checkbox of checkboxes) {
      div.appendChild(
        build_checkbox_option(
          checkbox,
          localStorage.getItem(checkbox) === "true"
        )
      );
    }
  }
}
function build_checkbox_option(name, value) {
  let container = document.createElement("label");
  container.className = "container";
  container.appendChild(build_text(checkbox_labels[name]));
  container.title = checkbox_mouseover[name];

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = name;
  checkbox.checked = value;
  checkbox.onchange = checkbox_changed;
  checkbox.autocomplete = "off"; // prevent refresh refill; only localStorage
  container.appendChild(checkbox);

  let checkmark = document.createElement("span");
  checkmark.className = "checkmark";
  container.appendChild(checkmark);
  return container;
}
function checkbox_changed() {
  for (let checkbox of Object.keys(checkbox_labels)) {
    let is_checked = document.getElementById(checkbox).checked;

    // only store if it had a default
    if (checkbox in checkbox_defaults) {
      localStorage.setItem(checkbox, is_checked);
    }
  }

  if (localStorage.getItem("checkbox_obscure") == "true") {
    document.getElementById("warn_obscure").style.display = "inherit";
  } else {
    document.getElementById("warn_obscure").style.display = "none";
  }
  if (localStorage.getItem("checkbox_uncommon") == "true") {
    document.getElementById("warn_uncommon").style.display = "inherit";
  } else {
    document.getElementById("warn_uncommon").style.display = "none";
  }
  search_changed(document.getElementById("searchbar"));
}

function str_matches(str1, str2) {
  str1 = str1.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  str2 = str2.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  if (should_search_definitions) {
    // INTENDED: don't fuzzy search defs, it sucks
    return str1.includes(str2);
  }
  return str1.fuzzy(str2);
}

function edit_distance(str1, str2) {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  return levenshtein(str1, str2);
}

function alphabetical(a, b) {
  // expects [elem, ...]
  // reverse sort
  a = a.id; // TODO
  b = b.id;
  a = a.toLowerCase();
  b = b.toLowerCase();

  if (a > b) return -1;
  if (a == b) return 0;
  if (a < b) return 1;
}

function scored(a, b) {
  // expects [[elem, int], ...]
  // reverse sort
  if (a[1] > b[1]) return -1;
  if (a[1] == b[1]) return alphabetical(a[0], b[0]); // stabilize
  if (a[1] < b[1]) return 1;
}

function search_changed(searchbar) {
  // search_changed is solely responsible for:
  // - triggering a view refresh (we need the fuzzy match)
  // - sorting the words
  // after this call to update vis, no style changes are made
  let search_term = searchbar.value.trim();
  update_visibility(search_term); // obligate

  let dictionary = document.getElementById("dictionary");
  let entries = document.getElementsByClassName("entry");

  if (search_term === "") {
    // they're in an html collection instead of an array so...
    let sorted_entries = [...entries].sort(alphabetical);
    for (let i in sorted_entries) {
      dictionary.prepend(sorted_entries[i]); // puts in order on page
    }
    return;
  }

  if (!should_search_definitions) {
    let scores = [];
    for (let i = 0; i < entries.length; i++) {
      // for performance, limit scope to visible
      if (entries[i].style.display === "") {
        let match = entries[i].id;
        scores.push([entries[i], edit_distance(search_term, match)]);
      }
    }
    scores.sort(scored);
    for (let i in scores) {
      dictionary.prepend(scores[i][0]);
    }
  }
}

function single_word_mode() {
  show_word = urlParams.get("q");
  document.getElementById("searchbar").value = "";
  for (let checkbox_div of Object.keys(selector_map)) {
    document.getElementById(checkbox_div).style.display = "none";
  }
  document.getElementById("searchbar").style.display = "none";
  document.getElementById("normal_mode_button").style.display = "initial";
  // console.log(show_word);
  // document.getElementById();
  // document.getElementById(show_word).style.display = "";
}
function normal_mode() {
  window.location.search = ""; // remove query and refresh
}

const WORDS_URL = "https://raw.githubusercontent.com/lipu-linku/sona/main/api/raw/words.json";
const data = JSON.parse(Get(WORDS_URL));
const LANGS_URL = "https://raw.githubusercontent.com/lipu-linku/sona/main/api/raw/languages.json";
const languages = JSON.parse(Get(LANGS_URL));

const selector_map = {
  // these keys must have a corresponding div in index.html
  usage_selector: [
    "checkbox_core",
    "checkbox_common",
    "checkbox_uncommon",
    "checkbox_obscure",
  ],
  // search_selector: [],
  // settings_selector: [],
};
const usages_to_checkboxes = {
  core: "checkbox_core",
  common: "checkbox_common",
  uncommon: "checkbox_uncommon",
  obscure: "checkbox_obscure",
};
const checkbox_labels = {
  checkbox_core: "core",
  checkbox_common: "common",
  checkbox_uncommon: "uncommon *",
  checkbox_obscure: "obscure **",
};
const checkbox_mouseover = {
  checkbox_core: "Core words are used by > 90% of Toki Pona speakers.",
  checkbox_common: "Common words are used by 60-90% of Toki Pona speakers.",
  checkbox_uncommon: "Uncommon words are used by 30-60% of Toki Pona speakers.",
  checkbox_obscure: "Obscure words are used by 5-30% of Toki Pona speakers.",
};

// must be strings bc localstorage only saves strings
const checkbox_defaults = {
  checkbox_core: "true",
  checkbox_common: "true",
  checkbox_uncommon: "false",
  checkbox_obscure: "false",
  checkbox_lightmode: "false",
};
const urlParams = new URLSearchParams(window.location.search);
var show_word = null;
var should_search_definitions = false;
