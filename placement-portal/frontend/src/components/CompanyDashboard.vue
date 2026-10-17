<template>
  <div class="container pb-5">
    <!-- Header section with company name and status -->
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <h1 class="display-5 mb-1">Company Dashboard</h1>
        <p class="text-muted">Welcome, <span class="fw-bold text-primary">{{ companyName }}</span></p>
        
        <!-- Show warning if admin hasn't approved the company yet -->
        <div v-if="companyStatus === 'Pending'" class="badge bg-warning text-dark px-3 py-2 mt-1">
             <i class="fas fa-clock me-1"></i> Waiting for Admin Approval
        </div>
      </div>
      
      <!-- Button to open create drive modal -->
      <button v-if="companyStatus === 'Approved'" class="btn btn-primary" @click="openCreateModal">
          <i class="fas fa-plus-circle me-2"></i> Create New Drive
      </button>
      <div v-else class="text-muted small">
          <i class="fas fa-info-circle me-1"></i> Only approved companies can create drives
      </div>
    </div>

    <!-- Quick stats overview -->
    <div class="row g-4 mb-5">
        <div class="col-md-4 text-center p-3 border rounded shadow-sm">
            <div class="h2 fw-bold mb-0">{{ upcomingDrives.length }}</div>
            <div class="text-muted small text-uppercase">Active Drives</div>
        </div>
        <div class="col-md-4 text-center p-3 border rounded shadow-sm">
            <div class="h2 fw-bold mb-0 text-success">{{ applications.length }}</div>
            <div class="text-muted small text-uppercase">Total Applications</div>
        </div>
        <div class="col-md-4 text-center p-3 border rounded shadow-sm">
            <div class="h2 fw-bold mb-0 text-secondary">{{ closedDrives.length }}</div>
            <div class="text-muted small text-uppercase">Closed Drives</div>
        </div>
    </div>

    <!-- Table showing all active recruitment drives -->
    <div class="p-4 border rounded shadow-sm mb-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Active Recruitment Drives</h4>
        </div>
        <div class="table-responsive">
            <table class="table table-hover align-middle">
                <thead>
                    <tr>
                        <th>Drive Details</th>
                        <th>Deadline</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="drive in upcomingDrives" :key="drive.id">
                        <td>
                            <div class="fw-bold">{{ drive.title }}</div>
                            <small class="text-muted">Package: {{ drive.package || 'Not disclosed' }}</small>
                        </td>
                        <td>
                            <span>{{ formatDate(drive.deadline) }}</span>
                        </td>
                        <td class="text-end text-nowrap">
                            <button @click="viewApplications(drive.id, drive.title)" class="btn btn-sm btn-outline-primary me-2" title="View Applications">
                                <i class="fas fa-users-viewfinder"></i>
                            </button>
                            <button @click="openEditModal(drive.id)" class="btn btn-sm btn-outline-secondary me-2" title="Edit Drive">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button @click="markAsComplete(drive.id)" class="btn btn-sm btn-outline-danger" title="Close Drive">
                                <i class="fas fa-times-circle"></i>
                            </button>
                        </td>
                    </tr>
                    <tr v-if="upcomingDrives.length === 0">
                        <td colspan="3" class="text-center py-5 text-muted">No active drives found</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Section to review applications for a selected drive -->
    <div v-if="selectedDriveId" class="p-4 border rounded shadow-sm mb-5" id="applications-section">
        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
             <div>
                <h4 class="mb-1">Review Applications</h4>
                <p class="mb-0 text-muted">Viewing for: <b>{{ selectedDriveTitle }}</b></p>
             </div>
             <button class="btn btn-sm btn-close" @click="selectedDriveId = null"></button>
        </div>

        <div class="row">
            <!-- List of applicants -->
            <div class="col-md-5">
                <div class="list-group">
                    <button v-for="app in applications" :key="app.id" 
                         @click="reviewApplication(app)"
                         :class="['list-group-item list-group-item-action', selectedApp?.id === app.id ? 'active' : '']">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <div class="fw-bold">{{ app.student_name }}</div>
                                <small>CGPA: {{ app.cgpa }}</small>
                            </div>
                            <span class="badge bg-light text-dark">{{ app.status }}</span>
                        </div>
                    </button>
                </div>
                <div v-if="applications.length === 0" class="alert alert-info mt-3">No applications yet.</div>
            </div>
            
            <!-- Details of selected applicant -->
            <div class="col-md-7">
                 <div v-if="selectedApp" class="p-3 border rounded shadow-sm bg-light">
                     <h4>{{ selectedApp.student_name }}</h4>
                     <p>Academic Record: <b>{{ selectedApp.cgpa }} CGPA</b></p>
                     
                     <div class="mb-4">
                         <a :href="selectedApp.resume" target="_blank" class="btn btn-sm btn-primary" v-if="selectedApp.resume">
                              View Resume
                         </a>
                         <span class="text-muted" v-else>No resume uploaded</span>
                     </div>

                     <div class="border-top pt-3">
                         <label class="form-label fw-bold">Update Status:</label>
                         <div class="d-flex gap-2">
                             <button @click="updateStatus(selectedApp.id, 'Selected')" class="btn btn-success flex-grow-1">Select</button>
                             <button @click="updateStatus(selectedApp.id, 'Waitlist')" class="btn btn-warning flex-grow-1">Waitlist</button>
                             <button @click="updateStatus(selectedApp.id, 'Rejected')" class="btn btn-danger flex-grow-1">Reject</button>
                         </div>
                     </div>
                 </div>
                 <div v-else class="text-center p-5 text-muted border border-dashed rounded">
                     <p>Click on an applicant to see their details</p>
                 </div>
            </div>
        </div>
    </div>

    <!-- Closed drives for reference -->
    <div class="p-4 border rounded shadow-sm mt-5">
        <h4 class="mb-4 text-muted">Closed Drives</h4>
        <div class="table-responsive">
            <table class="table table-sm align-middle text-muted">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Closed On</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                     <tr v-for="drive in closedDrives" :key="drive.id">
                        <td>{{ drive.title }}</td>
                        <td>{{ formatDate(drive.deadline) }}</td>
                        <td class="text-end">
                             <button @click="reopenDrive(drive.id)" class="btn btn-sm btn-link">Re-open</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Simple modal for creating a new drive -->
    <div v-if="showCreateModal" class="my-modal-overlay">
        <div class="my-modal-content p-4 bg-white rounded shadow-lg">
             <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="mb-0">{{ isEditMode ? 'Edit Job Drive' : 'Create New Job Drive' }}</h4>
                <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <form @submit.prevent="submitDrive">
              <div class="mb-3">
                <label class="form-label">Job Title</label>
                <input v-model="newDrive.title" class="form-control" required placeholder="Software Intern">
              </div>
              
              <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Minimum CGPA</label>
                    <input v-model="newDrive.criteria_cgpa" type="number" step="0.1" class="form-control">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Degree Required</label>
                    <select v-model="newDrive.criteria_degree" class="form-select">
                        <option value="">Any</option>
                        <option v-for="deg in degreeOptions" :key="deg" :value="deg">{{ deg }}</option>
                    </select>
                  </div>
              </div>

              <div class="mb-3">
                  <label class="form-label">Branches Eligible</label>
                  <div class="row px-2">
                       <div v-for="dept in departmentOptions" :key="dept" class="col-6">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" :value="dept" :id="'d-'+dept" v-model="selectedDepts">
                                <label class="form-check-label" :for="'d-'+dept">{{ dept }}</label>
                            </div>
                       </div>
                  </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Job Description</label>
                <textarea v-model="newDrive.description" class="form-control" rows="2" required></textarea>
              </div>
              
              <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label">Salary Package</label>
                    <input v-model="newDrive.package" class="form-control" placeholder="10 LPA">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Deadline Date</label>
                    <input v-model="newDrive.deadline" type="date" class="form-control" required>
                  </div>
              </div>
              
              <div class="d-grid mt-4">
                  <button type="submit" class="btn btn-success py-2 shadow-sm">
                      <span v-if="isEditMode">Save Changes</span>
                      <span v-else>Save and Put it Online</span>
                  </button>
              </div>
            </form>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      companyName: 'Loading...',
      drives: [],
      applications: [],
      selectedDriveId: null,
      selectedDriveTitle: '',
      selectedApp: null,
      showCreateModal: false,
      newDrive: {
        title: '',
        description: '',
        requirements: '',
        criteria_cgpa: 0,
        criteria_branch: '',
        criteria_degree: '',
        criteria_year: null,
        package: '',
        deadline: ''
      },
      selectedDepts: [],
      degreeOptions: ['B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'BCA', 'MCA', 'MBA'],
      departmentOptions: ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Electrical', 'Civil'],
      yearOptions: [2024, 2025, 2026, 2027],
      token: '',
      companyStatus: 'Pending',
      isEditMode: false,
      editingDriveId: null
    }
  },
  computed: {
      // Split drives into active and closed for better display
      upcomingDrives() {
          return this.drives.filter(d => d.status !== 'Closed');
      },
      closedDrives() {
          return this.drives.filter(d => d.status === 'Closed');
      }
  },
  async created() {
    this.token = localStorage.getItem('token')
    await this.fetchProfile()
    await this.fetchDrives()
  },
  methods: {
    // Get company profile details from API
    async fetchProfile() {
       try {
           const res = await axios.get('http://localhost:5001/api/auth/profile', {
             headers: { 'Authentication-Token': this.token }
           })
           this.companyName = res.data.name
           this.companyStatus = res.data.status
       } catch (e) {
           console.error('Failed to fetch profile:', e)
       }
    },
    // Load all drives created by this company
    async fetchDrives() {
      try {
        const res = await axios.get('http://localhost:5001/api/company/drives', {
          headers: { 'Authentication-Token': this.token }
        })
        this.drives = res.data
      } catch (e) {
        console.error('Failed to fetch drives:', e)
      }
    },
    // Method to handle both Create and Edit form submissions
    async submitDrive() {
      try {
        // Convert array of departments to a simple string
        this.newDrive.criteria_branch = this.selectedDepts.join(', ');
        const config = { headers: { 'Authentication-Token': this.token } };
        
        if (this.isEditMode) {
            await axios.put(`http://localhost:5001/api/company/drives/${this.editingDriveId}`, this.newDrive, config);
            alert('Job Drive has been updated!');
        } else {
            await axios.post('http://localhost:5001/api/company/drives', this.newDrive, config);
            alert('Job Drive has been created!');
        }
        
        this.closeModal();
        await this.fetchDrives();
      } catch (e) {
        alert(e.response?.data?.message || 'Something went wrong');
      }
    },
    // Open modal to create a new drive
    openCreateModal() {
        this.isEditMode = false;
        this.editingDriveId = null;
        this.newDrive = { title: '', description: '', requirements: '', criteria_cgpa: 0, criteria_branch: '', criteria_degree: '', criteria_year: null, package: '', deadline: '' };
        this.selectedDepts = [];
        this.showCreateModal = true;
    },
    // Open modal to edit an existing drive
    async openEditModal(driveId) {
        try {
            const res = await axios.get(`http://localhost:5001/api/company/drives/${driveId}`, {
                headers: { 'Authentication-Token': this.token }
            });
            this.isEditMode = true;
            this.editingDriveId = driveId;
            this.newDrive = res.data;
            // Parse branch string back to array for checkboxes
            this.selectedDepts = res.data.criteria_branch ? res.data.criteria_branch.split(', ').filter(d => d) : [];
            this.showCreateModal = true;
        } catch (e) {
            alert('Failed to load drive details');
        }
    },
    // Close and reset modal
    closeModal() {
        this.showCreateModal = false;
        this.isEditMode = false;
        this.editingDriveId = null;
        this.newDrive = { title: '', description: '', requirements: '', criteria_cgpa: 0, criteria_branch: '', criteria_degree: '', criteria_year: null, package: '', deadline: '' };
        this.selectedDepts = [];
    },
    // View students who applied for a drive
    async viewApplications(driveId, title) {
        this.selectedDriveId = driveId
        this.selectedDriveTitle = title
        this.selectedApp = null;
        try {
            const res = await axios.get(`http://localhost:5001/api/company/drive/${driveId}/applications`, {
                headers: { 'Authentication-Token': this.token }
            })
            this.applications = res.data
            // Scroll down so the user can see applications list
            setTimeout(() => {
                const el = document.getElementById('applications-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100)
        } catch (e) {
            console.error(e)
            alert('Could not load applications')
        }
    },
    // Select an application to review
    reviewApplication(app) {
        this.selectedApp = app;
    },
    // Accept or reject a student
    async updateStatus(appId, status) {
        try {
            await axios.post(`http://localhost:5001/api/company/application/${appId}/status`, { status }, {
                headers: { 'Authentication-Token': this.token }
            })
            // Update local state so it looks fast
            if (this.selectedApp) this.selectedApp.status = status;
            const app = this.applications.find(a => a.id === appId);
            if (app) app.status = status;
        } catch (e) {
            alert('Could not update status')
        }
    },
    // Close a drive when hiring is done
    async markAsComplete(driveId) {
        if(!confirm('Close this drive? Students wont be able to apply anymore.')) return;
        try {
            await axios.post(`http://localhost:5001/api/company/drives/${driveId}/status`, { status: 'Closed' }, {
                 headers: { 'Authentication-Token': this.token }
            });
            await this.fetchDrives();
        } catch (e) {
            alert('Failed to close drive');
        }
    },
    // Simple helper to reopen a closed drive
    async reopenDrive(driveId) {
        try {
            await axios.post(`http://localhost:5001/api/company/drives/${driveId}/status`, { status: 'Open' }, {
                 headers: { 'Authentication-Token': this.token }
            });
            await this.fetchDrives();
        } catch (e) {
            alert('Failed to reopen drive');
        }
    },
    // Helper for date formatting
    formatDate(dateStr) {
        if (!dateStr) return 'No Date';
        return new Date(dateStr).toLocaleDateString();
    }
  }
}
</script>

<style scoped>
/* Simple CSS for the modal popup */
.my-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
}
.my-modal-content {
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}
</style>
