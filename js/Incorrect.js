
const Issues =
    `https://github.com/ElectronicsArchiver/kanjivg.github.com/issues`;
    //`https://api.github.com/repos/KanjiVG/kanjivg/issues`;


jQuery(document).ready(async () => {

    const
        Listing = jQuery('#issue-listing');


    jQuery('#incorrect-kanji-reporter').attr('href','#incorrect-kanji-modal');


    const response = await fetch('https://api.github.com/repos/KanjiVG/kanjivg/issues');
    const issues = await response.json();

    //  Sort By Author

    const authors = new Map;

    issues.forEach((issue) => {

        const { html_url : link , title , user } = issue;
        const { html_url : user , login : name  } = user;

        const author = authors.get(name) ?? {
            issues : [] ,
            link : user
        };

        author.issues.push({ title , link });
        authors.set(name,author);
    });

    //  Visualize Issues

    authors.forEach((user,name) => {

        const issues = user.issues
            .map(({ title , link }) => `<li><a href = '${ link }'>${ title }</a></li>`)
            .join('\n');

        Listing.append(`
            <li>
                <a href = '${ user.link }'>${ name }</a> :
                <ul>${ issues }</ul>
            </li>
        `)
    });


    //
    //
    // jQuery.getJSON('https://api.github.com/repos/KanjiVG/kanjivg/issues?callback=?', function (results) {
    //     var issues = results.data;
    //     var entries = [];
    //     var len = issues.length;
    //     for (i = 0; i < len; i++) {
    //         var issue = issues[i];
    //         var user = issue.user.login;
    //         var title = issue.title;
    //         var url = issue.html_url;
    //         entries.push();
    //     }
    //     .append(entries.join(''));
    // });

    jQuery('#incorrect-kanji-form').submit(async () => {

        const
            isMissing = jQuery('#missing:checked').val(),
            isError = jQuery('#error:checked').val(),
            isCheck = jQuery('#check:checked').val(),
            // username = jQuery('#username').val(),
            // password = jQuery('#password').val(),
            title = jQuery('#title').val(),
            body = jQuery('#body').val();


        function label(){

            if(isError)
                return 'Error';

            if(isMissing)
                return 'Missing';

            return 'Please Check';
        }


        const url = new URL(`${ Issues }/new`);

        const { searchParams } = url;

        searchParams.set('title',title);
        searchParams.set('body',body);
        searchParams.set('labels',label());

        open(url,'_blank');

        return false;
    });
});
