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

      <div>
        <h3>User Account</h3>
          Username/Email:<br>
          <input type="text" name="username" placeholder="Username/Email" v-on:submit="login" v-model="username">
          <br>
          Password:<br>
          <input type="password" name="password" placeholder="Password" v-on:submit="login" v-model="password">
          <br><br>
          <button v-on:click="login">LOGIN</button>
          <br><div style="color: red;"><br>{{ errorLogin }}</div><br>
          <router-link :to="{ name: 'create', path: '/user/new' }">Create Account</router-link>
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
            errorLogin: "",
            userId: -1,
            username: "",
            password: "",
            token: "",
            auth: false,
          }
        },

        mounted: function() {
          if (this.$cookies.isKey('user')) this.logout();
        },
        methods: {
          login: function () {
            let username = this.username;
            let password = this.password;
            if (this.username === "") this.errorLogin = "Username cannot be empty!";
            else if (this.password === "") this.errorLogin = "Password cannot be empty!";
            else {
              this.errorLogin = "";
              let data = JSON.stringify({ username: this.username, password: this.password });
              if (username.includes('@')) data = JSON.stringify({email: this.username, password: this.password });

              this.$http.post(localhost + '/users/login', data)
                .then(function (response) {
                  let user = {
                    auth: true,
                    token: response.body.token,
                    userId: response.body.userId,
                    username: username,
                    password: password
                  };
                  this.$cookies.set('user',user);
                  this.errorLogin = false;

                  this.$router.push({ name: 'user', path: 'users/:userId', params: { userId: response.body.userId } });
                }, function () {
                  this.errorLogin = "Invalid Username/Email/Password!";
                });
            }
          },


          logout: function() {
            let headers = { 'Content-Type': 'application/json' };
            headers['X-Authorization'] = this.$cookies.get('user').token;
            this.$http.post(localhost + '/users/logout', null, {headers: headers})
              .then(function (response) {
                this.removeAuth();
                this.$router.push({ name: 'home', path: '/' });
              }, function (error) {
                this.error = error;
                this.errorFlag = true;
              });
          },

          removeAuth: function() {
            this.$cookies.remove('user');
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
