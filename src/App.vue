<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
const localhost = 'http://localhost:4941/api/v1';
export default {
  name: 'app',
  data () {
    return {
    }
  },
  mounted: function() {
    this.$cookies.set("default_unit_second","input_value",0);
    if (this.$cookies.isKey('user')) this.reLogin();
  },

  methods: {
    reLogin: function () {
      let username = this.$cookies.get('user').username;
      let password = this.$cookies.get('user').password;
      let data = JSON.stringify({ username: username, password: password });
      if (username.includes('@')) data = JSON.stringify({email: username, password: password });
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
        }, function () {
          this.error = "Invalid Username/Email/Password!";
        });
    },
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
