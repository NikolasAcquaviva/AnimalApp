<template>
  <template v-if="menu">
    <h3>Welcome to the Quiz</h3>
    <h3>Evaluate your knowledge!</h3><br>
    <template v-if="ranklist">
      <template v-if="played">
	<div class="avoid">
        <p><b>These are the results of your last game:</b></p>
        <p>Correct Answers: {{ oldPoint/10 }}</p>
        <p>Wrong Answers: {{ oldWrong }}</p>
        <p>Score: {{ oldPoint + flawless }}</p>
        <p v-if="oldPoint/10 == 5"><b>Congratulations!<br>You got a bonus thanks to your flawless try!</b></p><hr></div>
      </template>

      <p style="background: rgb(68,255,170)" v-if="!logged">If you want to appear within, you must do login!</p>
        
        <h2>Ranklist</h2><br>
      <table class="center">
          <tr>
            <th>User</th>
            <th>Pts. Earned</th>
            <th>Games</th>
            <th>Avg Pts-Per-Quiz</th>
          </tr>
          <template v-for="rank in rankings" :key="rank">
            <tr>
              <td> {{ rank.user }} </td>
              <td> {{ rank.totalPts }} </td>
              <td> {{ rank.playedMatches }} </td>
              <td> {{ rank.avgPtsPerQuiz }} </td>
            </tr>
          </template>
        </table>
    </template>

    <template v-else>
      <h3><b>Rules of the Game:</b></h3>
      <div class="avoid">
      <li>You've to answer to 5 questions</li>
      <li>But as soon as you make 2 mistakes, you'll be done!</li>
      <li>Each correct answer leads to an earning of 10 points</li>
      <li>Besides that, if you make a flawless try, your <br>actual score will receive a bonus of 25 points!</li>
      </div>
    </template>
    <div class="btn-container">
      <MDBBtn class="quiz" rounded @click="goToQuiz()">Play Quiz</MDBBtn>
      <MDBBtn class="showlist" v-show="!ranklist" rounded @click="showRanklist()">Ranklist</MDBBtn>
    </div>
  </template>
  
  <template v-if="!exit">
    <div class="avoid">
    <br>
    <p><b>Watch Out: </b></p><br>
    <p><b>There are 5 questions, but if you make 2 mistakes you're done!</b></p><hr>
    <br>
    <p><b>Evaluate the following sentence:</b></p>
  
    <template v-if="cats">
        <p>{{ question }}</p>
    </template>
    <template v-if="bear">
        <p>{{ question }}</p>
    </template>
    <template v-if="dogs">
        <p>{{ question }}</p>
    </template>
    <template v-if="duck">
        <p>{{ question }}</p>
    </template>

    <p><b>Correct Answers: {{ point/10 }}</b></p>
    <p><b>Wrong Answers: {{ wrong }}</b></p>
    </div>
    <MDBBtn class="true" floating color="success" @click="goToTrue()">
      <MDBIcon icon="far fa-check-circle fa-lg"></MDBIcon>
    </MDBBtn>
    <MDBBtn class="false" floating color="danger" @click="goToFalse()">
      <MDBIcon icon="fas fa-times-circle fa-lg"></MDBIcon> 
    </MDBBtn>
  </template>

</template>
<script>
import { MDBBtn, MDBIcon } from 'mdb-vue-ui-kit'
export default {
  components: {
    MDBBtn,
    MDBIcon
  },

  name: 'AppGame',
  
  data(){
    return{
      logged: false,
      question: '',
      point: 0,
      answered: 0,
      menu: true,
      ranklist: false,
      rankings: [],
      played: false,
      cats: false,
      bear: false,
      dogs: false,
      duck: false,
      exit: true,
      oldPoint: 0,
      oldWrong: 0,
      wrong: 0,
      c: 0,
      flawless: 0
    }
  },
  methods: {
    Reset(){
      this.question = '';
      this.point = 0;
      this.wrong = 0;
      this.answered = 0;
      this.menu = true;
    },

    saveTry(){
      if(this.logged){
        this.axios.post('/game/addranking', {
          username: this.$user,
          score: this.point
        })
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
      }
    },

    showRanklist(){
      this.ranklist = true;
      this.axios.get('/game/rankings')
        .then((response) => {
          this.rankings = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    goToFalse(){
      this.wrong++;
      this.answered++;
      if(this.wrong == 2 || this.answered == 5) {
        if(this.logged) this.saveTry();
        this.oldPoint = this.point;
        this.oldWrong = this.wrong;
        this.flawless = 0;
        this.exit = true;
        this.Reset();
        this.showRanklist();
      }
      else this.goToQuiz()
    },
    goToTrue(){
      this.point += 10
      this.answered++;
      if(this.answered == 5){
        this.oldPoint = this.point;
        this.oldWrong = this.wrong;
        if(this.point == 50){
          this.flawless = 25;
          this.point += 25; // punteggio bonus
        }
        else this.flawless = 0;
        if(this.logged) this.saveTry();
        this.exit = true;
        this.Reset();
        this.showRanklist();
      }
      else this.goToQuiz()
    },
    goToQuiz(){
      this.played = true;
      this.menu = false;
      this.exit = false;
      this.duck = false;
      this.dogs = false;
      this.cats = false;
      this.bear = false;
      //prende tutte le info e crea 5 domande randomiche
      //ogni domanda vale un punto, puoi rispondere in modo errato a 2 domande dopodiché stampa la classifica, ogni domanda è diversa dalla precedente
      let i = Math.floor(Math.random() * 4)
      switch(i){
        case 0:
          this.cats = true
          break;
        case 1:
          this.bear = true
          break;
        case 2:
          this.dogs = true
          break;
        default:
          this.duck = true
          break;
      }
      
      if(this.cats){
        this.axios.post('/description/catsfacts')
          .then((response) => {
            this.question = response.data[this.c]
            this.c = (this.c + 1) % 10;
          })
          .catch((error) => {
            console.log(error)
          })
      }
      else if(this.bear){
        this.axios.get('/description/bearfact')
          .then((response) => {
            this.question = response.data
          })
          .catch(() => {
            this.goToQuiz();
          })
      }
      else if(this.dogs){
        this.axios.post('/description/dogsfacts')
          .then((response) => {
            this.question = response.data[0]
          })
          .catch((error) => {
            console.log(error)
          })
      }
      else if(this.duck){
        this.axios.post('/description/duckintelligence')
          .then((response) => {
            this.question = response.data
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
  },
  mounted(){
    if(this.$user != undefined && this.$user != '') this.logged = true;
  }
}
</script>
<style scoped>
  .avoid, li, table{
    background: rgb(68,255,170);
  }
  table, tr, th, td {
    border: 0.1rem solid black;
    border-collapse: collapse;
  }

  .center{
    margin-top: 0.5rem;
    margin-left: auto;
    margin-right: auto;
  }

  .quiz, .showlist{
    background-color: #2CB9FF;
  }

  .quiz{
    position: relative;
    right: 2%
  }
  

  .showlist{
    position: relative;
    left: 2%;
  }

  .btn-container{
    position: absolute;
    left: 1%;
    width: 100%;
    margin-top: 10%;
  }

  .true{
    position: relative;
    right: 2%
  }
  

  .false{
    position: relative;
    left: 2%;
  }
  
</style>
