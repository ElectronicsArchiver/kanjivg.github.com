
const { fromCharCode } = String;

/*
 *  Loading this from the repository
 *  is pretty redundant, it would be
 *  better to simply have an index of
 *  all available kanji.
 *
 *  Further, generating the HTML of
 *  the listing page would be optimal,
 *  either with a manually called script
 *  or integrated in Github Actions.
 */


function kanjiFromChar(code){

    if(code <= 0xFFFF)
        return fromCharCode(code);

    code -= 10000;

    return fromCharCode(
        0xD800 + (code >> 10),
        0xDC00 + (code & 0x3FF)
    );
}

async function fetchJSON(url){
    const response = await fetch(url);
    return await response.json();
}


const
    URL_Master = `https://api.github.com/repos/KanjiVG/kanjivg/git/refs/heads/master`,
    URL_Trees = `https://api.github.com/repos/KanjiVG/kanjivg/git/trees`;

async function loadKanji(){

    var btn = jQuery(this);
    btn.button('loading');

    const { object } = await fetchJSON(URL_Master);

    const { tree } = await fetchJSON(`${ URL_Trees }/${ object.sha }`);

    const folder = tree
        .find(({ path }) => path === 'kanji');

    if(!folder)
        return;

    const { tree : files } = await fetchJSON(folder.url);

    const links = files
        .map(({ path }) => path.split('.')[0])
        .map((name) => `0x${ name }`)
        .map(kanjiFromChar)
        .map((kanji) => `<a href = 'viewer.html?kanji=${ kanji }'>${ kanji }</a>`)
        .join(' ');

    jQuery("#kanji-listing").append(links);

    btn.button('reset');

    return false;
}


window.onload = () => {

    jQuery("#load-kanji-listing").click(loadKanji);
}
