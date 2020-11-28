<template>
    <div>

      <div v-if="errorFlag" style="color: red;">
        {{ error }}
      </div>

      <h1>DUMMY</h1>
      <h3>
        <router-link :to="{ name: 'home', path: '/' }">Home</router-link>
        <router-link :to="{ name: 'users', path: 'users' }">Users</router-link>
        <router-link :to="{ name: 'venues', path: 'venues' }">Venues</router-link>
        <router-link :to="{ name: 'login', path: '/user/login' }">Login</router-link>
      </h3>
    </div>
</template>

<script>
    export default {
        data (){
          return{
            error: "",
            errorFlag: false,
            users: []
          }
        },
        mounted: function() {

        },
        methods: {

        }
    }
</script>

<style scoped>

</style>
