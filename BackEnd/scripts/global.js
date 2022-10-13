const backendRoute = 'https://site212223.tw.cs.unibo.it/backend'
const frontendRoute = 'https://site212223.tw.cs.unibo.it/frontoffice'
function checkLog(){
    //let cookie = document.cookie;
    //let cookies = cookie.split('; ');
    let pair = localStorage.getItem('logged');
    let user = '';
    let admin;
    if(pair){
	user = pair.split(' ')[0];
    	admin = (pair.split(' ')[1] == 'true') ? 'admin' : 'user';
    }
    /*for(let i in cookies){
        if(cookies[i].startsWith('logged')) {
            user = cookies[i].split('=')[1].split(',')[0];
            admin = cookies[i].split('=')[1].split(', ')[1]
        }
    }*/
    console.log(user)
    if(user != ''){
        $('#example-dropdown-1').append(
            '<p class="logged">Welcome '+ admin + ' ' + user + '</p>' + 
            '<div class="buttons"><button style="background-color: #9237cf;" class="button small medium-only-expanded" id="logout" type="button">Logout</button></div>'
        );
    }
    else $('#example-dropdown-1').append(
        '<p class="logged">You haven\'t logged in yet</p>'
    );
}

function weekday(num){
    switch(num){
        case 0:
            return "Monday"
        case 1:
            return "Tuesday"
        case 2:
            return "Wednesday"
        case 3: 
            return "Thursday"
        case 4: 
            return "Friday"
        case 5:
            return "Saturday"
        case 6:
            return "Sunday"
        default:
            return "Monday"
    }
}

function daynum(day){
    for(let i = 0; i < 7; i++){
        if(weekday(i)==day) return i;
    }
}
