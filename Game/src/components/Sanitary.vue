<template>
  <template v-if="sanitary">
    <h4>The following informations are about what drugs the animal have been subjected to and what the adverse reactions have been!</h4><br>
    <MDBContainer class="card" lg v-for="item in facts" :key="item">
      <br><p><b>Animal:</b> {{ item.specie }}</p>
      <p><b>Gender:</b> {{ item.gender }}</p>
      <p><b>Assessed by:</b> {{ item.assessed }}</p>
      <p><b>Reproductive Status:</b> {{ item.reproStatus }}</p> 
      <br><p><b>Ingredients which are contained in the drugs submitted to the animal: </b></p>
      <div v-for="ingredient in item.ingredients" :key="ingredient">
        <p>- {{ ingredient }}</p>
      </div>
      <br><p><b>Adverse reactions shown by the animal:</b></p>
      <div v-for="problem in item.problems" :key="problem">
        <p>- {{ problem }}</p>
      </div>
    </MDBContainer>
  </template>
</template>
<script>
import { MDBContainer } from 'mdb-vue-ui-kit'
export default {
  name: 'AppSanitary',
  data(){
    return {
      facts: [],
      sanitary: false,
    }
  },

  components: {
    MDBContainer
  },

  methods: {
    sanitaryFacts(){
      this.axios.get('/description/sanitary')
        .then((response) => {
          this.sanitary = true;
          this.facts = response.data
        })
        .catch((err) => {
          console.log(err)
        });
    }
  },

  mounted(){
    this.sanitaryFacts();
  }
}
</script>
<style scoped>
  .card {
    background-color: #44FFBA;
    margin-bottom: 15px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
  }

</style>