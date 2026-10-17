<template>
  <div class="container min-vh-100 d-flex align-items-center justify-content-center">
    <!-- Main login box -->
    <div class="row justify-content-center w-100">
      <div class="col-md-5 col-lg-4 p-4 border rounded shadow">
        <div class="text-center mb-4">
            <h2 class="mb-1">Student Placement Portal</h2>
            <p class="text-muted">Enter your details to login</p>
        </div>
        
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">Email Address</label>
            <input v-model="email" type="email" class="form-control" required placeholder="name@example.com">
          </div>
          <div class="mb-4">
            <label class="form-label">Password</label>
            <input v-model="password" type="password" class="form-control" required placeholder="••••••••">
          </div>
          
          <!-- Submit button -->
          <div class="d-grid mb-3">
              <button type="submit" class="btn btn-primary btn-lg">Login</button>
          </div>
          
          <div class="text-center">
              <p class="small">New here? <router-link to="/register">Create an account</router-link></p>
          </div>
        </form>
        
        <!-- Show error message if login fails -->
        <div v-if="error" class="alert alert-danger mt-3 small text-center">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    // Function to handle login form submission
    async handleLogin() {
      this.error = ''
      try {
        const response = await axios.post('http://localhost:5001/api/auth/login', {
          email: this.email,
          password: this.password
        })
        const { token, user } = response.data
        
        // Save token and user info in browser storage
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        // Tell parent component that we logged in
        this.$emit('login-success', user)
        
        // Redirect based on user role
        if (user.role === 'admin') {
            this.$router.push('/admin')
        }
        else if (user.role === 'company') {
            this.$router.push('/company')
        }
        else {
            this.$router.push('/student')
        }
      } catch (err) {
        // Show error message from server or a generic one
        this.error = err.response?.data?.message || 'Login failed. Please check your credentials.'
      }
    }
  }
}
</script>

<style scoped>
/* No extra styles needed for now, using Bootstrap classes */
</style>
