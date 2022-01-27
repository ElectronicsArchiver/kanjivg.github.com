
const Issues =
    `https://github.com/ElectronicsArchiver/kanjivg.github.com/issues`;
    //`https://api.github.com/repos/KanjiVG/kanjivg/issues`;

const { stringify } = JSON;


function toIssueForm(username,password,data){
    return {
        referrerPolicy : 'no-referrer' ,
        credentials : 'include' ,
        redirect : 'follow' ,
        method : 'POST' ,
        cache : 'no-cache' ,
        mode : 'cors' ,

        body : stringify(data),

        headers : {
            'Content-Type' : 'application/json' ,
            'Authorization' : `Basic ${ btoa(`${ username }:${ password }`) }`
        }
    };
}


jQuery(document).ready(() => {


    jQuery('#incorrect-kanji-reporter').attr('href', '#incorrect-kanji-modal');

    jQuery.getJSON('https://api.github.com/repos/KanjiVG/kanjivg/issues?callback=?', function (results) {
        var issues = results.data;
        var entries = [];
        var len = issues.length;
        for (i = 0; i < len; i++) {
            var issue = issues[i];
            var user = issue.user.login;
            var title = issue.title;
            var url = issue.html_url;
            entries.push('<li><a href="' + url + '">' + title + '</a> reported by ' + user + '</li>');
        }
        jQuery('#issue-listing').append(entries.join(''));
    });

    jQuery('#incorrect-kanji-form').submit(async () => {

        const
            isMissing = jQuery('#missing:checked').val(),
            isError = jQuery('#error:checked').val(),
            isCheck = jQuery('#check:checked').val(),
            username = jQuery('#username').val(),
            password = jQuery('#password').val(),
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

        //
        // $.ajax({
        //     type:'POST',
        //     url:,
        //     data:JSON.stringify(data),
        //     dataType:'json',
        //     contentType:'application/x-www-form-urlencoded',
        //     success:function (results) {
        //         jQuery("#error-alert").hide();
        //         jQuery('#incorrect-kanji-modal').modal('hide')
        //     },
        //     error:function (request, status, error) {
        //         var response = jQuery.parseJSON(request.responseText);
        //         jQuery("#error-message").html(response.message);
        //         jQuery("#error-alert").show();
        //     },
        //     beforeSend:function (xhr) {
        //         xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username + ':' + password));
        //     }
        // });


        // try {
        //     const form = toIssueForm(username,password,data);
        //     const response = await fetch(Issues,toIssueForm);
        //
        //     if(response.ok){
        //         jQuery("#error-alert").hide();
        //         jQuery('#incorrect-kanji-modal').modal('hide');
        //         return;
        //     }
        //
        //     jQuery("#error-message").html(response.json().message);
        //     jQuery("#error-alert").show();
        // } catch (e) {
        //
        //     console.error(e);
        //
        //     jQuery("#error-message").html(`While sending your issue, a network error occured.`);
        //     jQuery("#error-alert").show();
        // }

        return false;
    });
});
