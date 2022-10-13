$(function(){
    $('#registration').hide();
    $('#switchUp').on('click', function(){
        $('#login').hide();
        $('#registration').show();
    });

    $('#signUp').on('click', function(){
        let name = $('#name').val();
        let surname = $('#surname').val();
        let username = $('#username').val();
        let password = $('#password').val();
        let repassword = $('#repassword').val();
        let isAdmin = $('#admin')[0].checked;
        let favPets = $('#favPets').find('input');
        let preferences = $('#preferences').find('input:checked');
        let checkOwning = false;
        let owning = {
            animal: $('#animal').children("option:selected").val(),
            name: $('#animalName').val(),
            sex: $('#sex').children('input:checked').val(),
            age: $('#age').val(),
            description: $('#animalDescription').val()
        };
        
        favPets = $.grep(favPets, function(value){
            return value.checked;
        });

        preferences = $.grep(preferences, function(value){
            return value.checked;
        });

        for(let i = 0; i < favPets.length; i++) favPets[i] = favPets[i].value;
        for(let i = 0; i < preferences.length; i++) preferences[i] = preferences[i].value;
        for(let field in owning) {
            if(field == '') checkOwning = true;
        }
        if(name == '' || surname == '' || username == ''
        || password.length < 8 || password != repassword
        || favPets == [] || preferences == [] || checkOwning) return alert("Some field hasn't been filled.\nOr the two password are either different or too short!!");

        let sending = {
            name: name,
            surname: surname,
            favPets: favPets,
            owningPet: owning,
            preferences: preferences,
            username: username,
            password: password,
            isAdmin: isAdmin 
        };
        $.post(backendRoute + '/signup', {sending})
        .then((res) => {
            console.log(res);
            location.replace(location.pathname.replace('/login', ''));
        })
        .catch((err) => {
            console.log(err);
        });
    });

    $('#logbtn').on('click', function(){
        let username = $('#usernameIn').val();
        let password = $('#passwordIn').val();
        if(username == '' || password == '') return alert('You have to fill both fields!');
        let send = {
            user: username,
            pwd: password
        };
        $.post(backendRoute + '/login', {send})
        .then((response) => {
            alert('logged in successfully');
            //document.cookie = 'logged=' + response.username + ', admin=' + response.isAdmin + '; path=/';
            localStorage.setItem('logged', response.username + ' ' + response.isAdmin);
            location.replace(location.pathname.replace('/login', ''));    
        })
        .catch(() => {
            alert('login hasn\'t been successful');
        });
    });
});
