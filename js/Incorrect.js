
const Issues = //`https://api.github.com/repos/KanjiVG/kanjivg/issues`;
    `https://github.com/ElectronicsArchiver/kanjivg.github.com/issues`;


function authorToListing([ name , user ]){

    let { issues } = user;

    issues = issues
        .map(({ title , link }) => `<li><b><a href = '${ link }'>${ title }</a></b></li>`)
        .join('\n');

    return `
        <li>
            <a href = '${ user.link }'>${ name }</a> :
            <ul>${ issues }</ul>
        </li>
        <br>
    `;
}

function openIssue(title,description,label){

    const url = new URL(`${ Issues }/new`);

    const { searchParams } = url;

    searchParams.set('title',title);
    searchParams.set('body',description);
    searchParams.set('labels',label);

    open(url,'_blank');
}


window.onload = async () => {

    const Listing = jQuery('#issue-listing');


    jQuery('#incorrect-kanji-reporter')
    .attr('href','#incorrect-kanji-modal');


    const response = await fetch('https://api.github.com/repos/KanjiVG/kanjivg/issues');
    const issues = await response.json();


    //  Sort By Author

    const authors = new Map;

    issues.forEach((issue) => {

        const { html_url : link , title , user } = issue;
        const { html_url : userpage , login : name  } = user;

        const author = authors.get(name) ?? {
            issues : [] ,
            link : userpage
        };

        author.issues.push({ title , link });
        authors.set(name,author);
    });


    //  Visualize Issues

    let list = '';

    for(const author of authors.entries())
        list += authorToListing(author);

    Listing.append(`<ul>${ list }</ul>`);


    jQuery('#incorrect-kanji-form').submit(async () => {

        const
            isMissing = jQuery('#missing:checked').val(),
            isError = jQuery('#error:checked').val(),
            isCheck = jQuery('#check:checked').val();


        function label(){

            if(isError)
                return 'Error';

            if(isMissing)
                return 'Missing';

            return 'Please Check';
        }

        const
            description = jQuery('#body').val(),
            title = jQuery('#title').val();

        openIssue(title,description,label());

        return false;
    });
}
