<template>  
  <MDBNavbar class="fixed-top" expand="lg" style="background-color: #44FFAA" light container>
      <MDBNavbarToggler collapsed @click="collapse1 = !collapse1"
        target="#navbarSupportedContent"></MDBNavbarToggler>      

      <MDBNavbarNav class="mb-2 mb-lg-0">
        <MDBNavbarBrand class="position-absolute start-50 translate-middle" href="/">The Animal Game</MDBNavbarBrand>
        <MDBNavbarItem class="dropdown position-absolute">
          <MDBDropdown v-model="dropdown3">
            <MDBDropdownToggle
              tag="a" class="nav-link"
              @click="dropdown3 = !dropdown3" tabindex="0" @keyup.enter="dropdown3 = !dropdown3" 
              @keyup.space="dropdown3 = !dropdown3">
              <MDBIcon icon="far fa-arrow-alt-circle-right fa-lg"></MDBIcon>
            </MDBDropdownToggle>
            <MDBDropdownMenu>
              <MDBDropdownItem href="/FrontOffice/">Front Office</MDBDropdownItem>
              <MDBDropdownItem href="/BackOffice">Back Office</MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBNavbarItem>
      </MDBNavbarNav>
    
      <MDBCollapse v-model="collapse1" id="navbarSupportedContent">
        <MDBNavbarNav class="mb-2 mb-lg-0">        
          <MDBNavbarBrand id="welcome" v-show="logged" class="position-absolute end-0">Welcome {{ user }}</MDBNavbarBrand>
          <MDBNavbarItem v-show="!logged" href="/BackOffice/#/users/login">
              Login   <MDBIcon icon="fas fa-user-alt fa-sm"></MDBIcon> 
          </MDBNavbarItem>
          <MDBNavbarItem v-show="logged" to="/" @click="logout()">
            Logout  <MDBIcon icon="fas fa-user-slash fa-sm"></MDBIcon>
          </MDBNavbarItem>
          <MDBNavbarItem @click="collapse1 = !collapse1" to="/"> Home </MDBNavbarItem>
          <MDBNavbarItem @click="collapse1 = !collapse1" to="/game"> Quiz </MDBNavbarItem>
          <MDBNavbarItem @click="collapse1 = !collapse1" to="/curiosity"> Curiosity </MDBNavbarItem>
          <MDBNavbarItem @click="collapse1 = !collapse1" to="/sanitary"> Sanitary </MDBNavbarItem>
          <MDBNavbarItem @click="collapse1 = !collapse1" to="/videos"> Videos </MDBNavbarItem>       
        </MDBNavbarNav> 
      </MDBCollapse> 
  </MDBNavbar>

  <div class="main-container">
    <router-view></router-view>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import {
      MDBIcon,
      MDBNavbarBrand,
      MDBNavbarToggler,
      MDBCollapse,
      MDBNavbar,
      MDBNavbarNav,
      MDBNavbarItem,
      MDBDropdown,
      MDBDropdownToggle,
      MDBDropdownMenu,
      MDBDropdownItem
  } from 'mdb-vue-ui-kit';
  export default {
    components: {
      MDBIcon,
      MDBNavbarBrand,
      MDBNavbarToggler,
      MDBCollapse,
      MDBNavbar,
      MDBNavbarNav,
      MDBNavbarItem,
      MDBDropdown,
      MDBDropdownToggle,
      MDBDropdownMenu,
      MDBDropdownItem
    },
    setup() {
      const collapse1 = ref(false);
      const dropdown3 = ref(false);
      return {
        collapse1,
        dropdown3
      }
    },
  name: 'App',

  data() {
    return {
      user: '',
      admin: false,
      logged: false
    }
  },

  methods: {
    logout(){
      localStorage.removeItem('logged');
      location.reload();
    }
  },
  mounted(){
    if(this.$admin != undefined){
      if(this.$user != ''){
        this.admin = this.$admin
        this.user = this.$user
        this.logged = true;
      }
    }

    /*document.addEventListener('visibilitychange', function () {
    if(document.hidden)  alert(location.href);
    if (!document.hidden){
      let cookie = document.cookie;
      let pair;
      if(cookie != ''){
        let cookies = cookie.split('; ');
        for(let i in cookies){
            if(cookies[i].startsWith('logged')) pair = cookies[i].split('=')[1]
        }
        console.log(pair);
      }
      if((!this.logged && pair != '')
          || this.logged && pair == '')
        location.reload();

    } 
    }.bind(this));*/
  }
}
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000000;
}

body{
  background-image: url("../assets/pumpkin.jpg");
  background-size: 100%;
}

.main-container{
  position: absolute;
  top: 13%;
  right: 10%;
  left: 10%;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  text-align: center;
  
}

li.dropdown{
	right: 5px;
	top: 8px;
}

@media (max-width: 767px){
	li.dropdown{
		right: 5px;
		top: 2px;
	}
}

@media (min-width: 768px) {
	li.dropdown{
		right: 5px;
		top: 8px;
	}
	#welcome{
		right: 10%!important;
	}
}
</style>
