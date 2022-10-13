$(function(){  
    let info = $('.logged')[0].innerHTML.split(' ')
    let loggedUser = info[2];
    let admin = (info[1] == 'admin') ? true : false;
    $.get(backendRoute + '/userinfo')
        .then((response) => {
            let username, firstName
            for(i in response){
                let toAppend = ''
                username = response[i].username;
                firstName = response[i].firstName;
                toAppend += '<p>Username: ' + username + '</p>\
                    <p>First Animal Name: ' + firstName + '</p>\
                    <div style="margin-top: 5%;" class="buttons"><button style="color: black; background-color: #76E5E1;" class="button small medium-only-expanded">Remove This User</button></div>';
                    $('#main').append('<div style="margin-top: 5%;" class="card"><div class="card-section">' + toAppend + '</div></div>');
            }
            $('#main').find('button').each(function(i,elem){
                $(elem).on('click', function(){
                    let user = $(elem.parentElement.parentElement).children('p')[0].innerHTML.split('Username: ')[1];
                    if(!admin && user != loggedUser) return alert('If you aren\'t an admin you cannot remove any user but yourself!');
                    $.ajax({
                        method: 'DELETE',
                        url: backendRoute + '/removeuser',
                        data: { user: user}
                    })
                    .then(() => {
                        location.assign('#/users');
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                });
            });
        })
        .catch((err) => {
            console.log(err);
        });
})