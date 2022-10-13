'use strict'
let frontRoute = 'https://site212223.tw.cs.unibo.it/frontoffice';
let backRoute = 'https://site212223.tw.cs.unibo.it/backend';
let pair = localStorage.getItem('logged');
let isAdmin = false;
let userLogged = '';
let logged = false;      
if(pair){
	userLogged = pair.split(' ')[0];
	isAdmin = pair.split(' ')[1];
	logged = true;
}
/*
for(let i in cookies){
    if(cookies[i].startsWith('logged')){
        console.log(cookies[i]);
        isAdmin = cookies[i].split(', ')[1].split('=')[1];
        userLogged = cookies[i].split('=')[1];
        userLogged = userLogged.split(',')[0];
        logged = true;
    }
}
*/
function admin(){ return isAdmin; }
function user(){ return userLogged; }
function hasLogged(){ return logged; }
