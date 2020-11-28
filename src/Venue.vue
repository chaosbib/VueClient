<template>
    <div>

      <div v-if="errorFlag" style="color: red;">
        {{ error }}
      </div>

      <h1>Venue</h1>
      <h3>
        <router-link :to="{ path: '/' }">Home</router-link>
        <router-link :to="{ path: 'users' }">Users</router-link>
        <router-link :to="{ path: 'venues' }">Venues</router-link>
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
