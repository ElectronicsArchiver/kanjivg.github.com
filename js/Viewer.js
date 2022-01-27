

const { search } = window.location;
const parameter = new URLSearchParams(search);

jQuery(document).ready(() => {

    const kanji = parameter.get('kanji') ?? jQuery('#kanji').val();

    jQuery('#kanji').val(kanji);

    KanjiViewer.initialize(
        "kanjiViewer",
        jQuery('#strokeWidth').val(),
        jQuery('#fontSize').val(),
        jQuery('#zoomFactor').val(),
        jQuery('#displayOrders:checked').val(),
        jQuery('#colorGroups:checked').val(),
        kanji
    );

    jQuery('#kanjiViewerParams').submit(() => {
        KanjiViewer.setFontSize(jQuery('#fontSize').val());
        KanjiViewer.setZoom(jQuery('#zoomFactor').val());
        KanjiViewer.setStrokeWidth(jQuery('#strokeWidth').val());
        KanjiViewer.setStrokeOrdersVisible(jQuery('#displayOrders:checked').val());
        KanjiViewer.setColorGroups(jQuery('#colorGroups:checked').val());
        KanjiViewer.setKanji(jQuery('#kanji').val());
        KanjiViewer.refreshKanji();
        return false;
    });
});
