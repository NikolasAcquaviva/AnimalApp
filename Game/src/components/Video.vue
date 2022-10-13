<template>

    <div class="high">
        <p><b>Click To Watch Some Funny Videos About Pets</b></p>
        <div class="high-btn">
            <MDBBtn block style="background-color: #FF0044; position: relative;" @click="getVideoIds('funny')"> Funny 
                <MDBIcon style="position: relative; left: 5px;" class="me-2" iconStyle="fab" icon="fab fa-youtube fab-lg"></MDBIcon>
            </MDBBtn>
            <MDBBtn block style="background-color: #FF0044; relative; top: 10px" @click="getVideoIds('informative')"> Informative 
                <MDBIcon style="position: relative; left: 5px;" class="me-2" iconStyle="fab" icon="fab fa-youtube fab-lg"></MDBIcon>
            </MDBBtn>
        </div>
    </div>
    
    <template v-if="funny">
        <template v-for="video in funny_videos" :key="video">
            <div class="container">
                <div v-html="video"></div>
            </div>
        </template>
    </template>

    <template v-if="informative">
        <template v-for="video in informative_videos" :key="video">
            <div class="container">
                <div v-html="video"></div>
            </div>
        </template>
    </template>
</template>
<script>
import { MDBBtn, MDBIcon } from 'mdb-vue-ui-kit';
export default {
  name: 'AppVideo',
  data(){
    return {
       funny_videos: [], 
       informative_videos: [], 
       funny: false,
       informative: false
    }
  },
  components: {
    MDBBtn,
    MDBIcon
  },

  methods: {
    goToLogin(){
      window.location = "http://localhost:10000/#/users/login"
    },
    getVideoIds(query){
        this.funny_videos = []
        this.informative_videos = []
        this.axios.get('/game/video_ids?word=' + query)
            .then((res) => {
                for(let i in res.data)
                    this.getVideos(res.data[i],query);
            })
            .catch((err) =>{
                console.log(err)
            });
    },

    getVideos(id,query){
        this.axios.get('/game/videos?id='+id, {
        })
            .then((res) => {
                if(query=='funny'){
                    this.informative = false;
                    this.funny = true;
                    this.funny_videos.push(res.data)
                }
                else{
                    this.funny = false;
                    this.informative = true,
                    this.informative_videos.push(res.data)
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
  }
}
</script>
<style>
    .high{
        padding-bottom: 10%;
    }

    .high-btn{
        margin-right: 15%;
        margin-left: 15%;
    }

    .container{
        position: relative;
        overflow: hidden;
        height: 0%;
        margin: 10px 0;
    }

    .video{
        position: relative;
        top: 0;
        left: 0;
        height: 100%;
    }
</style>
