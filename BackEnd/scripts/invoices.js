$(function(){
    $('#showdata').on('click', function(){
        let type = $('#invoice').children('option:selected').val();
        let user = $('.logged').get()[0].innerHTML.split(' ')[2];
	if(user == '' || user == undefined) return alert('You are not logged in yet!');
        $.get(frontendRoute + '/invoice?user=' + user)
            .then((res) => {
                if(type == 'products'){
                    $('.services').hide();
                    $('.products').show();
                    $('.products').empty();
                    let toAppend = '';
                    let currInvoice = res.products
                    for(let i in currInvoice){
                        toAppend += '<div class="card"><div class="card-section">\
                        <img src="data:image/png;base64,' + currInvoice[i].image + '" alt="a product">\
                        <p>Product: ' + currInvoice[i].productName + '</p>\
                        <p>Price: ' + currInvoice[i].price + '$</p>\
                        <p>Quantity: ' + currInvoice[i].quantity + '</p></div></div>'
                    }
                    $('.products').append(toAppend + '<p>Out of ' + res.soFarTotal.toFixed(2) + '$ of spent money, you have spent ' + res.totalProducts.toFixed(2) + '$ on products!</p>\
                    <p>The average price of the products you bought is: ' + (res.products.length > 0 ? (res.totalProducts/res.products.length).toFixed(2) : 0) + '$</p>')
                }
                else{
                    $('.services').show();
                    $('.products').hide();
                    $('.services').empty();
                    let toAppend = '';
                    let currInvoice = res.services
                    for(let i in currInvoice){
                        toAppend += '<div class="card"><div class="card-section">\
                        <p>Service Office: ' + currInvoice[i].office.city + ' - ' + currInvoice[i].office.address + '</p>\
                        <p>Service: ' + currInvoice[i].service + '</p>\
                        <p>Price: ' + currInvoice[i].price + '$</p></div></div>'
                    }
                    $('.services').append(toAppend + '<p>Out of ' + res.soFarTotal.toFixed(2) + '$ of spent money, you have spent ' + res.totalServices.toFixed(2) + '$ on services!</p>\
                    <p>The average price of the services you bought is: ' + (res.services.length > 0 ? (res.totalServices/res.services.length).toFixed(2) : 0) + '$</p>')
                }
            })
            .catch((err) => alert('You have no invoice to show!'));
    })
})
