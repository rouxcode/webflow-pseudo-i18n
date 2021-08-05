(function () {

    var elements
    var lang
    var languages

    var conf = window.roux_i18n_conf || {}
    var link_sel = '.roux-i18n-language'
    var el_sel = '.roux-i18n-element'
    var has_store = !(typeof localStorage == 'undefined')

    ready(init)

    function init() {
        // build language link selectors
        link_sel = get_link_selectors()
        // get the language links
        links = get_links()
        // get languages 
        languages = get_languages()
        // get current laguage
        lang = get_language()
        // build the element selectors
        el_sel = get_element_selectors()
        // get elements
        elements = get_elements()
    }

    function get_element_selectors() {
        // add conf language link selectors
        if (conf.element_selectors) {
            el_sel += ',' + conf.element_selectors.join(',')
        }
        return el_sel
    }

    function get_elements() {
        var els = document.querySelectorAll(el_sel)
        var ar = []
        for (var i = 0; i < els.length; ++i) {
            var el = els[i]
            var cont = el.innerHTML.split('[[')
            el._divs = {}
            if (cont.length > 1) {
                for (var j = 1; j < cont.length; ++j) {
                    var c = cont[j].split(']]')
                    if (c.length == 2) {
                        el._divs[c[0]] = c[1]
                    }
                }
                el.innerHTML = ''
                if (el._divs[lang]) {
                    el.innerHTML = el._divs[lang]
                    ar.push(el)
                }
            }
        }
        return ar
    }

    function get_link_selectors() {
        if (Array.isArray(conf.language_selectors)) {
            link_sel += ',' + conf.language_selectors.join(',')
        }
        return link_sel
    }

    function get_links() {
        var links = document.querySelectorAll(link_sel)
        console.log(links)
        for (var i = 0; i < links.length; ++i) {
            links[i]._l = (links[i].dataset.language || links[i].innerText).toLowerCase()
            links[i].addEventListener('click', swicht_language)
            if (links[i]._l == lang) {
                links[i].classList.add('lang-active')
            }
        }
        return links
    }

    function swicht_language(e) {
        if (e) { e.preventDefault() }
        var l = this._l

        for (var i = 0; i < elements.length; ++i) {
            elements[i].innerHTML = elements[i]._divs[l]
        }

        for (var i = 0; i < links.length; ++i) {
            if (links[i]._l == lang) {
                links[i].classList.add('lang-active')
            }
        }

        if (has_store) {
            localStorage.setItem('rouxcode_i18_lang', l)
        }
    }

    function get_language() {
        var l;
        // get lang from GET param "lang"
        var a = window.location.search.substr(1).split('&')
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=');
            if (p[0] == 'lang') {
                if (languages.indexOf(p[1]) > -1) {
                    return p[1]
                }
            }
        }
        // get language from storage if none is given as GET param
        if (has_store) {
            l = localStorage.getItem('rouxcode_i18_lang')
            if (languages.indexOf(l) > -1) {
                return l
            }
        }
        // get language from navigator if no GET param and no storage
        l = navigator.userLanguage || navigator.browserLanguage || navigator.language
        l = l.substr(0, 2)
        if (languages.indexOf(l) > -1) {
            return l
        }
        // return default language (first in languages array)
        return languages[0]
    }

    function get_languages() {
        // if conf has a language array use it
        if (conf.languages) {
            return conf.languages
        }
        // try get languages from language link data attr
        if (links.length) {
            var langs = []
            links.forEach(el => {
                langs.push((el.dataset.language || el.innerText).toLowerCase())
            })
            if (langs.length > 0) {
                return langs
            }
        }
        // return default
        return ['fr']
    }

    function ready(callback) {
        if (document.readyState != 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }
})();