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
        <h3>Edit your Venue</h3>
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
        <button v-on:click="postVenue">SAVE</button>
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
            longitude: 0,
          }
        },
        mounted: function() {
          if (!this.$cookies.isKey('user')) this.$router.push({ name: 'venues', path: '/venues' });
          this.getCategories();
          this.getVenue();
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

          postVenue: function () {
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

              let id = this.$route.params.venueId;
              this.$http.patch(localhost + '/venues/' + id, data, {headers: headers})
                .then(function (response) {
                  if (response.status === 200) this.$router.push({ name: 'venue', params: { venueId: id }});
                }, function (error) {
                  this.venueError = error.statusText;
                });
            }
          },

          getVenue: function() {
            let id = this.$route.params.venueId;
            this.$http.get(localhost + '/venues/' + id)
              .then(function (response) {
                if (response.data) {
                  this.venueName = response.data.venueName;
                  this.category = response.data.category.categoryId;
                  this.shortDescription = response.data.shortDescription;
                  this.longDescription = response.data.longDescription;
                  this.city = response.data.city;
                  this.address = response.data.address;
                  this.latitude = response.data.latitude;
                  this.longitude = response.data.longitude;
                  if (this.$cookies.get('user').userId !== response.data.admin.userId) this.$router.push({ name: 'venues', path: '/venues' });
                }
              }, function (error) {
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
