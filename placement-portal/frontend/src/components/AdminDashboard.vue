<template>
  <div class="container pb-5">
    <div class="d-flex justify-content-between align-items-md-center flex-column flex-md-row gap-3 mb-4">
      <div>
        <h2 class="mb-1">Admin Dashboard</h2>
        <p class="text-muted">Overview of the system</p>
      </div>
      <div class="d-flex align-items-center gap-3">
        <div class="search-wrapper position-relative">
          <input 
            v-model="searchQuery" 
            @input="handleSearch" 
            type="text" 
            class="form-control" 
            placeholder="Search here..."
            style="min-width: 300px;"
          >
          <div v-if="searchResults.length > 0" class="search-results-dropdown card shadow-lg p-2">
            <div v-for="res in searchResults" :key="res.type + res.id" class="search-result-item p-2 rounded cursor-pointer" @click="selectSearchResult(res)">
                <div class="d-flex justify-content-between">
                    <span class="fw-bold">{{ res.name }}</span>
                    <span class="badge border text-uppercase" :class="res.type === 'Company' ? 'text-primary' : 'text-info'">{{ res.type }}</span>
                </div>
            </div>
          </div>
        </div>
        <div class="dropdown">
            <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                System Tasks
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                <li><a class="dropdown-item py-2" href="#" @click.prevent="triggerReminders"><i class="fas fa-bell me-2 text-warning"></i> Run Daily Reminders</a></li>
                <li><a class="dropdown-item py-2" href="#" @click.prevent="generateReport"><i class="fas fa-file-alt me-2 text-primary"></i> Run Monthly Report</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item py-2 text-danger" href="#" @click.prevent="fetchJobLogs"><i class="fas fa-sync-alt me-2"></i> Refresh Logs</a></li>
            </ul>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="row g-4 mb-5">
      <div class="col-md-3">
        <div class="card shadow-sm p-4 text-center">
          <div class="h2 fw-bold mb-0">{{ stats.total_students || 0 }}</div>
          <div class="text-muted small text-uppercase fw-bold">Total Students</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card shadow-sm p-4 text-center">
          <div class="h2 fw-bold mb-0 text-success">{{ stats.placed_students || 0 }}</div>
          <div class="text-muted small text-uppercase fw-bold">Placed Students</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card shadow-sm p-4 text-center">
          <div class="h2 fw-bold mb-0 text-warning">{{ stats.companies || 0 }}</div>
          <div class="text-muted small text-uppercase fw-bold">Total Companies</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card shadow-sm p-4 text-center">
          <div class="h2 fw-bold mb-0 text-info">{{ stats.active_drives || 0 }}</div>
          <div class="text-muted small text-uppercase fw-bold">Active Drives</div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-5">
      <!-- Simple Stats Summary (Replacing Chart) -->
      <div class="col-12 col-xl-8">
        <div class="card shadow-sm p-4 h-100">
          <h4 class="mb-4">Placement Summary</h4>
          <div class="mb-4">
              <label class="d-flex justify-content-between mb-2">
                  <span>Placement Rate</span>
                  <span>{{ stats.total_students ? Math.round((stats.placed_students / stats.total_students) * 100) : 0 }}%</span>
              </label>
              <div class="progress" style="height: 10px;">
                  <div class="progress-bar bg-success" role="progressbar" :style="{ width: (stats.total_students ? (stats.placed_students / stats.total_students) * 100 : 0) + '%' }"></div>
              </div>
          </div>
          <div class="row g-3">
              <div class="col-6">
                  <div class="p-3 border rounded bg-light text-center">
                      <div class="text-muted small">Active Drives</div>
                      <div class="h4 mb-0">{{ stats.active_drives || 0 }}</div>
                  </div>
              </div>
              <div class="col-6">
                   <div class="p-3 border rounded bg-light text-center">
                      <div class="text-muted small">Total Companies</div>
                      <div class="h4 mb-0">{{ stats.companies || 0 }}</div>
                  </div>
              </div>
          </div>
        </div>
      </div>
      
      <!-- Pending Companies Column -->
      <div class="col-12 col-xl-4">
        <div class="card shadow-sm p-4 h-100">
            <h4 class="mb-4">New Company Requests</h4>
            <div class="d-flex flex-column gap-3">
                <div v-for="company in pendingCompanies" :key="company.id" class="card h-100 shadow-sm p-3 p-3 border-0 bg-white bg-opacity-50">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center gap-3">
                            <div>
                                <div class="fw-bold fs-5 text-main">{{ company.name }}</div>
                                <div class="text-muted small">ID: {{ company.id }}</div>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <button @click="approveCompany(company.id)" class="btn btn-sm btn-success rounded-pill px-3">Approve</button>
                            <button @click="rejectCompany(company.id)" class="btn btn-sm btn-outline-danger rounded-pill px-3">Reject</button>
                        </div>
                    </div>
                </div>
                <div v-if="pendingCompanies.length === 0" class="text-center py-5">
                    <i class="fas fa-check-double text-success mb-2"></i>
                    <p class="text-muted small">All requests processed</p>
                </div>
            </div>
        </div>
      </div>
    </div>

    <!-- System Job Logs Section -->
    <div class="row g-4 mb-5">
        <div class="col-12">
            <div class="card shadow-sm p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="mb-0">Background Job Activity Log</h4>
                    <span class="badge bg-light text-dark border">Recent 15 jobs</span>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead>
                            <tr class="text-muted fs-7 text-uppercase">
                                <th>Timestamp</th>
                                <th>Job Name</th>
                                <th>Status</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="log in jobLogs" :key="log.id">
                                <td class="text-nowrap fs-7 text-muted">{{ formatDate(log.timestamp) }}</td>
                                <td class="fw-bold text-main">{{ log.job_name }}</td>
                                <td>
                                    <span :class="['badge rounded-pill px-3', log.status === 'Success' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger']">
                                        {{ log.status }}
                                    </span>
                                </td>
                                <td class="fs-7 text-muted">{{ log.message }}</td>
                            </tr>
                            <tr v-if="jobLogs.length === 0">
                                <td colspan="4" class="text-center py-4 text-muted small">No recent job activity found.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Management Sections -->
    <div class="row g-4  ">
        <!-- Companies Management -->
        <div class="col-12 col-lg-6">
            <div class="card shadow-sm p-4">
                <h4 class="mb-4">Company Management</h4>
                <div class="table-responsive">
                    <table class="table table-borderless align-middle">
                        <thead>
                            <tr class="text-muted fs-7 text-uppercase">
                                <th>Name</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th class="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="company in companies" :key="company.id" class="border-top border-white border-opacity-25">
                                <td>
                                    <div class="fw-medium">{{ company.name }}</div>
                                    <div class="text-muted fs-7">{{ company.email }}</div>
                                </td>
                                <td>
                                    <span class="badge bg-light text-dark border fs-8 text-uppercase">{{ company.industry || 'General' }}</span>
                                </td>
                                <td>
                                    <span :class="['badge rounded-pill', company.status === 'Approved' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-dark']">
                                        {{ company.status }}
                                    </span>
                                </td>
                                <td class="text-end">
                                    <button v-if="company.active" @click="toggleBlockUser(company.user_id, 'block')" class="btn btn-sm btn-outline-danger border-0">
                                        <i class="fas fa-ban"></i>
                                    </button>
                                    <button v-else @click="toggleBlockUser(company.user_id, 'unblock')" class="btn btn-sm btn-outline-secondary border-0">
                                        <i class="fas fa-undo"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Student Management -->
        <div class="col-12 col-lg-6">
            <div class="card shadow-sm p-4 h-100">
                <h4 class="mb-4">Student Management</h4>
                <div class="table-responsive">
                    <table class="table table-borderless align-middle">
                        <thead>
                            <tr class="text-muted fs-7 text-uppercase">
                                <th>Name</th>
                                <th>Dept</th>
                                <th class="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="student in students" :key="student.id" class="border-top border-white border-opacity-25">
                                <td>
                                    <div class="fw-medium">{{ student.name }}</div>
                                    <div class="text-muted fs-7">{{ student.email }}</div>
                                </td>
                                <td><span class="fs-7">{{ student.department }}</span></td>
                                <td class="text-end">
                                     <button v-if="student.active" @click="toggleBlockUser(student.user_id, 'block')" class="btn btn-sm btn-outline-danger border-0">
                                        <i class="fas fa-ban"></i>
                                     </button>
                                     <button v-else @click="toggleBlockUser(student.user_id, 'unblock')" class="btn btn-sm btn-outline-secondary border-0">
                                        <i class="fas fa-undo"></i>
                                     </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- [NEW] Drive and Application Management -->
    <div class="row g-4 mt-2">
        <!-- Placement Drives -->
        <div class="col-12 col-lg-7">
            <div class="card shadow-sm p-4 h-100">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="mb-0">Placement Drive Management</h4>
                    <button @click="fetchData" class="btn btn-sm btn-light border"><i class="fas fa-sync-alt"></i></button>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead>
                            <tr class="text-muted fs-7 text-uppercase border-0">
                                <th>Drive Title</th>
                                <th>Company</th>
                                <th>Status</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="drive in drives" :key="drive.id">
                                <td>
                                    <div class="fw-bold text-main">{{ drive.title }}</div>
                                    <div class="fs-8 text-muted">Created: {{ formatDate(drive.date_created) }}</div>
                                </td>
                                <td><span class="badge border bg-light text-dark">{{ drive.company }}</span></td>
                                <td>
                                    <span :class="['badge rounded-pill px-3', 
                                        drive.status === 'Open' ? 'bg-success bg-opacity-10 text-success' : 
                                        drive.status === 'Pending' ? 'bg-warning bg-opacity-10 text-dark' : 
                                        'bg-secondary bg-opacity-10 text-secondary']">
                                        {{ drive.status }}
                                    </span>
                                </td>
                                <td class="text-end">
                                    <div class="btn-group btn-group-sm">
                                        <button v-if="drive.status === 'Pending'" @click="updateDriveStatus(drive.id, 'Open')" class="btn btn-success rounded-start-pill px-3">Approve</button>
                                        <button v-if="drive.status === 'Open'" @click="updateDriveStatus(drive.id, 'Closed')" class="btn btn-outline-danger rounded-pill px-3">Close Drive</button>
                                        <button v-if="drive.status === 'Closed'" @click="updateDriveStatus(drive.id, 'Open')" class="btn btn-outline-primary rounded-pill px-3">Reopen</button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="drives.length === 0">
                                <td colspan="4" class="text-center py-4 text-muted small">No placement drives found in the system.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- All Applications -->
        <div class="col-12 col-lg-5">
            <div class="card shadow-sm p-4 h-100">
                <h4 class="mb-4">System Applications</h4>
                <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                    <table class="table table-sm table-hover align-middle">
                        <thead>
                            <tr class="text-muted fs-8 text-uppercase">
                                <th>Student</th>
                                <th>Drive</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="app in applications" :key="app.id">
                                <td>
                                    <div class="fw-medium fs-7">{{ app.student }}</div>
                                    <div class="fs-8 text-muted">@ {{ app.company }}</div>
                                </td>
                                <td class="fs-7">{{ app.drive }}</td>
                                <td>
                                    <span :class="['badge fs-8', 
                                        app.status === 'Selected' ? 'text-success' : 
                                        app.status === 'Rejected' ? 'text-danger' : 
                                        'text-primary']">
                                        {{ app.status }}
                                    </span>
                                </td>
                            </tr>
                            <tr v-if="applications.length === 0">
                                <td colspan="3" class="text-center py-4 text-muted small">No student applications recorded.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
