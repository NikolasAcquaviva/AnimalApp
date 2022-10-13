$(function(){
    $('#change').hide();
    $('#reset').hide();
    $('#pwdonreset').hide();

    $('#proceed').on('click', function(){
        let checked = false;
        $('input:radio').each(function(i,elem){
            if(elem.checked){
                checked = true;
                $('#entry').hide();
                if(elem.value=='reset') $('#reset').show();
                else $('#change').show();
            }
        });
        if(!checked) return alert('You have to make a choose!');
    });

    $('#pwdchange').on('click', function(){
        let oldpwd = $('#oldpwd').get()[0].value;
        let newpwd1 = $('#newpwd').get()[0].value;
        let newpwd2 = $('#newpwd2').get()[0].value;
        let user = $('.logged').get()[0].innerHTML.split(' ')[2];
        if(newpwd1.length < 8 || newpwd2.length < 8) return alert('The new password is too short');
        if(newpwd1 != newpwd2) return alert('The new passwords don\'t match');
        $.post(backendRoute + '/changepwd', {
            user: user,
            old: oldpwd,
            new: newpwd1
        })
        .then(() => {
            alert('The password modify has been successful!');
            location.replace('#/users');
        })
        .catch(() => {
            alert('The old typed password may be wrong, retry please!');
        });
    });

    $('#checkName').on('click', function(){
        let name = $('#animalname').get()[0].value;
        let user = $('.logged').get()[0].innerHTML.split(' ')[2];
        if(name=='') return alert('Fill the box please!');
        $.post(backendRoute + '/checkname', {
            user: user,
            animal: name
        })
        .then(() => {
            $('#reset').hide();
            $('#pwdonreset').show();
        })
        .catch(() => {
            return alert('The name of your pet was sadly wrong!');
        });
    });

    $('#pwdreset').on('click', function(){
        let user = $('.logged').get()[0].innerHTML.split(' ')[2];
        let newpwd = $('#resetpwd').get()[0].value;
        if(newpwd.length < 8) return alert('Type a longer password please!');
        $.post(backendRoute + '/resetpwd', {
            username: user,
            password: newpwd
        })
        .then(() => {
            alert('The password has been changed successfully!');
            location.replace('#/users');
        })
        .catch(() => {
            return alert('Something wrong has occurred on the server, retry please!');
        });
    })
});