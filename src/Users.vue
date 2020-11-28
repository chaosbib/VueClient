<template>
    <div>

      <div v-if="errorFlag" style="color: red;">
        {{ error }}
      </div>

      <h1>USERS</h1>
      <h3 id="menu">
        <router-link :to="{ name: 'home', path: '/' }">Home</router-link>
        <router-link :to="{ name: 'users', path: 'users' }">Users</router-link>
        <router-link :to="{ name: 'venues', path: 'venues' }">Venues</router-link>
        <router-link :to="{ name: 'login', path: '/user/logout' }" v-if="$cookies.isKey('user')">Logout</router-link>
        <router-link :to="{ name: 'login', path: '/user/login' }" v-else>Login</router-link>
      </h3>

      <div v-if="$cookies.isKey('user')">
        <router-link :to="{ name: 'user', path: '/users/:userId', params: { userId: $cookies.get('user').userId } }"><span @click="loadProfile()">My Profile</span></router-link>
      </div>
      <div v-else>
        <router-link :to="{ name: 'create', path: '/user/new' }">Create Account</router-link>
        &nbsp
        Guest
      </div>

      <div v-if="$route.params.userId && !editing && !changePassword && !uploadPhoto">
        <h3>{{ user.username }}'s Profile</h3>
        <br>
        <img v-bind:src="profilePhoto" width=120 height="100">
        <br><br>
        Username: {{ user.username }}
        <br>
        Given Name: {{ user.givenName }}
        <br>
        Family Name: {{ user.familyName }}
        <div v-if="$cookies.isKey('user')">
          <p v-if="$cookies.get('user').userId === parseInt($route.params.userId)">
            Email: {{ user.email }}
            <br>
            Password: {{ $cookies.get('user').password }}
          </p>
          <br>
          <button v-if="$cookies.get('user').userId === parseInt($route.params.userId)" v-on:click="editProfile()">Edit Profile</button>
          <button v-if="$cookies.get('user').userId === parseInt($route.params.userId)" v-on:click="editPassword()">Change Password</button>
          <br><br>
          <button v-if="$cookies.get('user').userId === parseInt($route.params.userId) && existProfilePhoto()" v-on:click="editProfilePhoto">Change Photo</button>
          <button v-else-if="$cookies.get('user').userId === parseInt($route.params.userId)" v-on:click="editProfilePhoto">Upload Photo</button>
          <button v-if="$cookies.get('user').userId === parseInt($route.params.userId) && existProfilePhoto()" v-on:click="deleteProfilePhoto()">Delete Photo</button>
        </div>
      </div>

      <div v-if="editing">
        <h3>Editing {{ user.username }}'s Profile</h3>
        Given Name:<br>
        <input type="text" name="givenName" placeholder="Given Name" v-model="givenName">
        <br>
        Family Name:<br>
        <input type="text" name="familyName" placeholder="Family Name" v-model="familyName">
        <br>
        Password:<br>
        <input type="password" name="password" placeholder="Password" v-model="password">
        <br>
        <div style="color: red;"><br>{{ userError }}</div><br>
        <button type=submit v-on:click="updateProfile">SAVE</button>
        <button type=submit v-on:click="editProfile()">CANCEL</button>
        <br><br>
      </div>

      <div v-if="changePassword">
        <h3>Editing {{ user.username }}'s Profile</h3>
        Current Password:<br>
        <input type="password" name="password" placeholder="Current Password" v-model="password">
        <br>
        New Password:<br>
        <input type="password" name="newPassword" placeholder="New Password" v-model="newPassword">
        <br>
        Confirm New Password:<br>
        <input type="password" name="confirmPassword" placeholder="Confirm New Password" v-model="confirmPassword">
        <br>
        <div style="color: red;"><br>{{ userError }}</div><br>
        <button type=submit v-on:click="updatePassword">SAVE</button>
        <button type=submit v-on:click="editPassword()">CANCEL</button>
        <br><br>
      </div>

      <div v-if="uploadPhoto">
        <h3>Editing {{ user.username }}'s Profile</h3>
        <br>
        CURRENT PHOTO<br>
        <img v-bind:src="profilePhoto" width=120 height="100">
        <br><br><br>
        <div>
          <li><input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/></li>
        </div>
        <br><br>
        <div style="color: red;"><br>{{ userError }}</div><br>
        <button type=submit v-on:click="checkUploadPhoto()">CONFIRM UPLOAD</button>
        <button type=submit v-on:click="editProfilePhoto()">CANCEL</button>
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
            user: [],
            profilePhoto: "",
            editing: false,
            changePassword: false,
            uploadPhoto: false,
            givenName: "",
            familyName: "",
            password: "",
            confirmPassword: "",
            userError: "",
            newPassword: '',
            file: '',
          }
        },
        mounted: function() {
          if (this.$route.params.userId) this.getUser(this.$route.params.userId);
          if (this.$route.params.userId) this.getProfilePhoto(this.$route.params.userId);
        },
        methods: {
          getUser: function(id) {
            let headers = {'Content-Type': 'application/json'};
            if (this.$cookies.isKey('user')) headers['X-Authorization'] = this.$cookies.get('user').token;
            this.$http.get(localhost + '/users/' + id, {headers: headers})
              .then(function (response) {
                this.user = response.body;
                this.givenName = response.body.givenName;
                this.familyName = response.body.familyName;
              }, function (error) {
                this.error = error;
                this.errorFlag = true;
              });
          },

          loadProfile: function() {
            let id = this.$cookies.get('user').userId;
            this.getUser(id);
            this.getProfilePhoto(id);
            this.$router.push({ name: 'users', path: 'users', params: { userId: id } });
          },

          editProfile: function() {
            this.editing = !this.editing;
            this.password = '';
            this.userError = '';
          },

          editPassword: function() {
            this.changePassword = !this.changePassword;
            this.password = '';
            this.newPassword = '';
            this.confirmPassword = '';
            this.userError = '';
          },

          updateProfile: function() {
            if (this.givenName === '') this.userError = "Given Name cannot be empty!";
            else if (this.familyName === '') this.userError = "Family Name cannot be empty!";
            else if (this.password === '') this.userError = "Enter your password to authorize!";
            else if (this.password !== this.$cookies.get('user').password) this.userError = "You have entered the wrong password!";
            else {
              let headers = {'Content-Type': 'application/json'};
              headers['X-Authorization'] = this.$cookies.get('user').token;

              let data = JSON.stringify({
                  'givenName': this.givenName,
                  'familyName': this.familyName
              });
              let id = this.$cookies.get('user').userId;
              this.$http.patch(localhost + '/users/' + id, data, {headers: headers})
                .then(function (response) {
                  if (response.status === 200) this.editProfile();
                  this.userError = '';
                  this.getUser(id);
                }, function (error) {
                  this.userError = error.statusText;
                });
            }
          },

          updatePassword: function() {
            if (this.password === '') this.userError = "Enter your Current Password to authorize!";
            else if (this.password !== this.$cookies.get('user').password) this.userError = "You have entered the wrong password!";
            else if (this.newPassword === '') this.userError = "Your New Password cannot be empty!";
            else if (/\s/.test(this.newPassword)) this.userError = "Your New Password cannot have spaces!";
            else if (this.familyName === '') this.userError = "Family Name cannot be empty!";
            else if (this.newPassword !== this.confirmPassword) this.userError = "Your New Passwords do not match!";
            else {
              let headers = {'Content-Type': 'application/json'};
              headers['X-Authorization'] = this.$cookies.get('user').token;

              let data = JSON.stringify({
                'password': this.newPassword
              });
              let id = this.$cookies.get('user').userId;
              this.$http.patch(localhost + '/users/' + id, data, {headers: headers})
                .then(function (response) {
                  if (response.status === 200) {
                    let user = {
                      auth: true,
                      token: this.$cookies.get('user').token,
                      userId: this.$cookies.get('user').userId,
                      username: this.$cookies.get('user').username,
                      password: this.newPassword
                    };
                    this.$cookies.set('user',user);
                    this.editPassword();
                  }
                  this.userError = '';
                  this.getUser(id);
                }, function (error) {
                  this.userError = error.statusText;
                });
            }
          },

          getProfilePhoto: function(id) {
            this.$http.get(localhost + '/users/' + id + '/photo')
              .then(function (response) {
                if (response.ok) {
                  this.profilePhoto = localhost + '/users/' + id + '/photo';
                }
              }, function (error) {
                this.profilePhoto = require('./assets/no_img.svg');
              });
          },

          deleteProfilePhoto: function() {
            let headers = { 'Content-Type': 'application/json' };
            headers['X-Authorization'] = this.$cookies.get('user').token;
            this.$http.delete(localhost + '/users/' + this.$cookies.get('user').userId + '/photo', {headers: headers})
              .then(function (response) {
                if (response.ok) {
                  this.profilePhoto = require('./assets/no_img.svg')
                }
              }, function (error) {
                if (error.status === 404) alert("You don't have profile photo");
              });
          },

          existProfilePhoto: function() {
            return this.profilePhoto !== require('./assets/no_img.svg');
          },

          editProfilePhoto: function() {
            this.uploadPhoto = !this.uploadPhoto;
            this.userError = '';
          },

          handleFileUpload: function(){
            this.file = this.$refs.file.files[0];
          },

          uploadProfilePhoto: function(){
            let headers = {'Content-Type': this.file.type};
            headers['X-Authorization'] = this.$cookies.get('user').token;
            this.profilePhoto = '';

            this.$http.put(localhost + '/users/' + this.$cookies.get('user').userId + '/photo', this.file, {headers: headers})
              .then(function (response) {
                if (response.status === 200 || response.status === 201) {
                  this.editProfilePhoto();
                  this.profilePhoto = localhost + '/users/' + this.$cookies.get('user').userId + '/photo';
                }
              }, function (error) {
                console.log(error);
              });

            this.loadProfile();
          },

          checkUploadPhoto: function() {
            if (this.file === '') this.userError = "Please select a photo to upload!";
            else if (this.file.size/1000000 > 20) this.userError = "Pictures can only be up to 20MB maximum!";
            else this.uploadProfilePhoto();
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
