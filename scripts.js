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
  let usage_cat_set = localStorage.getItem(
    usages_to_checkboxes[data[id]["usage_category"]]
  );
  // hide if not in current usage categories
  if (usage_cat_set !== "true") return "none";
  if (search_term === "") return ""; // no need to check search behaviors

  let match = id;
  if (document.getElementById("checkbox_definitions").checked) {
    match = word_elem.querySelector(".definition").textContent;
  }

  return str_matches(match, search_term) ? "" : "none";
}

function update_visibility(search_term) {
  // works together with search_changed, but solely changes visibility
  let dictionary = document.getElementById("dictionary");

  for (var id in data) {
    let word = dictionary.querySelector("#" + id);
    set_visibility(word, find_vis_state(search_term, id, word));

    // this is independent of whole word visibility
    // could be done only on checkbox_changed but that's more logic extraction
    document.getElementById("checkbox_detailed").checked === true
      ? set_visibility(word.querySelector("details"), "")
      : set_visibility(word.querySelector("details"), "none");
  }
}

function fill_dictionary() {
  let dictionary = document.getElementById("dictionary");
  if (show_word) {
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
  var word_container = document.createElement("div");
  word_container.id = id;
  word_container.className = "entry";

  if (word["source_language"]) {
    word_container.appendChild(
      build_element("div", word["source_language"], "sourcelanguage")
    );
  }
  if (word["creator"]) {
    word_container.appendChild(
      build_element("div", word["creator"], "creator")
    );
  }

  if (word["etymology"]) {
    word_container.appendChild(
      build_element("div", word["etymology"], "etymology")
    );
  }
  let coined = [
    word["coined_year"] ? word["coined_year"] + " " : "",
    word["coined_era"] ? "(" + word["coined_era"] + ")" : ""
  ].join(" ");
  if (coined) {
    word_container.appendChild(build_element("div", coined, "coined"));
  }
  if (word["book"]) {
    word_container.appendChild(build_element("div", word["book"], "book"));
  }
  if (word["recognition"]) {
    // Iterating over an object in reverse. this feels dirty.
    for (var date in Object.fromEntries(
      Object.entries(word["recognition"]).reverse()
    )) {
      let percent = word["recognition"][date];
      let usage_category = word["usage_category"]
        ? word["usage_category"]
        : "unknown";
      let recognition = `${usage_category} (${percent}% in ${date})`;
      word_container.appendChild(
        build_element("div", recognition, "recognition")
      );
      break;
    }
  }

  if (word["sitelen_pona"]) {
    word_container.appendChild(
      build_element("div", word["sitelen_pona"], "sitelenpona")
    );
  }
  word_container.appendChild(build_element("div", word["word"], "word"));
  // The switch statement is temporary!

  let definition = word["def"][localStorage.getItem("selected_language")];
  if (definition) {
    word_container.appendChild(build_element("div", definition, "definition"));
  } else {
    word_container.appendChild(
      build_element("div", "(en) " + word["def"]["en"], "shaded definition")
    );
  }
  if (word["sitelen_sitelen"]) {
    const img = build_element(
      "img",
      "",
      "sitelensitelen",
      word["sitelen_sitelen"]
    );
    img.alt = `sitelen sitelen for ${word["sitelen_sitelen"]}`;
    word_container.appendChild(img);
  }
  if (word["see_also"]) {
    let see_also_div = build_element("div", "{see ", "seealso");
    let see_alsos = word["see_also"].split(", ");
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
    word_container.appendChild(see_also_div);
  }
  let details_div = build_element("div", "", "details");
  let details_container = build_element("details", "");
  details_container.appendChild(build_element("summary", "more info"));
  details_container.appendChild(details_div);

  if (word["commentary"]) {
    details_div.appendChild(
      build_element("div", word["commentary"], "commentary")
    );
  }
  if (word["ku_data"]) {
    details_div.appendChild(build_element("div", word["ku_data"], "kudata"));
  }
  if (word["sitelen_pona_etymology"]) {
    details_div.appendChild(
      build_element(
        "div",
        word["sitelen_pona_etymology"],
        "sitelenponaetymology",
        word["sitelen_pona_etymology"]
      )
    );
  }

  // NOTE: maybe embed later, instead of linking?
  if (word["luka_pona"]) {
    details_div.appendChild(
      build_element("a", "view luka pona", "lukapona", word["luka_pona"]["gif"])
    );
  }
  if (word["ucsur"]) {
    details_div.appendChild(build_element("div", word["ucsur"], "ucsur"));
  }

  // if (word["sitelen_emosi"]) {
  //   details_div.appendChild(
  //     build_element("div", word["sitelen_emosi"], "sitelenemosi")
  //   );
  // }

  if (word["audio"]) {
    let audio_kalaasi = build_element(
      "a",
      "kala Asi speaks",
      "audio_kalaasi",
      word["audio"]["kala_asi"]
    );
    let audio_janlakuse = build_element(
      "a",
      "jan Lakuse speaks",
      "audio_janlakuse",
      word["audio"]["jan_lakuse"]
    );
    // audio_kalaasi = build_element("audio", "", "audio_kalaasi", word["audio"]["kala_asi"])
    // audio_janlakuse = build_element("audio", "", "audio_janlakuse", word["audio"]["jan_lakuse"])
    // audio_kalaasi.controls = true
    // audio_janlakuse.controls = true
    details_div.appendChild(audio_kalaasi);
    details_div.appendChild(audio_janlakuse);
  }

  details_container.open = true;
  if (details_div.childNodes.length > 1) {
    // only append if non-empty; # text is present tho
    word_container.appendChild(details_container);
  }

  return word_container;
}

function main() {
  if (urlParams.get("q")) {
    single_word_mode();
  }
  // Select language
  language_select_default();
  // Select options
  checkbox_select_default();
  // Generate words
  fill_dictionary();
  // show based on settings
  search_changed(document.getElementById("searchbar"));

  let checkbox_lightmode = document.getElementById("checkbox_lightmode");
  checkbox_lightmode.checked = localStorage.checkbox_lightmode === "true";
  if (checkbox_lightmode.checked) {
    document.body.classList.add("lightmode");
  }
  checkbox_lightmode.addEventListener("change", function (e) {
    localStorage.checkbox_lightmode = e.target.checked;
    if (e.target.checked) {
      document.body.classList.add("lightmode");
    } else document.body.classList.remove("lightmode");
  });

  document.getElementById("searchbar").focus();
}

function build_select_option(option_value, text) {
  let option_node = document.createElement("option");
  option_node.value = option_value;
  option_node.appendChild(build_text(text));
  return option_node;
}
function language_select_default() {
  if (!localStorage.getItem("selected_language")) {
    localStorage.setItem("selected_language", "en");
  }

  let language_selector = document.getElementById("language_selector");
  for (let id in languages) {
    let option = build_select_option(id, languages[id]["name_endonym"]);
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
  search_changed(document.getElementById("searchbar"));
}

function str_matches(str1, str2) {
  str1 = str1.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  str2 = str2.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  let definition_search = document.getElementById(
    "checkbox_definitions"
  ).checked;
  if (definition_search) {
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

  if (!document.getElementById("checkbox_definitions").checked) {
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
}
function normal_mode() {
  window.location.search = ""; // remove query and refresh
}

const bundle_url = "https://linku.la/jasima/data.json";
const bundle = JSON.parse(Get(bundle_url));
const data = bundle["data"];
const languages = bundle["languages"];

const selector_map = {
  // these keys must have a corresponding div in index.html
  // book_selector: [
  //   "checkbox_pu",
  //   "checkbox_kusuli",
  //   "checkbox_kulili",
  //   "checkbox_none",
  // ],
  usage_selector: [
    "checkbox_core",
    "checkbox_widespread",
    "checkbox_common",
    "checkbox_uncommon",
    "checkbox_rare",
    "checkbox_obscure"
  ],
  // search_selector: [],
  settings_selector: [
    "checkbox_lightmode",
    "checkbox_detailed",
    "checkbox_definitions"
    // TODO: move 'definitions' to search selector
    // whenever the page looks prettier
  ]
};
// const books_to_checkboxes = {
//   pu: "checkbox_pu",
//   "ku suli": "checkbox_kusuli",
//   "ku lili": "checkbox_kulili",
//   none: "checkbox_none",
// };
const usages_to_checkboxes = {
  core: "checkbox_core",
  widespread: "checkbox_widespread",
  common: "checkbox_common",
  uncommon: "checkbox_uncommon",
  rare: "checkbox_rare",
  obscure: "checkbox_obscure"
};
const checkbox_labels = {
  // checkbox_pu: "pu words",
  // checkbox_kusuli: "ku suli words",
  // checkbox_kulili: "ku lili words",
  // checkbox_none: "other words",
  checkbox_core: "core words",
  checkbox_widespread: "widespread words",
  checkbox_common: "common words",
  checkbox_uncommon: "uncommon words",
  checkbox_rare: "rare words",
  checkbox_obscure: "obscure words",
  checkbox_definitions: "definition search",
  checkbox_detailed: "detailed mode",
  checkbox_lightmode: "light mode"
};

// must be strings bc localstorage only saves strings
const checkbox_defaults = {
  // checkbox_pu: "true",
  // checkbox_kusuli: "true",
  // checkbox_kulili: "false",
  // checkbox_none: "false",
  checkbox_core: "true",
  checkbox_widespread: "true",
  checkbox_common: "false",
  checkbox_uncommon: "false",
  checkbox_rare: "false",
  checkbox_obscure: "false",
  // "checkbox_definitions": 'false',  // do not save, user consideration
  // "checkbox_detailed": 'false', // INTENDED: do not save this setting, it's Laggy
  checkbox_lightmode: "false"
};
const urlParams = new URLSearchParams(window.location.search);
var show_word = null;
