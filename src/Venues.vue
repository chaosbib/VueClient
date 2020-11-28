<template>
    <div>

      <div v-if="errorFlag" style="color: red;">
        {{ error }}
      </div>

      <h1>VENUES</h1>
      <h3 id="menu">
        <router-link id="mHome" :to="{ name: 'home', path: '/' }">Home</router-link>
        <router-link id="mUsers" :to="{ name: 'users', path: 'users' }">Users</router-link>
        <router-link id="mVenues" :to="{ name: 'venues', path: '/venues' }" @click.native="reviewing = false">
          <span @click="getFilteredVenue()">
            Venues
          </span>
        </router-link>
        <router-link id="mLogout" :to="{ name: 'login', path: '/user/logout' }" v-if="$cookies.isKey('user')">Logout</router-link>
        <router-link id="mLogin" :to="{ name: 'login', path: '/user/login' }" v-else>Login</router-link>
      </h3>

      <div v-if="$cookies.isKey('user')">
        <router-link :to="{ name: 'venues', path: '/venues' }"><span @click="getAdminVenues()">My Venues</span></router-link>
        &nbsp
        <router-link :to="{ name: 'addVenue', path: 'venue/add' }">Add Venue</router-link>
      </div>
      <br>

      <div v-if="$route.params.venueId">
        <div v-if="venue !== ''">

          <h2 id="vName">{{ venue.venueName }}</h2>

          <!-- EDIT -->
          <div v-if="$cookies.isKey('user')">
            <button v-if="venue.admin.userId === $cookies.get('user').userId" v-on:click="editVenue">EDIT VENUE</button>
          </div>

          <!-- REVIEW -->
          <div v-if="reviewable" v-on:click="addReview"><button>Add Review</button></div>
          <div id="reviewBorder" v-if="reviewing">
            <br>
              Star Rating:<br>
              <input type="number" min=1 max=5 name="starRating" v-model="starRating">
              <br>
              Cost Rating:<br>
              <select v-model="costRating">
                <option v-bind:value="0">Free</option>
                <option v-bind:value="1">$</option>
                <option v-bind:value="2">$$</option>
                <option v-bind:value="3">$$$</option>
                <option v-bind:value="4">$$$$</option>
              </select>
              <br><br>
              Your Review:
              <br>
              <textarea rows = "2" cols = "30" name = "review"
                        placeholder="Enter review" v-model="review"></textarea>
            <br>
            <div style="color: red;">
              {{ reviewError }}
            </div>
            <br>
              <button v-on:click="submitReview">Submit Review</button>
            <br><br>
          </div>
          <div id="vCat">Category #{{ venue.category.categoryId }}: {{ venue.category.categoryName }}</div>
          <div id="vAdmin">
            Admin:
            <router-link :to="{ name: 'user', path: '/users/:userId', params: { userId: venue.admin.userId } }">
            {{ venue.admin.username }}
            </router-link>
          </div>
          <div id="vCity">City: {{ venue.city }}</div>
          <div id="vAddr">Address: {{ venue.address }}</div>
          <div id="vDesc">
            Description: {{ description }}
          </div>
          <button v-on:click="moreDetails">{{ expanded }}</button>

          <div id="vStar" v-if="meanStarRating">Star Rating: {{ meanStarRating.toFixed(1) }}</div>
          <div id="vCost" v-else>Star Rating: None</div>
          <div v-if="modeCostRating">
            <p v-if="parseInt(modeCostRating) === 4">Cost Rating: $$$$</p>
            <p v-if="parseInt(modeCostRating) === 3">Cost Rating: $$$</p>
            <p v-if="parseInt(modeCostRating) === 2">Cost Rating: $$</p>
            <p v-if="parseInt(modeCostRating) === 1">Cost Rating: $</p>
            <p v-if="parseInt(modeCostRating) === 0">Cost Rating: FREE</p>
          </div>
          <div v-else>Cost Rating: FREE</div>

          <!-- PHOTOS -->
          <div id="vPhoto" v-if="venue.photos.length">
            <div v-for="photo in venue.photos">
                <img v-bind:src="'http://localhost:4941/api/v1/venues/' + $route.params.venueId + '/photos/' + photo.photoFilename">
            </div>
          </div>

          <div v-else>
            <img v-bind:src="require('./assets/no_img.svg')"
                 width="300" height="250">
          </div>

          <br>

          <!-- REVIEWS -->

          <div id="allReviews" v-if="reviewList.length > 0">
            REVIEWS
            <br><br>
            <div v-for="review in reviewList">
              <div id="reviewEntry">
              <p>[{{ review.timePosted.substring(11, 16) }} {{ review.timePosted.substring(0, 10) }}]<br>
                <router-link :to="{ name: 'user', path: '/users/:userId', params: { userId: review.reviewAuthor.userId } }">
                {{ review.reviewAuthor.username }}
              </router-link>
                says:</p>
              <p>{{ review.reviewBody }}</p>
              <p>Star Rating: {{ review.starRating }}</p>
              <p v-if="review.costRating==4">Cost Rating: $$$$</p>
              <p v-if="review.costRating==3">Cost Rating: $$$</p>
              <p v-if="review.costRating==2">Cost Rating: $$</p>
              <p v-if="review.costRating==1">Cost Rating: $</p>
              <p v-if="review.costRating==0||review.costRating==null">Cost Rating: FREE</p>
              </div>
              <br>
              <br>
            </div>
          </div>

          <div v-else>
            No Reviews Yet
          </div>

          <br><br>

        </div>

        <div v-else>
          <h2>Venue not found.</h2>
        </div>
      </div>

      <div v-else>
        <div id="filter">
        <!-- FILTERS -->
        Search:
        <input type="text" name="search" placeholder="Search" v-model="search">
        &nbsp&nbsp
        Category:
        <select v-model="category">
          <option value="">--</option>
          <option v-for="cat in categories" v-bind:value="cat.categoryId"> {{ cat.categoryName }} </option>
        </select>

        &nbsp&nbsp
        Min. Star:
        <select v-model="minStarRating">
          <option v-bind:value="1">1</option>
          <option v-bind:value="2">2</option>
          <option v-bind:value="3">3</option>
          <option v-bind:value="4">4</option>
          <option v-bind:value="5">5</option>
        </select>

        &nbsp&nbsp
        Max. Cost:
        <select v-model="maxCostRating">
          <option v-bind:value="0">Free</option>
          <option v-bind:value="1">$</option>
          <option v-bind:value="2">$$</option>
          <option v-bind:value="3">$$$</option>
          <option v-bind:value="4">$$$$</option>
        </select>

        <br><br>

        City:
        <select v-model="cityFilter">
          <option value="">--</option>
          <option v-for="city in cities" v-bind:value="city"> {{ city }} </option>
        </select>

        &nbsp&nbsp
        Sort By:
        <select v-model="sortBy">
          <option v-bind:value="1">Star: High-Low</option>
          <option v-bind:value="2">Star: Low-High</option>
          <option v-bind:value="3">Cost: Low-High</option>
          <option v-bind:value="4">Cost: High-Low</option>
        </select>

        <br><br>
        <button v-on:click="getFilteredVenue">Apply Filter</button>

        <div style="color: red;">
          <br>{{ venueFilterError }}
        </div>

        <div v-if="pages.length > 1">
          PAGE:
          <br>
          <span v-for="num in pages" @click="setPage(num)">
            &nbsp
            <a>
               {{ num }}
            </a>
            &nbsp
          </span>
        </div>
        <br>
        <p v-if="venues.length > 1">Found {{ venues.length }} results. Showing {{ pageText }}.</p>
        <p v-else>Found {{ venues.length }} result.</p>
        </div>


        <!-- ALL VENUES -->
        <br><br>

        <div v-if="venues.length" id="venues">
          <li>
            <tr v-for="venue in venues" v-if="venues.indexOf(venue) >= lowerBound && venues.indexOf(venue) <= upperBound">
              <br>
              <td id="vEntry">
                <div><h3>
                  <router-link :to="{ name: 'venue', params: { venueId: venue.venueId }}">
                    <span @click="getVenue(venue.venueId)">
                    {{ venue.venueName }}
                    </span>
                  </router-link>
                </h3></div>
                <div>{{ getCategory(venue.venueId) }}</div>
                <div v-if="venue.meanStarRating">Star Rating: {{ venue.meanStarRating.toFixed(1) }}</div>
                <div v-else>Star Rating: None</div>
                <div v-if="venue.modeCostRating">
                  <p v-if="parseInt(venue.modeCostRating) === 4">Cost Rating: $$$$</p>
                  <p v-if="parseInt(venue.modeCostRating) === 3">Cost Rating: $$$</p>
                  <p v-if="parseInt(venue.modeCostRating) === 2">Cost Rating: $$</p>
                  <p v-if="parseInt(venue.modeCostRating) === 1">Cost Rating: $</p>
                  <p v-if="parseInt(venue.modeCostRating) === 0">Cost Rating: FREE</p>
                </div>
                <div v-else>Cost Rating: FREE</div>
              </td>

              <div>
                <td>
                  <div v-if="venue.primaryPhoto">
                    <router-link :to="{ name: 'venue', params: { venueId: venue.venueId }}">
                      <span @click="getVenue(venue.venueId)">
                      <img v-bind:src="'http://localhost:4941/api/v1/venues/' + venue.venueId + '/photos/' + venue.primaryPhoto"
                           width="300" height="250">
                      </span>
                    </router-link>
                  </div>

                  <div v-else>
                    <router-link :to="{ name: 'venue', params: { venueId: venue.venueId }}">
                      <span @click="getVenue(venue.venueId)">
                      <img v-bind:src="require('./assets/no_img.svg')"
                           width="300" height="250">
                      </span>
                    </router-link>
                  </div>
                </td>
              </div>
            </tr>
          </li>
          <br><br>
        </div>

        <div v-else>
          Try a new search :)
        </div>

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
            venue: "",
            venues: [],
            categories: [],
            cities: [],
            cityFilter: "",
            description: '',
            expanded: "More details",
            meanStarRating: 0,
            modeCostRating: 0,
            reviewable: false,
            reviewing: false,
            review: "",
            starRating: 3,
            costRating: 3,
            reviewError: "",
            reviewList: [],
            author: "",

            //filter values
            venueFilterError: '',
            search: "",
            category: '',
            sortBy: 1,
            minStarRating: 1,
            maxCostRating: 4,
            admin: false,

            //page variables
            maxPage: 1,
            currentPage: 1,
            pages: [],
            upperBound: 9,
            lowerBound: 0,
            pageText: ""
          }
        },

        mounted: function() {
          this.getAllVenue();
          this.getCategories();
          this.getFilteredVenue();
          if (this.$route.params.venueId) this.getVenue(parseInt(this.$route.params.venueId));
          this.expanded = "More details";
          this.calculatePage();
        },

        methods: {
          getAllVenue: function() {
            this.$http.get(localhost + '/venues')
              .then(function(response) {
                if (response.data.length) {
                  this.venues = response.data;
                }
                for (let i=0; i < response.data.length; i++) {
                  let city = response.data[i].city;
                  if (!this.cities.includes(city)) this.cities.push(city);
                }
              }, function(error) {
                this.error = error;
                this.errorFlag = true;
              });
          },

          moreFilterVenue: function(vList) {
            let result = [];
            for (let i = 0; i < vList.length; i++) {
              let push = true;
              if (this.cityFilter !== '' && !(this.cityFilter === vList[i].city)) push = false;
              if (!(vList[i].meanStarRating >= this.minStarRating || (vList[i].meanStarRating === null && this.minStarRating <= 3))) push = false;
              if (!(vList[i].modeCostRating <= this.maxCostRating)) push = false;
              if (push) result.push(vList[i]);
            }
            return result;
          },

          getFilteredVenue: function() {
            // Reset all values
            this.venueFilterError = '';
            this.venues = [];
            this.cities = [];
            let sort = 'sortBy=STAR_RATING';
            let reverse = false;
            switch(this.sortBy) {
              case 2:
                reverse = true;
                break;
              case 3:
                sort = 'sortBy=COST_RATING';
                reverse = false;
                break;
              case 4:
                sort = 'sortBy=COST_RATING';
                reverse = true;
                break;
            }
            //
            let filter = '';
            filter += sort;
            if (reverse) filter += '&reverseSort=true';
            if (this.search !== '') filter += '&q=' + this.search;
            if (this.category !== '') filter += '&categoryId=' + this.category;
            if (this.admin) filter += '&adminId=' + this.$cookies.get('user').userId;
            this.$http.get(localhost + '/venues?' + filter)
              .then(function(response) {
                if (response.data.length) {
                  this.venues = this.moreFilterVenue(response.data);
                  this.setPage(1);
                  for (let i=0; i < response.data.length; i++) {
                    let city = response.data[i].city;
                    if (!this.cities.includes(city)) this.cities.push(city);
                  }
                }
              }, function(error) {
                this.error = error.statusText;
                this.errorFlag = true;
              });
          },

          getCategories: function() {
            this.$http.get(localhost + '/categories')
              .then(function(response) {
                if (response.data.length) {
                  this.categories = response.data;
                }
              }, function(error) {
                this.error = error;
                this.errorFlag = true;
              });
          },

          getCategory: function(id) {
            let desc = 'Venue';
            for (let i=0; i < this.categories.length; i++) {
              let category = this.categories[i];
              if (category.categoryId === id) {
                desc = category.categoryDescription;
              }
            }
            return desc;
          },

          getVenue: function(id) {
            this.$http.get(localhost + '/venues/' + id)
              .then(function (response) {
                if (response.data) {
                  this.venue = response.data;
                  this.description = response.data.shortDescription;

                  for (let i = 0; i < this.venues.length; i++) {
                    if (this.venues[i].venueId === id) {
                      this.meanStarRating = this.venues[i].meanStarRating;
                      this.modeCostRating = this.venues[i].modeCostRating;
                    }
                  }

                  this.checkReview();
                  this.getReviews();
                }
              }, function (error) {
                this.error = error;
                this.errorFlag = true;
              });
          },

          venueExist: function(id) {
            for (let i=0; i < this.venues.length; i++) {
              if (parseInt(this.venues[i].venueId) === parseInt(id)) {
                return true;
              }
            }
            return false;
          },

          moreDetails: function() {
            if (this.expanded === "Less details") {
              this.description = this.venue.shortDescription;
              this.expanded = "More details";
            } else {
              this.description = this.venue.shortDescription + " " + this.venue.longDescription;
              this.expanded = "Less details";
            }
          },

          checkReview: function() {
            let venueId = this.$route.params.venueId;
            if (!this.$cookies.isKey('user')) this.reviewable = false;
            else if (this.venue.admin.userId === this.$cookies.get('user').userId) this.reviewable = false;
            else {
              let userId = this.$cookies.get('user').userId;
              let headers = {'Content-Type': 'application/json'};
              headers['X-Authorization'] = this.$cookies.get('user').token;
              this.$http.get(localhost + '/users/' + userId + '/reviews', {headers: headers})
                .then(function (response) {
                  this.reviewable = true;
                  for (let i = 0; i < response.body.length; i++) {
                    if (response.body[i].venue.venueId === venueId) {
                      this.reviewable = false;
                    }
                  }
                }, function (error) {
                  if (error.status === 404) this.reviewable = true;
                });
            }
          },

          addReview: function() {
            this.reviewing = !this.reviewing;
            this.reviewError = "";
          },

          submitReview: function() {
            if (this.review === "") this.reviewError = "Please enter your review!";
            else {
              this.reviewing = false;
              let venueId = this.$route.params.venueId;
              let headers = {'Content-Type': 'application/json'};
              headers['X-Authorization'] = this.$cookies.get('user').token;
              let data = JSON.stringify({
                "reviewBody": this.review,
                "starRating": parseInt(this.starRating),
                "costRating": parseInt(this.costRating)
              });
              this.$http.post(localhost + '/venues/' + venueId + '/reviews', data, {headers: headers})
                .then(function () {
                  this.reviewing = false;
                  this.reviewable = false;
                  this.getVenue(venueId);
                  alert("Review Added!");
                }, function (error) {
                  this.error = error;
                  this.errorFlag = true;
                });
            }
          },

          getReviews: function() {
            let venueId = this.$route.params.venueId;
            this.$http.get(localhost + '/venues/' + venueId + '/reviews')
              .then(function (response) {
                if (response.data) {
                  this.reviewList = response.data;
                }
              }, function (error) {
                this.error = error;
                this.errorFlag = true;
              });
          },

          editVenue: function() {
            this.$router.push({ name: 'editVenue', params: { venueId: this.$route.params.venueId }});
          },

          getAdminVenues: function() {
            this.admin = true;
            this.venueFilterError = '';
            this.search = '';
            this.category = '';
            this.sortBy = 1;
            this.minStarRating = 1;
            this.maxCostRating = 4;
            this.cityFilter = '';

            this.getFilteredVenue();
            this.admin = false;
          },

          calculatePage: function() {
            this.maxPage = Math.ceil(this.venues.length/10);
            this.upperBound = (this.currentPage*10) - 1;
            this.lowerBound = (this.currentPage-1) * 10;
            let pageList = [];
            for (let i = 0; i < this.maxPage; i++) {
              pageList.push(i+1);
            }
            this.pages = pageList;
          },

          setPage: function(num) {
            this.currentPage = num;
            this.calculatePage();
            let up = this.upperBound + 1;
            let lo = this.lowerBound + 1;
            if (this.currentPage === this.maxPage) up = this.venues.length;
            if (up === lo) this.pageText = up;
            else this.pageText = lo + "-" + up;
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

  #vName {
    border: 1px solid black;
    padding: 10px;
    background-color: darkgray;
  }

  #vCat {
    border: 1px solid black;
    padding: 10px;
    background-color: darkgray;
  }

  #filter {
    border: 1px solid black;
    padding: 1px;
    background-color: ghostwhite;
  }

  #vEntry {
    border: 1px solid black;
    padding: 30px;
    background-color: ghostwhite;
  }

  #reviewEntry {
    border: 1px solid black;
    background-color: blanchedalmond;
  }

  #allReviews {
    border: 1px solid black;
    background-color: whitesmoke;
  }

  #reviewBorder {
    border: 1px solid black;
    background-color: whitesmoke;
  }

</style>