// Admin dashboard for managing the whole system
import axios from 'axios'

export default {
  data() {
    return {
      // Stats for the top cards
      stats: {}, 
      companies: [],
      students: [],
      drives: [],
      applications: [],
      loading: true,
      reportLoading: false,
      chartInstance: null,
      searchQuery: '',
      searchResults: [],
      jobLogs: []
    }
  },
  computed: {
      pendingCompanies() {
          return this.companies.filter(c => c.status === 'Pending');
      }
  },
  async created() {
    await this.fetchData()
    await this.fetchJobLogs()
    // Poll for logs every 10 seconds for demo
    this.logInterval = setInterval(this.fetchJobLogs, 10000)
  },
  beforeUnmount() {
      if (this.logInterval) clearInterval(this.logInterval)
  },
  methods: {
    async fetchData() {
      const token = localStorage.getItem('token')
      const config = { headers: { 'Authentication-Token': token } }
      try {
        const statsRes = await axios.get('http://localhost:5001/api/admin/stats', config)
        this.stats = statsRes.data
        
        const companiesRes = await axios.get('http://localhost:5001/api/admin/companies', config)
        this.companies = companiesRes.data

        const studentsRes = await axios.get('http://localhost:5001/api/admin/students', config)
        this.students = studentsRes.data

        const drivesRes = await axios.get('http://localhost:5001/api/admin/drives', config)
        this.drives = drivesRes.data

        const appsRes = await axios.get('http://localhost:5001/api/admin/applications', config)
        this.applications = appsRes.data
        
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async approveCompany(companyId) {
        if (!companyId) return;
        const token = localStorage.getItem('token')
        const config = { headers: { 'Authentication-Token': token } }
        try {
            await axios.post(`http://localhost:5001/api/admin/company/approve/${companyId}`, {}, config)
            this.fetchData(); // Refresh to update lists
        } catch (e) {
            alert('Failed to approve company')
        }
    },
    async toggleBlockUser(userId, action) {
        // action: 'block' or 'unblock'
        if (!userId) return;
        const token = localStorage.getItem('token')
        const config = { headers: { 'Authentication-Token': token } }
        try {
            await axios.post(`http://localhost:5001/api/admin/users/${userId}/${action}`, {}, config)
            this.fetchData(); // Refresh
        } catch (e) {
            alert(`Failed to ${action} user`)
        }
    },
    async updateDriveStatus(driveId, status) {
        if (!driveId) return;
        const token = localStorage.getItem('token')
        const config = { headers: { 'Authentication-Token': token } }
        try {
            await axios.post(`http://localhost:5001/api/admin/drives/${driveId}/status`, { status }, config)
            this.fetchData();
        } catch (e) {
            alert('Failed to update drive status')
        }
    },
    async generateReport() {
        this.reportLoading = true;
        const token = localStorage.getItem('token')
        const config = { headers: { 'Authentication-Token': token } }
        try {
            await axios.post('http://localhost:5001/api/admin/reports/generate', {}, config)
            alert('Monthly report task triggered!')
            await this.fetchJobLogs()
        } catch (e) {
            alert('Failed to trigger report')
        } finally {
            this.reportLoading = false;
        }
    },
    async triggerReminders() {
        const token = localStorage.getItem('token')
        const config = { headers: { 'Authentication-Token': token } }
        try {
            await axios.post('http://localhost:5001/api/admin/reminders/trigger', {}, config)
            alert('Daily reminders task triggered!')
            await this.fetchJobLogs()
        } catch (e) {
            alert('Failed to trigger reminders')
        }
    },
    async fetchJobLogs() {
        const token = localStorage.getItem('token')
        const config = { headers: { 'Authentication-Token': token } }
        try {
            const res = await axios.get('http://localhost:5001/api/admin/jobs/logs', config)
            this.jobLogs = res.data
        } catch (e) {
            console.error('Failed to fetch job logs')
        }
    },
    formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleString();
    },
    async handleSearch() {
        if (this.searchQuery.length < 2) {
            this.searchResults = [];
            return;
        }
        const token = localStorage.getItem('token')
        const config = { headers: { 'Authentication-Token': token } }
        try {
            const res = await axios.get(`http://localhost:5001/api/admin/search?q=${this.searchQuery}`, config)
            this.searchResults = res.data.results
        } catch (e) {
            console.error(e)
        }
    },
    selectSearchResult(res) {
        this.searchQuery = res.name;
        this.searchResults = [];
        // Optional: scroll to item or filter list
    },
    async rejectCompany(companyId) {
        if (!confirm('Are you sure you want to reject this company?')) return;
        const token = localStorage.getItem('token')
        const config = { headers: { 'Authentication-Token': token } }
        try {
            await axios.post(`http://localhost:5001/api/admin/company/status/${companyId}`, { status: 'Rejected' }, config)
            this.fetchData();
        } catch (e) {
            alert('Failed to reject company')
        }
    }
  }
}
</script>

<style scoped>
.avatar-circle-sm {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.8rem;
}

.fs-7 { font-size: 0.85rem; }
.fs-8 { font-size: 0.7rem; }

.search-results-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    margin-top: 0.5rem;
    max-height: 300px;
    overflow-y: auto;
}

.search-result-item:hover {
    background: rgba(var(--primary-rgb), 0.05);
}

.cursor-pointer { cursor: pointer; }
</style>
