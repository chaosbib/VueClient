<template>

  <div>
      <div v-if="errorFlag" style="color: red;">
        {{ error }}
      </div>

      <h1>WELCOME TO TRAVEL SITE ADVISER</h1>
      <div>
        <h3 id="menu">
          <router-link :to="{ name: 'home', path: '/' }">Home</router-link>
          <router-link :to="{ name: 'users', path: 'users' }">Users</router-link>
          <router-link :to="{ name: 'venues', path: 'venues' }">Venues</router-link>
          <router-link :to="{ name: 'login', path: '/user/logout' }" v-if="$cookies.isKey('user')">Logout</router-link>
          <router-link :to="{ name: 'login', path: '/user/login' }" v-else>Login</router-link>
        </h3>
      </div>

      <div id="featVenue">
        <h3>Featured Venue</h3>
        <h4>
          <router-link v-if="featuredVenue.venueId" :to="{ name: 'venue', path: '/venues/:venueId', params: { venueId: featuredVenue.venueId }}">
          {{ featuredVenue.venueName }}
          </router-link>
        </h4>
        <router-link v-if="featuredVenue.venueId" :to="{ name: 'venue', path: '/venues/:venueId', params: { venueId: featuredVenue.venueId }}">
        <img v-bind:src="featuredPhoto" width="300" height="250">
        </router-link>
        <h5>{{ featuredVenue.shortDescription }}</h5>
        <h5>Star Rating: {{ featuredVenue.meanStarRating }}</h5>
        <h5 v-if="featuredVenue.modeCostRating === 4">Cost Rating: $$$$</h5>
        <h5 v-if="featuredVenue.modeCostRating === 3">Cost Rating: $$$</h5>
        <h5 v-if="featuredVenue.modeCostRating === 2">Cost Rating: $$</h5>
        <h5 v-if="featuredVenue.modeCostRating === 1">Cost Rating: $</h5>
        <h5 v-if="featuredVenue.modeCostRating === 0">Cost Rating: FREE</h5>
      </div>


  </div>

</template>

<script>

    const localhost = 'https://ariel-chch-vue-server.herokuapp.com/api/v1/reset';

    export default {
        name: "Home",
        data (){
          return{
            error: "",
            errorFlag: false,
            featuredVenue: [],
            featuredPhoto: ""
          }
        },
        mounted: function() {
          this.getFeaturedVenue();
        },
        methods: {
          getFeaturedVenue: function() {
            this.$http.get(localhost + '/venues?count=1&startIndex=0&sortBy=STAR_RATING')
            .then(function(response) {
              if (response.data.length) {
                this.featuredVenue = response.data[0];
                if (response.data[0].primaryPhoto) this.featuredPhoto = localhost + '/venues/' + response.data[0].venueId + '/photos/' + response.data[0].primaryPhoto;
                else this.featuredPhoto = require('./assets/no_img.svg');
              }
            }, function(error) {
              this.error = error;
              this.errorFlag = true;
            });
          }
        }
    }
</script>

<style scoped>
  #menu {
    border: 1px solid black;
    padding: 10px;
    background-color: dimgray;
  }
</style>
