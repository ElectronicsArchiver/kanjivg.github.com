jQuery(document).ready(function () {

    function base64encode(string) {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var result = '';
        var i = 0;
        do {
            var a = string.charCodeAt(i++);
            var b = string.charCodeAt(i++);
            var c = string.charCodeAt(i++);
            a = a ? a : 0;
            b = b ? b : 0;
            c = c ? c : 0;
            var b1 = ( a >> 2 ) & 0x3F;
            var b2 = ( ( a & 0x3 ) << 4 ) | ( ( b >> 4 ) & 0xF );
            var b3 = ( ( b & 0xF ) << 2 ) | ( ( c >> 6 ) & 0x3 );
            var b4 = c & 0x3F;
            if (!b) {
                b3 = b4 = 64;
            } else if (!c) {
                b4 = 64;
            }
            result += characters.charAt(b1) + characters.charAt(b2) + characters.charAt(b3) + characters.charAt(b4);
        } while (i < string.length);
        return result;
    }

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

    jQuery('#incorrect-kanji-form').submit(function () {
        var username = jQuery('#username').val();
        var password = jQuery('#password').val();
        var title = jQuery('#title').val();
        var body = jQuery('#body').val();
        var isError = jQuery('#error:checked').val();
        var isMissing = jQuery('#missing:checked').val();
        var isCheck = jQuery('#check:checked').val();

        var label = '';
        if (undefined != isError) {
            label = 'Error';
        } else if (undefined != isMissing) {
            label = 'Missing';
        } else {
            label = 'Please check';
        }

        var data = {
            'title':title,
            'body':body,
            'labels':[
                label
            ]
        };

        $.ajax({
            type:'POST',
            url:'https://api.github.com/repos/KanjiVG/kanjivg/issues',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/x-www-form-urlencoded',
            success:function (results) {
                jQuery("#error-alert").hide();
                jQuery('#incorrect-kanji-modal').modal('hide')
            },
            error:function (request, status, error) {
                var response = jQuery.parseJSON(request.responseText);
                jQuery("#error-message").html(response.message);
                jQuery("#error-alert").show();
            },
            beforeSend:function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + base64encode(username + ':' + password));
            }
        });

        return false;
    });
});
