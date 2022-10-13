$(function(){
    $('#vet').hide();
    $('#dogsit').hide();
    $('#psy').hide();
    $('#reservation').hide();
    $('#showmy').on('click', function(){
        location+='/reserved';
    });
    if($('.logged')[0].innerHTML[0] == 'Y') $('#myservices').hide();
    $.AvailableReservations = function(res,service){
        let schedule;
        for(let i in res.schedule){
            if(res.schedule[i].name == service) {
                schedule = res.schedule[i];
                break;
            }
        }
        let numWorkers = schedule.numWorkers;
        let weekdays = schedule.day;
        let price = schedule.price.toFixed(2);
        let toAppend = '';
         
        
        for(let i in weekdays){
            weekdays[i] = weekday(weekdays[i]);
            toAppend += '<p>' + weekdays[i] + ' <input type="radio" class="radioApp" value="'+ schedule.name + '-' + weekdays[i] + '" name="reserve"></p>'
            
        }
        $('#reservation').append(
            '<p>The requested service is <b>' + service + '</b>.</p><br>\
             <div class="card"><div class="card-section"><p><b>Service Price:</b> ' + price  + '$</p><p><b>Available Practitioners:</b> ' + numWorkers + '</p>\
             <p><b>Available Days</b></p>' + toAppend + '<div class="buttons"><button type="button" value="' + schedule.name + '" class="button small medium-only-expanded finalReserve" style="background-color: #00905B;">Make Reservation</button></div></div></div><br>'
        );

        $('#reservation').append(
            '<p>This headquarter provides also the following services: </p><br>'
        );

        toAppend = ''

        for(let i in res.schedule){
            if(res.schedule[i].name != schedule.name){
                numWorkers = res.schedule[i].numWorkers;
                weekdays = res.schedule[i].day;
                price = res.schedule[i].price.toFixed(2);
                for(let j in weekdays){
                    weekdays[j] = weekday(weekdays[j]);
                    toAppend += '<p>' + weekdays[j] + ' <input type="radio" class="radioApp" value="' + res.schedule[i].name + '-' + weekdays[j] + '" name="reserve"></p>'
                }
                $('#reservation').append(
                    '<div class="card"><div class="card-section"><p><b>Service: </b>' + res.schedule[i].name + 
                     '<p><b>Service Price:</b> ' + price  + '$</p><p><b>Available Practitioners: ' + numWorkers + '</b></p>\
                     <p><b>Available Days</b></p>' + toAppend + '<div class="buttons"><button type="button" value="' + res.schedule[i].name + '" class="button small medium-only-expanded finalReserve" style="background-color: #00905B;">Make Reservation</button></div></div></div><br>'
                );
                
            }
        }
    };

    $.FinalReservation = function(office){
        $('.finalReserve').on('click', function(){
            if($('input:checked').get(0) === undefined) return alert('Select a day for your appointment!');
            let requested = $(this).val();
            let match = $('input:checked').get(0).value;
            let day = match.split('-')[1];
            match = match.split('-')[0];
            if(requested != match) return alert('Choose a day between the ones belonging to the requested service!!');
            day = daynum(day);
            let str = $(this).parent().parent().children('p').filter(function(i,elem){
                return elem.innerHTML.includes('Service Price');
            });
            let price = str[0].innerText.split(': ')[1].replace('$', '');

            let reservation = {
                user: $('.logged').get()[0].innerHTML.split(' ')[2],
                service: {
                    office: office,
                    name: requested,
                    day: day,
                    price: price
                }
            };
            $.get(backendRoute + '/checkexistence', reservation)
            .then(() => {
                $.get(backendRoute + '/availability', {
                    office: office,
                    service: requested
                })
                .then(() => {
                    $.post(backendRoute + '/reservation', reservation)
                    .then(() => {
                        $.post(backendRoute + '/updateworkers', {
                            office: office,
                            service: requested
                        })
                        .then(() => {
                            location.replace(location + '/reserved');
                        })
                        .catch(() => {
                            alert('There aren\'t practitioners available for this service!');
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                })
                .catch(() => {
                    return alert('There aren\'t practitioners available for this service!');
                });
            })
            .catch(() => {
                return alert('A reservation for this service at the chosen headquarter already exists!!');
            })
        })
    }

    $('#veterinarian').on('click', function(){
        $('#main').hide();
        $('#vet').show();
        $.get(backendRoute + '/getsites', {
            service: 'Veterinarian'
        })
        .then((res) => {         
            $('#vet').append(
                '<br><p>The Veterinarian service is provided at the following headquarters</p><br>'
            );
            for(let i in res.sites){   
                $('#vet').append(
                    '<div style="margin-top: 5%;" class="card"><div class="card-section"><p>City: ' + res.sites[i].city + '</p>\
                     <p>Address: ' + res.sites[i].address + '</p><div style="margin-top: 10%;" class="buttons">\
                     <button style="background-color: #20DBBC; color: black;" type="button" class="button small medium-only-expanded goReserve" value="'+ res.sites[i].city + ' - ' + res.sites[i].address + '">Go To Reservation</button></div></div></div>'
                );
            }
            $('.goReserve').on('click', function(){
                if($('.logged')[0].innerHTML[0] == 'Y') return alert('You can reserve a service only if you are logged in!!');
                let site = $(this).val();
                $('#vet').hide();
                $('#reservation').show();
                $('#reservation').append(
                    '<p>You\'ve chosen the headquarter: <b>' + site + '</b></p><br>'
                );

                let city = site.split(' - ')[0];
                let address = site.split(' - ')[1];
                $.get(backendRoute + '/weeklyschedule', {
                    city: city,
                    address: address
                })
                .then((res) => {
                    $.AvailableReservations(res,"Veterinarian");
                    $.FinalReservation({
                        city: city,
                        address: address
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
            })    
        })
        .catch((err) => {
            console.log(err);
        });
    });

    $('#dogsitter').on('click', function(){
        $('#main').hide();
        $('#dogsit').show();
        $.get(backendRoute + '/getsites', {
            service: 'Dog Sitter'
        })
        .then((res) => {
            $('#dogsit').append(
                '<br><p>The Dog Sitter service is provided at the following headquarters</p><br>'
            );
            for(let i in res.sites){   
                $('#dogsit').append(
                    '<div style="margin-top: 5%;" class="card"><div class="card-section"><p>City: ' + res.sites[i].city + '</p>\
                    <p>Address: ' + res.sites[i].address + '</p><div style="margin-top: 10%;" class="buttons">\
                    <button style="background-color: #20DBBC; color: black;" type="button" class="button small medium-only-expanded goReserve" value="'+ res.sites[i].city + ' - ' + res.sites[i].address + '">Go To Reservation</button></div></div></div>'
                );
            }
            
            $('.goReserve').on('click', function(){
                if($('.logged')[0].innerHTML[0] == 'Y') return alert('You can reserve a service only if you are logged in!!');
                let site = $(this).val();
                $('#dogsit').hide();
                $('#reservation').show();
                $('#reservation').append(
                '<p>You\'ve chosen the headquarter: <b>' + site + '</b></p>'
                );
                let city = site.split(' - ')[0];
                let address = site.split(' - ')[1];
                $.get(backendRoute + '/weeklyschedule', {
                    city: city,
                    address: address
                })
                .then((res) => {
                    $.AvailableReservations(res,"Dog Sitter");
                    $.FinalReservation({
                        city: city,
                        address: address
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
            })    
        })
        .catch((err) => {
            console.log(err);
        });
    });

    $('#psychologist').on('click', function(){
        $('#main').hide();
        $('#psy').show();
        $.get(backendRoute + '/getsites', {
            service: 'Psychologist'
        })
        .then((res) => {
            $('#psy').append(
                '<br><p>The Pet Psychologist service is provided at the following headquarters</p><br>'
            );
            for(let i in res.sites){   
                $('#psy').append(
                    '<div style="margin-top: 5%;" class="card"><div class="card-section"><p>City: ' + res.sites[i].city + '</p>\
                    <p>Address: ' + res.sites[i].address + '</p><div style="margin-top: 10%;" class="buttons">\
                    <button style="background-color: #20DBBC; color: black;" type="button" class="button small medium-only-expanded goReserve" value="'+ res.sites[i].city + ' - ' + res.sites[i].address + '">Go To Reservation</button></div></div></div>'
                );
            }
            
            $('.goReserve').on('click', function(){
                if($('.logged')[0].innerHTML[0] == 'Y') return alert('You can reserve a service only if you are logged in!!');
                let site = $(this).val();
                $('#psy').hide();
                $('#reservation').show();
                $('#reservation').append(
                    '<p>You\'ve chosen the headquarter: <b>' + site + '</b></p>'
                );

                let city = site.split(' - ')[0];
                let address = site.split(' - ')[1];
                $.get(backendRoute + '/weeklyschedule', {
                    city: city,
                    address: address
                })
                .then((res) => {
                    $.AvailableReservations(res,"Psychologist");
                    $.FinalReservation({
                        city: city,
                        address: address
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
            });    
        })
        .catch((err) => {
            console.log(err);
        });
    });
});