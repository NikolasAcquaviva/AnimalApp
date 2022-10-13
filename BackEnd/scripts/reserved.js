$(function(){
    $.get(backendRoute + '/reserved', {
        user: $('.logged').get()[0].innerHTML.split(' ')[2]
    })
    .then((res) => {
        $('#top-reserved').append('<p>You\'ve made appointments for the following services at the following headquarters:</p>');
        $('#reserved').append('<br>');
        for(let i in res){
            let day = weekday(res[i].day);
            let service = res[i].name;
            let office = res[i].office;
            let price = res[i].price.toFixed(2);
            $('#reserved').append(
                '<br><div class="card"><div class="card-section"><p><b>Service:</b> ' + service + '</p>\
                 <p><b>Price: </b>' + price + '$</p><p><b>Day:</b> ' + day + '</p>\
                 <p><b>At:</b> ' + office.city + ' - ' + office.address + '</p>\
                 <div style="margin-top: 5%;" class="buttons"><button style="background-color: #FFB010;" type="button" class="button small medium-only-expanded removeReservation" value="' + office.city + '-' + office.address + 
                 '-' + service + '-' + daynum(day) +'">Remove this Reservation</button></div></div></div>'
            );
        }
        $('.removeReservation').on('click', function(){
            let value = $(this).val();
            let city = value.split('-')[0];
            let address = value.split('-')[1];
            let service = value.split('-')[2];
            let day = value.split('-')[3];
            let user = $('.logged').get()[0].innerHTML.split(' ')[2];
            if(res.length > 1){
                $.ajax(backendRoute + '/removereservation', {
                    method: 'DELETE',
                    data: {
                        user: user,
                        reservation: {
                            office: {
                                city: city,
                                address: address
                            },
                            name: service,
                            day: day
                        }
                    }
                })
                .then(() => {
                    $.post(backendRoute + '/upworker', {
                        office: {
                            city: city,
                            address: address
                        },
                        name: service
                    })
                    .then(() => {
                        location.reload();
                    })
                    .catch(() => {
                        alert('An error occurred on the DB')
                    })
                })
                .catch((err) => {
                    console.log(err);
                });
            }
            else{
                $.ajax(backendRoute + '/rmlastreservation', {
                    method: "DELETE",
                    data: {
                        user: user,
                        reservation: {
                            office: {
                                city: city,
                                address: address
                            },
                            name: service,
                            day: day
                        }
                    }
                })
                .then(() => {
                    $.post(backendRoute + '/upworker', {
                        office: {
                            city: city,
                            address: address
                        },
                        name: service
                    })
                    .then(() => {
                        location.reload();
                    })
                    .catch(() => {
                        alert('An error occurred on the DB')
                    })
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        });
    })
    .catch(() => {
        $('#top-reserved').append('<h2>Sadly you haven\'t done any reservations yet</h2><img style="padding: 40px 25%" src="../sadpet.jpg" alt="a sad pet" width="100%">');
    });
})
