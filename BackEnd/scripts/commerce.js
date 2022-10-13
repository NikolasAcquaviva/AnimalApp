$(function(){
    $.get(backendRoute + '/products')
    .then((res) => {
        let count = 0;
        let toAppend = '';
	let left = res.length;
        for(let i in res){
            let mult_three = false;
            let name = res[i].name;
            let availability = res[i].availability;
            let category = res[i].category;
            let image = res[i].image;
            let price = res[i].price;
        
            toAppend += '<div class="columns small-4 end"><div id="' + i + '" class="card"><div class="card-section">\
                    <img src="data:image/png;base64,' + image + '" alt="">\
                    <p>Category: ' + category + '</p><p>' + name + '</p><p>Available Quantity: ' + availability + '</p>\
                    <p>Product Price: ' + price + '$</p><div style="padding-top: 20px;" class="buttons"><button style="background-color: #FF9900;" class="prodState button small medium-only-expanded">CHANGE THIS PRODUCT STATE</button></div></div></div></div>';    
            if(count == 2){
		mult_three = true;
                $('.container').append(
                    '<div class="row">' + toAppend + '</div>'
                );
                toAppend = '';
                count = -1;
            }
            count++; left--;
            if(left == 0 && !mult_three)
		$('.container').append('<div class="row">' + toAppend + '</div>');
        }

        $('.prodState').on('click', function(){
            if($('.logged')[0].innerHTML.split(' ')[1] != 'admin') return alert('You are not logged in or if so, you are not an administrator');
            $('.container').hide();
            let id = $(this).parentsUntil('.columns').filter('.card')[0].id
            $('.changestate').append('<div style="margin: 30px 35%;" class="card"><div class="card-section">\
            <img src="data:image/png;base64,' + res[id].image + '" alt="a product">\
            <p>Category: ' + res[id].category + '</p><p>' + res[id].name + '</p><p>Available Quantity: ' + res[id].availability + '</p><p>Product Price: ' + res[id].price + '$</p></div></div>');
            $('.changestate').children().children().append('<label style="padding-top: 15px;" for="sel">Choose the applying change</label><div style="margin: 0;" class="buttons">\
                <select style="background-color: #d18bff;" id="sel">\
                    <option value="remprod" selected>Remove This Product</option>\
                    <option value="chprice">Change Product Price</option>\
                    <option value="avqty">Change Available Quantity</option>\
                </select></div>\
                <div class="buttons"><button style="background-color: #FF9900;" class="proceedState button small medium-only-expanded">PROCEED</button></div>')
            
            $('.proceedState').on('click', function(){
                $('.changestate').hide()
                let choice = $(this).parentsUntil('.card-section').prevAll('.buttons').children().children('option:selected').val()
                switch(choice){
                    case "remprod":
                        $.ajax({
                            method: 'DELETE',
                            url: backendRoute + '/removeproduct',
                            data: {
                                name: res[id].name,
                                category: res[id].category
                            }
                        })
                        .then(() => { location.reload(); })
                        .catch(() => { alert('The product couldn\'t be removed due to an error occurred on the server!') })
                        break;
                    case "chprice":
                        $('.apply').append('<h2>Provide a value and apply changes!</h2>');
                        $('.apply').append('<div style="margin: 30px 35%;" class="card"><div class="card-section">\
                        <img src="data:image/png;base64,' + res[id].image + '" alt="a product">\
                        <p>Category: ' + res[id].category + '</p><p>' + res[id].name + '</p><p>Available Quantity: ' + res[id].availability + '</p><p>Product Price: ' + res[id].price + '$</p><label for="pricechange">Provide a new price</label><div style="margin: 0;" class="buttons">\
                            <input id="pricechange" step=".01" type="number"></div>\
                            <div class="buttons"><button style="background-color: #FF9900;" class="applyState button small medium-only-expanded">APPLY</button></div></div></div>');
                        $('.applyState').on('click', function(){
                            let newPrice = $('#pricechange').val();
                            if(newPrice=="") alert('Insert a valid price!')
                            $.post(backendRoute + '/changeprice', {
                                name: res[id].name,
                                category: res[id].category,
                                newprice: newPrice
                            })
                            .then(() => { location.reload(); })
                            .catch(() =>{ alert('An error occurred on the server!'); })
                        })
                        break;
                    case "avqty":
                        $('.apply').append('<h2>Provide a value and apply changes!</h2>');
                        $('.apply').append('<div style="margin: 30px 35%;" class="card"><div class="card-section">\
                        <img src="data:image/png;base64,' + res[id].image + '" alt="a product">\
                        <p>Category: ' + res[id].category + '</p><p>' + res[id].name + '</p><p>Available Quantity: ' + res[id].availability + '</p><label for="qtchange">Provide a new quantity</label><div style="margin: 0;" class="buttons">\
                            <input id="qtchange" type="number"></div>\
                            <div class="buttons"><button style="background-color: #FF9900;" class="applyState button small medium-only-expanded">APPLY</button></div></div></div>');
                        $('.applyState').on('click', function(){
                            let newAvl = $('#qtchange').val();
                            if(newAvl == "") alert('Insert a valid quantity!');
                            $.post(backendRoute + '/changeavl', {
                                name: res[id].name,
                                category: res[id].category,
                                newavl: newAvl
                            })
                            .then(() => { location.reload(); })
                            .catch(() => { alert('An error occurred on the server!') })
                        })
                }
            })
        });

        
    })
    .catch(() => {
        alert('An error occurred on the server!');
    });
});
