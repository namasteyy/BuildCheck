<template>
  <div class="container pb-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
             <h2 class="mb-1">Welcome, {{ studentName }}</h2>
             <div class="d-flex text-muted gap-3 small">
                 <a href="#" class="text-decoration-none text-primary" @click.prevent="view = 'profile'">
                     Edit My Profile
                 </a>
                 <span class="opacity-25">|</span>
                 <a href="#" class="text-decoration-none text-primary" @click.prevent="view = 'dashboard'">
                     Back to Dashboard
                 </a>
             </div>
        </div>
      <div class="d-flex gap-2 align-items-center">
         <div v-if="notifications.length > 0" class="dropdown me-2">
             <button class="btn btn-link text-primary position-relative p-0" data-bs-toggle="dropdown">
                 <i class="fas fa-bell fa-lg"></i>
                 <span class="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger p-1">
                     <span class="visually-hidden">unread notifications</span>
                 </span>
             </button>
             <ul class="dropdown-menu dropdown-menu-end shadow border-0 p-2" style="min-width: 300px;">
                 <li v-for="n in notifications" :key="n.id" class="p-2 border-bottom border-light">
                     <div class="fw-bold small text-primary">{{ n.job_name }}</div>
                     <div class="small text-muted">{{ n.message }}</div>
                     <div class="fs-8 text-muted opacity-50">{{ formatDate(n.timestamp) }}</div>
                 </li>
                 <li v-if="notifications.length === 0" class="text-center py-3 text-muted small">No new notifications.</li>
             </ul>
         </div>
         <button class="btn btn-primary btn-sm rounded-pill px-3" @click="exportCSV" :disabled="exportLoading">
             <span v-if="exportLoading"><i class="fas fa-spinner fa-spin me-1"></i> Processing...</span>
             <span v-else><i class="fas fa-file-export me-1"></i> Export Data</span>
         </button>
         <button v-if="csvReady" class="btn btn-success btn-sm rounded-pill px-3" @click="downloadCSV">
             <i class="fas fa-download me-1"></i> Download CSV
         </button>
         <button class="btn btn-outline-danger btn-sm rounded-pill px-3" @click="logout">Logout</button>
      </div>
    </div>

    <!-- Dashboard View -->
    <div v-if="view === 'dashboard'" class=" ">
        
        <!-- Success Banner -->
        <div v-if="selectedApplications.length > 0" class="card shadow-sm p-4 bg-success bg-opacity-10 border-success border-opacity-25 mb-5">
            <div class="d-flex align-items-center gap-4">
                <div class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                    <i class="fas fa-trophy fa-2x"></i>
                </div>
                <div>
                    <h3 class="text-success mb-1 fw-bold">Congratulations, {{ studentName }}!</h3>
                    <p class="mb-0 text-success text-opacity-75 fs-5">You have been selected by 
                        <span class="fw-bold" v-for="(app, index) in selectedApplications" :key="app.id">
                            {{ app.company }}<span v-if="index < selectedApplications.length - 1">, </span>
                        </span>!
                    </p>
                </div>
            </div>
        </div>

        <!-- Organizations Section -->
        <div class="card shadow-sm p-4 mb-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="d-flex align-items-center gap-3 flex-grow-1">
                    <h4 class="mb-0 text-nowrap">Companies List</h4>
                    <div class="search-wrapper position-relative flex-grow-1" style="max-width: 400px;">
                        <input v-model="companySearch" type="text" class="form-control" placeholder="Search companies...">
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2 mt-3 mt-md-0">
                    <div class="form-check form-switch cursor-pointer">
                        <input class="form-check-input cursor-pointer" type="checkbox" id="eligibleToggle" v-model="showEligibleOnly">
                        <label class="form-check-label text-muted small fw-bold cursor-pointer select-none" for="eligibleToggle">Eligible Only</label>
                    </div>
                </div>
            </div>
            <div class="row g-4">
                <div v-for="company in filteredCompanies" :key="company.id" class="col-md-6 col-lg-4">
                    <div class="card h-100 shadow-sm p-3 h-100 d-flex flex-column">
                        <div class="d-flex align-items-center mb-3">
                            <div>
                                <h5 class="card-title fw-bold text-main mb-0">{{ company.name }}</h5>
                                <div class="badge bg-primary bg-opacity-10 text-primary fs-8 text-uppercase mb-2">{{ company.industry || 'General' }}</div>
                                <span v-if="company.website" class="badge bg-light text-dark border ms-2"><i class="fas fa-globe me-1"></i> Website</span>
                            </div>
                        </div>
                        <div class="mt-auto">
                            <button @click="viewCompany(company.id)" class="btn btn-sm btn-outline-primary w-100 rounded-pill">
                                View Opportunities
                            </button>
                        </div>
                    </div>
                </div>
                <div v-if="filteredCompanies.length === 0" class="col-12 text-center py-5 text-muted">
                    <i class="fas fa-search fa-2x mb-3 opacity-25"></i>
                    <p>No organizations match your filters.</p>
                </div>
            </div>
        </div>

        <!-- Applied Drives Section -->
        <div class="card shadow-sm p-4  ">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="mb-0">My Applications</h4>
                <i class="fas fa-file-signature text-success opacity-50"></i>
            </div>
            <div class="table-responsive">
                <table class="table table-borderless align-middle">
                    <thead>
                        <tr class="text-muted fs-7 text-uppercase">
                            <th>Drive Details</th>
                            <th>Company</th>
                            <th>Applied Date</th>
                            <th class="text-end">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="app in myApps" :key="app.id" class="border-top border-white border-opacity-25">
                            <td>
                                <div class="fw-bold text-main">{{ app.drive_title }}</div>
                                <div class="text-muted fs-7">{{ app.role || 'General Role' }}</div>
                            </td>
                            <td>
                                <div class="text-main fw-medium">{{ app.company }}</div>
                            </td>
                            <td>
                                <div class="text-muted small">{{ formatDate(app.date) }}</div>
                            </td>
                            <td class="text-end">
                                <span :class="['badge', statusBadgeClass(app.status)]">
                                    {{ app.status }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="myApps.length === 0">
                            <td colspan="4" class="text-center py-5 text-muted">
                                <i class="fas fa-clipboard-list fa-2x mb-2 opacity-25"></i>
                                <p>You haven't applied to any drives yet.</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Company Details View -->
    <div v-if="view === 'company_details' && selectedCompany" class="">
        <div class="mb-4">
             <button @click="view = 'dashboard'" class="btn btn-link text-muted p-0 text-decoration-none transition-all hover-primary">
                 <i class="fas fa-arrow-left me-1"></i> Back to Dashboard
             </button>
        </div>
        
        <div class="card shadow-sm p-4 mb-4 shadow-lg">
            <div class="d-flex justify-content-between align-items-start mb-4">
                <div class="d-flex align-items-center mb-4">
                <div>
                    <h2 class="fw-bold text-main mb-2">{{ selectedCompany.name }}</h2>
                    <div class="d-flex gap-3 text-muted">
                            <span class="fw-medium">{{ selectedCompany.industry }}</span>
                            <a v-if="selectedCompany.website" :href="selectedCompany.website" target="_blank" class="text-primary text-decoration-none">
                                <i class="fas fa-globe me-1"></i> Website
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mb-5 bg-white bg-opacity-30 p-4 rounded-4">
                <h5 class="text-primary text-uppercase small fw-bold mb-3 ls-1">About the Company</h5>
                <p class="mb-0 text-main">{{ selectedCompany.description || 'No description available.' }}</p>
            </div>
            
            <div class="border-top pt-5">
                 <h4 class="mb-4">Active Recruitment Drives</h4>
                 <div class="row g-4">
                     <div v-for="drive in selectedCompany.drives" :key="drive.id" class="col-md-6">
                         <div class="card h-100 shadow-sm p-3 d-flex justify-content-between align-items-center">
                             <div>
                                 <div class="d-flex align-items-center gap-2 mb-1">
                                     <h5 class="mb-0 text-main">{{ drive.title }}</h5>
                                     <span v-if="drive.is_eligible" class="badge bg-success bg-opacity-10 text-success" style="font-size: 0.65rem;">Eligible</span>
                                     <span v-else class="badge bg-danger bg-opacity-10 text-danger" style="font-size: 0.65rem;">Not Eligible</span>
                                 </div>
                                 <div class="text-muted small">
                                     <i class="far fa-clock me-1"></i> Deadline: {{ formatDate(drive.deadline) }}
                                 </div>
                             </div>
                             <button @click="viewDrive(drive)" class="btn btn-primary btn-sm px-4">
                                 Details
                             </button>
                         </div>
                     </div>
                     <div v-if="!selectedCompany.drives || selectedCompany.drives.length === 0" class="col-12 text-center py-5 text-muted card h-100 shadow-sm p-3 bg-transparent border-dashed">
                         <p>No active drives for this company at the moment.</p>
                     </div>
                 </div>
            </div>
        </div>
    </div>

    <!-- Drive Details View -->
    <div v-if="view === 'drive_details' && selectedDrive" class="">
        <div class="row justify-content-center">
            <div class="col-md-9 col-lg-8">
                <div class="mb-4">
                     <button @click="view = 'company_details'" class="btn btn-link text-muted p-0 text-decoration-none transition-all hover-primary">
                         <i class="fas fa-arrow-left me-1"></i> Back to Company
                     </button>
                </div>

                <div class="card shadow-sm p-4 position-relative shadow-lg p-5">
                    <div class="text-center mb-5">
                         <div class="avatar-circle-lg bg-primary bg-opacity-10 text-primary mx-auto mb-4">
                             {{ selectedCompany ? selectedCompany.name.charAt(0) : 'D' }}
                         </div>
                         <div class="text-uppercase text-primary small fw-bold ls-1 mb-2">{{ selectedCompany?.name }}</div>
                         <h1 class="fw-bold text-main">{{ selectedDrive.title }}</h1>
                    </div>
                    
                    <div class="row g-4 mb-5">
                        <div class="col-md-6">
                            <div class="card h-100 shadow-sm p-3 bg-white bg-opacity-50 border-0">
                                <label class="small text-muted text-uppercase fw-bold mb-1 d-block">Compensation</label>
                                <div class="fw-bold fs-4 text-success">{{ selectedDrive.package || 'Not Disclosed' }}</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card h-100 shadow-sm p-3 bg-white bg-opacity-50 border-0">
                                <label class="small text-muted text-uppercase fw-bold mb-1 d-block">Deadline</label>
                                <div class="fw-bold fs-4 text-main">{{ formatDate(selectedDrive.deadline) }}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-5">
                        <h5 class="text-primary text-uppercase small fw-bold mb-3 ls-1">Job Description</h5>
                        <p class="text-main fs-5-light">{{ selectedDrive.description || 'No description provided.' }}</p>
                    </div>
                    
                     <div class="mb-5" v-if="selectedDrive.requirements">
                        <h5 class="text-primary text-uppercase small fw-bold mb-3 ls-1">Eligibility & Requirements</h5>
                        <div class="bg-primary bg-opacity-5 p-4 rounded-4">
                            <p class="text-main mb-0">{{ selectedDrive.requirements }}</p>
                        </div>
                    </div>
                    
                    <div class="d-grid pt-3">
                        <button v-if="selectedDrive.is_eligible" @click="apply(selectedDrive.id)" class="btn btn-primary btn-lg py-3">
                            Apply for this Position
                        </button>
                        <button v-else class="btn btn-secondary btn-lg py-3" disabled>
                            Not Eligible Based on Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Profile View -->
     <div v-if="view === 'profile'" class="">
        <div class="mb-4">
             <button @click="view = 'dashboard'" class="btn btn-link text-muted p-0 text-decoration-none transition-all hover-primary">
                 <i class="fas fa-arrow-left me-1"></i> Back to Dashboard
             </button>
        </div>
      <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card shadow-sm p-4 shadow-lg">
                <div class="text-center mb-5">
                    <div class="mb-3 d-inline-block p-3 rounded-circle bg-primary bg-opacity-10">
                        <i class="fas fa-user-circle fa-2x text-primary text-opacity-75"></i>
                    </div>
                    <h3 class="text-main">Edit Profile</h3>
                    <p class="text-muted">Keep your information up to date for better opportunities</p>
                </div>
                
                <form @submit.prevent="updateProfile">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold text-uppercase">Full Name</label>
                            <input v-model="profile.name" class="form-control form-control" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold text-uppercase">Degree</label>
                            <select v-model="profile.degree" class="form-select form-control" required>
                                <option value="" disabled selected>Select Degree</option>
                                <option value="B.Tech">B.Tech</option>
                                <option value="M.Tech">M.Tech</option>
                                <option value="BS">BS</option>
                                <option value="MS">MS</option>
                                <option value="PHD">PHD</option>
                                <option value="BBA">BBA</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold text-uppercase">Department / Branch</label>
                            <select v-model="profile.department" class="form-select form-control" required>
                                <option value="" disabled selected>Select Department</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Electrical Engineering">Electrical Engineering</option>
                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                                <option value="Civil Engineering">Civil Engineering</option>
                                <option value="Business Administration">Business Administration</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold text-uppercase">CGPA</label>
                            <input v-model="profile.cgpa" type="number" step="0.01" class="form-control form-control" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold text-uppercase">Resume link</label>
                            <input v-model="profile.resume_link" class="form-control form-control" placeholder="Google Drive/LinkedIn link">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold text-uppercase">Monthly Report Format</label>
                            <select v-model="profile.report_format" class="form-select form-control" required>
                                <option value="HTML">HTML Email</option>
                                <option value="PDF">PDF Attachment</option>
                            </select>
                        </div>
                    </div>
                    <div class="mt-5 d-grid">
                        <button type="submit" class="btn btn-primary btn-lg">Save Profile Changes</button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// Main script for the student dashboard
// We use axios to connect to our Flask backend
import axios from 'axios'

export default {
  data() {
    return {
      // Current view (dashboard, profile, etc)
      view: 'dashboard', 
      studentName: 'Student',
      companies: [],
      myApps: [],
      selectedCompany: null,
      selectedDrive: null,
      // Store student profile details here
      profile: {
          name: '',
          department: '',
          degree: '',
          cgpa: 0,
          resume_link: '',
          report_format: 'HTML'
      },
      token: '', // Authentication token
      companySearch: '', // For the search bar
      showEligibleOnly: false,
      notifications: [],
      csvReady: false,
      exportLoading: false
    }
  },
  computed: {
    filteredCompanies() {
        return this.companies.filter(c => {
            if (this.showEligibleOnly && !c.has_eligible_drives) return false;
            if (this.companySearch) {
                const q = this.companySearch.toLowerCase();
                const nameMatch = c.name && c.name.toLowerCase().includes(q);
                const industryMatch = c.industry && c.industry.toLowerCase().includes(q);
                return nameMatch || industryMatch;
            }
            return true;
        });
    },
    selectedApplications() {
        return this.myApps.filter(app => app.status === 'Selected');
    }
  },
  async created() {
    this.token = localStorage.getItem('token')
    await this.loadDashboardData()
    await this.loadProfile() // For name
    await this.fetchNotifications()
    // Poll for notifications
    this.notifInterval = setInterval(this.fetchNotifications, 15000)
  },
  beforeUnmount() {
      if (this.notifInterval) clearInterval(this.notifInterval)
  },
  methods: {
    async loadDashboardData() {
      const config = { headers: { 'Authentication-Token': this.token } }
      try {
        const compRes = await axios.get('http://localhost:5001/api/student/companies', config)
        this.companies = compRes.data
        
        const appsRes = await axios.get('http://localhost:5001/api/student/my-applications', config)
        this.myApps = appsRes.data
      } catch (e) {
        console.error(e)
      }
    },
    async viewCompany(companyId) {
        const config = { headers: { 'Authentication-Token': this.token } }
        try {
            const res = await axios.get(`http://localhost:5001/api/student/companies/${companyId}`, config)
            this.selectedCompany = res.data
            this.view = 'company_details'
        } catch (e) {
            console.error(e)
            alert('Failed to load company details')
        }
    },
    viewDrive(drive) {
        this.selectedDrive = drive
        this.view = 'drive_details'
    },
    async loadProfile() {
        const config = { headers: { 'Authentication-Token': this.token } }
        try {
            const res = await axios.get('http://localhost:5001/api/student/profile', config)
            this.profile = res.data
            this.studentName = this.profile.name || 'Student'
        } catch (e) {
            console.error(e)
        }
    },
    async updateProfile() {
        const config = { headers: { 'Authentication-Token': this.token } }
        try {
            await axios.post('http://localhost:5001/api/student/profile', this.profile, config)
            this.studentName = this.profile.name
            alert('Profile updated successfully')
            this.view = 'dashboard'
            await this.loadDashboardData() // Refresh real-time eligibility
        } catch (e) {
            alert('Failed to update profile')
        }
    },
    async apply(driveId) {
      if (!confirm('Are you sure you want to apply for this drive?')) return;
      try {
        await axios.post(`http://localhost:5001/api/student/apply/${driveId}`, {}, {
           headers: { 'Authentication-Token': this.token }
        })
        alert('Applied successfully!')
        this.view = 'dashboard'
        await this.loadDashboardData()
      } catch (e) {
        alert(e.response?.data?.message || 'Failed to apply')
      }
    },
    async exportCSV() {
        this.exportLoading = true
        this.csvReady = false
        try {
            await axios.post('http://localhost:5001/api/student/export/csv', {}, {
                headers: { 'Authentication-Token': this.token }
            })
            // Optimistically add a "Started" notification
            this.notifications.unshift({
                id: Date.now(),
                job_name: 'CSV Export started',
                message: 'We are processing your placement history... Check your MailHog inbox for the completion alert!',
                timestamp: new Date().toISOString()
            })
            // Poll every 2s for up to 30s until the file is ready
            let attempts = 0
            const poll = setInterval(async () => {
                attempts++
                try {
                    const check = await axios.get('http://localhost:5001/api/student/export/download', {
                        headers: { 'Authentication-Token': this.token },
                        responseType: 'blob'
                    })
                    if (check.status === 200) {
                        clearInterval(poll)
                        this.csvReady = true
                        this.exportLoading = false
                        this.notifications.unshift({
                            id: Date.now(),
                            job_name: 'Export CSV',
                            message: '✅ Your CSV export is ready! Click "Download CSV" to save it.',
                            timestamp: new Date().toISOString()
                        })
                    }
                } catch (e) {
                    if (attempts >= 15) {
                        clearInterval(poll)
                        this.exportLoading = false
                    }
                }
            }, 2000)
        } catch (e) {
            this.exportLoading = false
            alert('Failed to start export')
        }
    },
    async downloadCSV() {
        try {
            const res = await axios.get('http://localhost:5001/api/student/export/download', {
                headers: { 'Authentication-Token': this.token },
                responseType: 'blob'
            })
            // Extract filename from Content-Disposition header or use default
            const disposition = res.headers['content-disposition'] || ''
            let filename = 'placement_history.csv'
            const match = disposition.match(/filename=([^;]+)/)
            if (match) filename = match[1].trim()
            // Create a download link and click it
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (e) {
            alert('No CSV found. Please trigger an export first.')
        }
    },
    async fetchNotifications() {
        const config = { headers: { 'Authentication-Token': this.token } }
        try {
            // Reusing the same backend endpoint but filtered for the user's specific logs could be better
            // For the demo, we will just fetch the logs and students can see their own export logs
            const res = await axios.get('http://localhost:5001/api/admin/jobs/logs', config) // For demo, student can see these too or I should add a specific route
            this.notifications = res.data.filter(log => log.job_name === 'Export CSV' && log.message.includes(this.studentName))
        } catch (e) {
            console.error('Failed to fetch notifications')
        }
    },
    logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        this.$router.push('/login')
    },
    statusBadgeClass(status) {
        if (status === 'Selected') return 'bg-success';
        if (status === 'Rejected') return 'bg-danger';
        return 'bg-secondary';
    },
    formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return d.toLocaleString('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }
  }
}
</script>
