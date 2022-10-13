$(function(){
    if($('.logged')[0].innerHTML[0] == 'Y') {
        $('#rmuser').hide();
        $('#changepwd').hide();
    }
    else $('#loginview').hide();
    $.get(backendRoute + '/userinfo')
        .then((response) => {
            let username, favPets, preferences, firstName;
            let openData = '<td><h5>';
            let closeData = '</h5></td>';
            for(i in response){
                username = response[i].username;
                favPets = response[i].favouritePets;
                preferences = response[i].preferences;
                firstName = response[i].firstName;
                $('tbody').append(
                    '<tr class="content">' +
                    openData + username + closeData +
                    openData + favPets + closeData +
                    openData + preferences + closeData +
                    openData + firstName + closeData +
                    '</tr>'
                );
            }
        })
        .catch((error) => {
            console.log(error)
        });

    $('#rmuser').on('click', function(){
        location.href += '/removeUser'
    });
});