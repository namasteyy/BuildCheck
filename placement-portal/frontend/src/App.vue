<template>
  <div id="app">
    <!-- Main navigation bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top" v-if="!isAuthPage">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Placement Portal</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <!-- Show login/register if not logged in -->
            <li class="nav-item" v-if="!isAuthenticated">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item" v-if="!isAuthenticated">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
            <!-- Show user info and logout if logged in -->
            <li class="nav-item" v-if="isAuthenticated">
              <span class="nav-link">User: {{ user?.email }}</span>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <a class="nav-link" href="#" @click.prevent="handleLogout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container mt-5 pt-5">
      <!-- Main view changes based on the URL -->
      <router-view @login-success="updateAuth"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      user: null
    }
  },
  computed: {
    isAuthenticated() {
      // Check if user object exists
      return !!this.user;
    },
    isAuthPage() {
      // Hide navbar on login and register pages
      return ['/login', '/register'].includes(this.$route.path);
    }
  },
  mounted() {
    // Check if user is already logged in when app starts
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.user = JSON.parse(userStr);
      }
    },
    updateAuth(user) {
      this.user = user;
    },
    handleLogout() {
      // Clear data from storage and reset user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.user = null;
      this.$router.push('/login');
    }
  }
}
</script>

<style>
/* Global styles for the app */
body {
  background-color: #f8f9fa;
}
</style>
