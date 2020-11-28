<template>
    <div>

      <div v-if="errorFlag" style="color: red;">
        {{ error }}
      </div>

      <h1>VENUES</h1>
      <h3 id="menu">
        <router-link :to="{ name: 'home', path: '/' }">Home</router-link>
        <router-link :to="{ name: 'users', path: 'users' }">Users</router-link>
        <router-link :to="{ name: 'venues', path: 'venues' }">Venues</router-link>
        <router-link :to="{ name: 'login', path: '/user/logout' }" v-if="$cookies.isKey('user')">Logout</router-link>
        <router-link :to="{ name: 'login', path: '/user/login' }" v-else>Login</router-link>
      </h3>

      <div>
        <h3>Add a Venue</h3>
        <div style="color: red;">{{ venueError }}</div>
        Venue Name:<br>
        <input type="text" name="venueName" placeholder="Venue Name" v-model="venueName">
        <br><br>
        Category:<br>
        <select v-model="category">
          <option v-for="cat in categories" v-bind:value="cat.categoryId"> {{ cat.categoryName }} </option>
        </select>
        <br><br>
        Short Description:<br>
        <input type="text" name="shortDescription" placeholder="Short Description" v-model="shortDescription">
        <br><br>
        Long Description:<br>
        <textarea rows = "2" cols = "30" name = "longDescription"
                  placeholder="Enter longer description" v-model="longDescription"></textarea>
        <br><br>
        City:<br>
        <input type="text" name="city" placeholder="City" v-model="city">
        <br><br>
        Address:<br>
        <input type="text" name="address" placeholder="Address" v-model="address">
        <br><br>
        Latitude:<br>
        <input type="number" name="latitude" placeholder="Latitude" v-model="latitude">
        <br><br>
        Longitude:<br>
        <input type="number" name="longitude" placeholder="Longitude" v-model="longitude">
        <br><br>
        <button v-on:click="addVenue">ADD VENUE</button>
        <br><br>
      </div>
    </div>
</template>

<script>

    const localhost = 'http://localhost:4941/api/v1';
    export default {
        data (){
          return{
            error: "",
            errorFlag: false,
            venueError: "",
            categories: [],
            venueName: "",
            category: "",
            shortDescription: "",
            longDescription: "",
            city: "",
            address: "",
            latitude: 0,
            longitude: 0
          }
        },
        mounted: function() {
          if (!this.$cookies.isKey('user')) this.$router.push({ name: 'venues', path: '/venues' });
          this.getCategories();

        },
        methods: {
          getCategories: function () {
            this.$http.get(localhost + '/categories')
              .then(function (response) {
                if (response.data.length) {
                  this.categories = response.data;
                }
              }, function (error) {
                this.error = error;
                this.errorFlag = true;
              });
          },

          addVenue: function () {
            if (this.venueName === "") this.venueError = "Venue Name cannot be empty!";
            else if (this.category <= 0) this.venueError = "Please select a category!";
            else if (this.city === "") this.venueError = "City cannot be empty!";
            else if (this.address === "") this.venueError = "Address cannot be empty!";
            else {
              let headers = {'Content-Type': 'application/json'};
              headers['X-Authorization'] = this.$cookies.get('user').token;

              let data = JSON.stringify({
                'venueName': this.venueName,
                'categoryId': this.category,
                'shortDescription': this.shortDescription,
                'longDescription': this.longDescription,
                'city': this.city,
                'address': this.address,
                'latitude': this.latitude,
                'longitude': this.longitude
              });

              this.$http.post(localhost + '/venues/', data, {headers: headers})
                .then(function (response) {
                  let id = response.body.venueId;
                  alert("Venue successfully added!");
                  this.$router.push({ name: 'venue', path: 'venues/:venueId', params: { venueId: id }});
                }, function (error) {
                  this.venueError = error.statusText;
                });
            }
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
