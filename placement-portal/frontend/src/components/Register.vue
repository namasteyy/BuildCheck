<template>
  <div class="container min-vh-100 d-flex align-items-center justify-content-center py-5">
    <div class="row justify-content-center w-100">
      <div class="col-md-7 col-lg-5 p-4 border rounded shadow bg-white">
        <div class="text-center mb-4">
            <h2 class="mb-1">Create New Account</h2>
            <p class="text-muted">Register as a student or company</p>
        </div>
        
        <form @submit.prevent="step === 1 ? goToStep2() : handleRegister()">
          
          <!-- STEP 1: Choose if you are a student or company -->
          <div v-if="step === 1">
              <div class="mb-4 text-center">
                  <h5 class="mb-4">Select User Type:</h5>
                  <div class="d-flex gap-3 justify-content-center">
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" v-model="role" value="student" id="r-stud">
                        <label class="form-check-label" for="r-stud">Student</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" v-model="role" value="company" id="r-comp">
                        <label class="form-check-label" for="r-comp">Company</label>
                      </div>
                  </div>
              </div>
              
              <div class="d-grid mb-3">
                  <button type="submit" class="btn btn-primary btn-lg">Next</button>
              </div>
          </div>

          <!-- STEP 2: Fill in the name, email, etc. -->
          <div v-if="step === 2">
              <div class="mb-3">
                <label class="form-label">Email ID</label>
                <input v-model="email" type="email" class="form-control" required placeholder="myemail@example.com">
              </div>
              
              <div class="mb-3">
                  <label class="form-label">Create Password</label>
                  <input v-model="password" type="password" class="form-control" required placeholder="••••••••">
              </div>

              <!-- Extra fields for students -->
              <div v-if="role === 'student'">
                  <div class="mb-3">
                    <label class="form-label">Your Name</label>
                    <input v-model="name" type="text" class="form-control" placeholder="John Doe" required>
                  </div>
                  
                  <div class="row g-3 mb-4">
                      <div class="col-md-6">
                          <label class="form-label">Degree</label>
                          <select v-model="degree" class="form-select" required>
                              <option value="B.Tech">B.Tech</option>
                              <option value="M.Tech">M.Tech</option>
                              <option value="BCA">BCA</option>
                              <option value="MCA">MCA</option>
                          </select>
                      </div>
                      <div class="col-md-6">
                          <label class="form-label">CGPA</label>
                          <input v-model="cgpa" type="number" step="0.1" class="form-control" placeholder="7.5" required>
                      </div>
                  </div>
              </div>
              
              <!-- Extra fields for companies -->
              <div v-if="role === 'company'">
                  <div class="mb-4">
                    <label class="form-label">Company Name</label>
                    <input v-model="name" type="text" class="form-control" placeholder="Google Inc." required>
                  </div>
              </div>
              
              <div class="d-grid mb-3">
                  <button type="submit" class="btn btn-success btn-lg">Complete Registration</button>
              </div>
              <button type="button" class="btn btn-link w-100" @click="step = 1">Go Back</button>
          </div>
          
          <div class="text-center mt-3">
              <p class="small">Already have an account? <router-link to="/login">Login here</router-link></p>
          </div>
        </form>
        
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
      step: 1,
      email: '',
      password: '',
      role: 'student',
      name: '',
      department: '',
      degree: 'B.Tech',
      cgpa: '',
      year: '2025',
      error: ''
    }
  },
  methods: {
    // Go to next part of the form
    goToStep2() {
        this.error = ''
        this.step = 2
    },
    // Send registration data to backend
    async handleRegister() {
      this.error = ''
      try {
        await axios.post('http://localhost:5001/api/auth/register', {
          email: this.email,
          password: this.password,
          role: this.role,
          name: this.name,
          department: this.department || 'General',
          degree: this.degree,
          cgpa: parseFloat(this.cgpa) || 0.0,
          year: parseInt(this.year) || 2025
        })
        alert('You have registered successfully! Now you can login.')
        this.$router.push('/login')
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed. Try again.'
      }
    }
  }
}
</script>

<style scoped>
/* Basic styling */
</style>
