$(function(){
    $('#removePosts').hide();
    $.get(backendRoute + '/userinfo')
        .then((response) => {
            let username, firstName
            for(i in response){
                let toAppend = ''
                username = response[i].username;
                firstName = response[i].firstName;
                toAppend += '<p>Username: ' + username + '</p>\
                    <p>First Animal Name: ' + firstName + '</p>\
                    <div style="margin-top: 5%;" class="buttons"><button style="background-color: #07CEB4" id="show" class="button small medium-only-expanded success">Show Posts</button></div>';
                    $('#main').append('<div class="card"><div class="card-section">' + toAppend + '</div></div>');
            }
            $('#main').children('.card').each(function(i,elem){
                $(this).children('.card-section').children('div').children().on('click', function(){
                    let val = $(this.parentElement.parentElement).children('p')[0].innerHTML.split('Username: ')[1]
                    let loggedUser = $('.logged')[0].innerHTML.split(' ')[2];
                    let admin = ($('.logged')[0].innerHTML.split(' ')[1] == 'admin') ? true : false
                    if(!admin && val != loggedUser) return alert('You can remove only posts written by yourself if you are not an admin!');
                    $.get(backendRoute + '/userposts',  {
                        username: val
                    })
                    .then((res) => {
                        if(res.length == 0) return alert('The selected user hasn\'t written any posts');
                        for(let i in res){
                            let day,time;
                            let postView = {
                                user: res[i].username,
                                date: res[i].date,
                                post: res[i].content
                            };
                            
                            day = postView.date.split('T',1);
                            time = postView.date.split('T')[1].split('.',1);
                            time = time.toString().slice(0,5);
                            $('#main').hide();
                            $('#removePosts').show();
                            $('#userPosts').append( 
                                '<div style="margin-top: 5%;margin-bottom: 5%;" class="card"><div style="padding-bottom: 5%;" class="card-section"><p>Remove this post <input type="checkbox" value="' + postView.user + ' ' + postView.date + '"></p>' +
                                '<p>Username: ' + postView.user + '</p>' +
                                '<p>In date: ' + day + ' ' + time + '</p>' +
                                '<p>' + postView.post + '</p></div></div>'
                            );
                        }

                        $('#userPosts').append('<div class="buttons"><button style="background-color: #07CEB4; box-shadow: 0px 0px 2px 2px rgba(0,0,0,0.2);" class="button small medium-only-expanded success" id="removePosts" type="button">Remove Selected Posts</button></div>')
                        $('#userPosts').children('.buttons').children().on('click', function(){
                            let removingPosts = [];
                            let posts = $(this).parent().parent()
                                            .children('.card').children('.card-section')
                                            .children('p').children('input:checked'); 
                            
                            for(let i = 0; i < posts.length; i++){
                                removingPosts.push({
                                    user: posts[i].value.split(' ')[0],
                                    date: posts[i].value.split(' ')[1]
                                });
                            }
                            if(removingPosts.length == 0) return alert('You didn\'t selected any post to remove!');
                            $.ajax({
                                method: 'DELETE',
                                url: backendRoute + '/removeposts',
                                data: { posts: removingPosts }
                            })
                            .then(() => {
                                location.reload();
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                });
            })
        })
        .catch((error) => {
            console.log(error)
        });
});