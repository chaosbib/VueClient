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
        <router-link :to="{ name: 'login', path: '/user/login' }">Login</router-link>
      </h3>

      <div>
        <h3>Create Account</h3>
        Username:<br>
        <input type="text" name="username" placeholder="Username" v-model="username">
        <br>
        Given Name:<br>
        <input type="text" name="givenName" placeholder="Given Name" v-model="givenName">
        <br>
        Family Name:<br>
        <input type="text" name="familyName" placeholder="Family Name" v-model="familyName">
        <br>
        Email:<br>
        <input type="email" name="email" placeholder="Email" v-model="email">
        <br>
        Password:<br>
        <input type="password" name="password" placeholder="Password" v-model="password">
        <br>
        Confirm Password:<br>
        <input type="password" name="confirmPassword" placeholder="Confirm Password" v-model="confirmPassword">
        <br><br>
        <button type=submit v-on:click="register">REGISTER</button>
        <br><div style="color: red;"><br>{{ userError }}</div><br>
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
            username: "",
            givenName: "",
            familyName: "",
            email: "",
            password: "",
            confirmPassword: "",
            userError: "",
          }
        },
        mounted: function() {
          if (this.$cookies.isKey('user')) this.reDirect();
        },
        methods: {
          register: function() {
            if (this.username === "") this.userError = "Username cannot be empty!";
            else if (!/^[a-z0-9_]+$/i.test(this.username)) this.userError = "Username must only contain letters, numbers and underscores";
            else if (this.username.length > 64) this.userError = "Username can only be up to 64 characters!";
            else if (this.givenName === "") this.userError = "Given Name cannot be empty!";
            else if (this.familyName === "") this.userError = "Family Name cannot be empty!";
            else if (this.email === "") this.userError = "Email address cannot be empty!";
            else if (this.password === "") this.userError = "Password cannot be empty!";
            else if (/\s/.test(this.password)) this.userError = "Password cannot have spaces!";
            else if (this.password !== this.confirmPassword) this.userError = "Password do not match!";
            else {
              this.userError = "";
              this.$http.post(localhost + '/users/', JSON.stringify({
                username: this.username,
                givenName: this.givenName,
                familyName: this.familyName,
                email: this.email,
                password: this.password
              }))
                .then(function (response) {
                  if (response.ok) {
                    alert("Account Successfully Created!");
                    this.login();
                  }
                }, function (error) {
                  this.userError = error.statusText.substring(13, error.statusText.length);
                });
            }
          },

          login: function () {
            let data = JSON.stringify({ username: this.username, password: this.password });
            this.$http.post(localhost + '/users/login', data)
              .then(function (response) {
                let user = {
                  auth: true,
                  token: response.body.token,
                  userId: response.body.userId,
                  username: this.username,
                  password: this.password
                };
                this.$cookies.set('user',user);
                this.errorLogin = false;

                this.$router.push({ name: 'user', path: 'users/:userId', params: { userId: response.body.userId } });
              }, function () {
                this.errorLogin = "Invalid Username/Email/Password!";
              });
          },

          reDirect: function() {
            this.$route.push({ name: 'login', path: '/user/' });
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
