import Vue from 'vue';
import App from './App.vue';
import Home from './Home.vue';
import Users from './Users.vue';
import Venues from './Venues.vue';
import Login from './Login.vue';
import newUser from './newUser.vue';
import addVenue from './addVenue.vue';
import editVenue from './editVenue.vue';

import VueResource from 'vue-resource';
Vue.use(VueResource);

import VueRouter from 'vue-router';
import VueCookies from 'vue-cookies';
Vue.use(VueRouter);
Vue.use(VueCookies);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/users/:userId",
    name: "user",
    component: Users
  },
  {
    path: '/user/login',
    name: 'login',
    component: Login
  },
  {
    path: 'user/logout',
    name: 'logout',
    component: Login
  },
  {
    path: '/user/new',
    name: 'create',
    component: newUser
  },
  {
    path: '/users',
    name: "users",
    component: Users
  },
  {
    path: '/venues',
    name: "venues",
    component: Venues
  },
  {
    path: '/venues/:venueId',
    name: "venue",
    component: Venues
  },
  {
    path: '/venue/add',
    name: 'addVenue',
    component: addVenue
  },
  {
    path: '/venues/:venueId/edit',
    name: 'editVenue',
    component: editVenue
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});


new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
