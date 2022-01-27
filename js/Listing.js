jQuery(document).ready(function () {
    function fixedFromCharCode(codePt) {
        if (codePt > 0xFFFF) {
            codePt -= 0x10000;
            return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
        }
        else {
            return String.fromCharCode(codePt);
        }
    }

    jQuery("#load-kanji-listing").click(function () {
        var btn = jQuery(this);
        btn.button('loading');
        jQuery.getJSON("https://api.github.com/repos/KanjiVG/kanjivg/git/refs/heads/master?callback=?", function (refs) {
            var sha = refs.data.object.sha;
            jQuery.getJSON("https://api.github.com/repos/KanjiVG/kanjivg/git/trees/" + sha + "?callback=?", function (results) {
                var trees = results.data.tree;
                jQuery.each(trees, function (i, value) {
                    if (value.path == "kanji") {
                        jQuery.getJSON(value.url + "?callback=?", function (results) {
                            var trees = results.data.tree;
                            var entries = [];
                            var len = trees.length;
                            for (i = 0; i < len; i++) {
                                var value = trees[i];
                                var unicode = value.path;
                                unicode = unicode.split('.');
                                unicode = unicode[0];
                                unicode = "0x" + unicode;
                                unicode = fixedFromCharCode(unicode);
                                entries.push(' <a href="viewer.html?kanji=' + unicode + '">' + unicode + '</a> ');
                            }
                            jQuery("#kanji-listing").append(entries.join(''));
                            btn.button('reset');
                        });
                    }
                });
            });
        });
        return false;
    });
});
