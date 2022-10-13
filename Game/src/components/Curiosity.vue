<template>
    <h4>Select an animal to read some curiosities about it!</h4>
    
    <div class="first">
      <MDBBtn class="cat" rounded @click="goToGatti()">Cats
        <MDBIcon style="position: relative; left: 4px;" icon="fas fa-cat fa-lg"></MDBIcon>  
      </MDBBtn>
      <MDBBtn style="background-color: #00BBDD" rounded @click="goToPesci()">Fish
        <MDBIcon style="position: relative; left: 4px;" icon="fas fa-fish fa-lg"></MDBIcon>
      </MDBBtn>
    </div>
    <MDBBtn style="background-color: #99AA55" rounded @click="goToOrsi()">Bears
      <MDBIcon style="position: relative; left: 4px;" icon="fas fa-paw fa-lg"></MDBIcon>
    </MDBBtn>
    <div class="second">
      <MDBBtn class="dog" rounded @click="goToCani()">Dogs
        <MDBIcon style="position: relative; left: 4px;" icon="fas fa-dog fa-lg"></MDBIcon>
      </MDBBtn>
      <MDBBtn style="background-color: #FFED00" rounded @click="goToPapere()">Ducks
        <MDBIcon style="position: relative; left: 4px;" icon="fas fa-kiwi-bird fa-lg"></MDBIcon>
      </MDBBtn>
    </div>
  
    <template v-if="cats">
      <img alt="A picture of this kind of animal!" class="center-fit" v-bind:src="img" /><br>
      <MDBContainer class="card" lg>
        <div v-for="item in facts" :key="item">
          <p>{{ item }}</p>
        </div>
      </MDBContainer>
    </template>
    
    <template v-if="fishes">
      <p v-if="err">Sadly for this breed there is no image :(</p>
      <img alt="A picture of this kind of animal!" v-if="!err" class="center-fit" v-bind:src="img" /><br><br>
      <MDBContainer class="card" lg>
        <p> <b>Breed:</b> {{ fishName }} </p>
        <div v-for="item in facts" :key="item">
          <p>{{ item }}</p>
        </div>
      </MDBContainer>
    </template>
    
    <template v-if="bears">
      <img alt="A picture of this kind of animal!" class="center-fit" v-bind:src="img" /><br>
      <MDBContainer class="card" lg>
        <div v-for="item in facts" :key="item">
          <p>{{ item }}</p>
        </div>
      </MDBcontainer>
    </template>
    
    <template v-if="dogs">
      <img alt="A picture of this kind of animal!" class="center-fit" v-bind:src="img" /><br>
      <MDBContainer class="card" lg>
        <div v-for="item in facts" :key="item">
          <p>{{ item }}</p>
        </div>
      </MDBContainer>
    </template>
    
    <template v-if="ducks">
      <img alt="A picture of this kind of animal!" class="center-fit" v-bind:src="img" /><br>
      <MDBContainer class="card" lg>
        <p>{{ facts[0] }}</p>
      </MDBContainer>
    </template>
</template>
<script>
import { MDBBtn, MDBIcon, MDBContainer } from 'mdb-vue-ui-kit';

export default {
  name: 'AppCuriosity',
  data(){
    return {
      img: '',
      err: false,
      facts: [],
      cats: false,
      fishName: '',
      fishes: false,
      bears: false,
      dogs: false,
      ducks: false,
      fishCode: 0
    }
  },

  components: {
    MDBBtn,
    MDBIcon,
    MDBContainer
  },

  methods: {
    allOff(){
      this.fishes = false
      this.bears = false
      this.dogs = false
      this.ducks = false
      this.cats = false;
      this.err = false;
    },
    goToGatti(){
      this.facts = [];
      this.allOff();
      this.axios.post('/description/catintheface')
        .then((response) => { 
            this.img = "data:image/jpeg;base64," + response.data
            this.cats = true
        })
        .catch((error) => {
          console.log(error)
        })
      this.axios.post('/description/catsfacts')
        .then((response) => {
          for(let i in response.data) this.facts.push(response.data[i])
        })
        .catch((error) => {
          console.log(error)
        })
    },
    goToPesci(){
      this.allOff();
      this.facts = [];
      this.axios.post('/description/fishonthetable')
      .then((response) => {
        this.img = response.data.image
        this.fishCode = response.data.number
        this.FishInfo(this.fishCode)
        this.fishes = true;
      })
      .catch(() => {
        this.fishes = true;
        this.err = true;
      })
    },

    FishInfo(n){
      this.axios.post('/description/fishinfo', {
        headers: this.axios.defaults.headers,
        num: n
      })
      .then((response) => {
        this.fishName = response.data.Name
        this.fishFacts = response.data.Habitat
        if(this.fishFacts != null){
          this.fishFacts = this.fishFacts.replaceAll('&nbsp;','');
          this.fishFacts = this.fishFacts.replaceAll('<ul>','');
          this.fishFacts = this.fishFacts.replaceAll('</ul>','');
          this.fishFacts = this.fishFacts.replaceAll('<li>','');
          this.facts = this.fishFacts.split('</li>')
          this.facts.pop()
        }
      })
      .catch((error) => {
        console.log(error)
      })
    },

    goToOrsi(){
      this.allOff();
      this.facts = [];
      this.axios.post('/description/bearonyourtroat')
        .then((response) => {
          this.img = "data:image/jpeg;base64," + response.data
          this.bears = true
      })
      .catch((error) => {
        console.log(error)
      })
      this.axios.get('/description/bearfact')
      .then((response) => {
        console.log(response)
        this.facts.push(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
    },

    goToCani(){
      this.allOff();
      this.facts = [];
      this.axios.post('/description/dogwantmeal')
      .then((response) => {
          this.img = "data:image/jpeg;base64," + response.data
          this.dogs = true
      })
      .catch((error) => {
        console.log(error)
      })
      this.axios.post('/description/dogsfacts')
      .then((response) => {
        for(let i in response.data) this.facts.push(response.data[i])
      })
      .catch((error) => {
        console.log(error)
      })
    },
    
    goToPapere(){
      this.allOff();
      this.facts = [];
      this.axios.post('/description/duckforlife')
        .then((response) => {
          this.img = "data:image/jpeg;base64," + response.data
          this.ducks = true
        })
        .catch((error) => {
          console.log(error)
        })
      this.axios.post('/description/duckintelligence')
        .then((response) => {
          this.facts.push(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    goToLogin(){
      window.location = "http://localhost:10000/#/users/login"
    },
  }
}
</script>
<style scoped>
  .center-fit {
    margin-top: 5%;
    max-width: 100%;
    max-height: 100vh;
  }

  .first{
    margin-top: 15%;
    margin-bottom: 15%;
  }

  .first .cat{
    margin-right: 4%;
    background-color: #FF55FF
  }

  .second{
    margin-top: 15%;
  }

  .second .dog{
    margin-right: 4%;
    background-color: #00BA9A
  }

  .card{
    background-color: #44FFBA;
    margin-top: 15px;
    padding-top: 5%;
    padding-bottom: 5%;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
  }
</style>