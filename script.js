// Sample Jobs Data
        const jobsData = [
            {
                id: 1,
                title: "Senior Software Developer",
                location: "London, UK",
                salary_min: 70000,
                salary_max: 95000,
                description: "We're looking for an experienced software developer to join our growing team. You'll work on cutting-edge projects using modern technologies.",
                requirements: ["JavaScript", "React", "Node.js", "MongoDB"]
            },
            {
                id: 2,
                title: "Marketing Manager",
                location: "Manchester, UK",
                salary_min: 55000,
                salary_max: 75000,
                description: "Lead our marketing initiatives and drive growth. Manage campaigns, budget, and a team of creative professionals.",
                requirements: ["Digital Marketing", "Leadership", "Analytics", "Campaign Management"]
            },
            {
                id: 3,
                title: "UX/UI Designer",
                location: "Bristol, UK",
                salary_min: 50000,
                salary_max: 70000,
                description: "Create amazing user experiences for our clients. You'll design interfaces for web and mobile applications.",
                requirements: ["Figma", "User Research", "Prototyping", "Wireframing"]
            },
            {
                id: 4,
                title: "Data Analyst",
                location: "Birmingham, UK",
                salary_min: 45000,
                salary_max: 65000,
                description: "Analyze data to provide insights that drive business decisions. Work with SQL, Python, and BI tools.",
                requirements: ["SQL", "Python", "Tableau", "Excel"]
            },
            {
                id: 5,
                title: "DevOps Engineer",
                location: "Edinburgh, UK",
                salary_min: 65000,
                salary_max: 85000,
                description: "Build and maintain our infrastructure. Manage cloud services, CI/CD pipelines, and monitoring systems.",
                requirements: ["AWS", "Docker", "Kubernetes", "Jenkins"]
            },
            {
                id: 6,
                title: "Project Manager",
                location: "Leeds, UK",
                salary_min: 50000,
                salary_max: 70000,
                description: "Lead projects from conception to completion. Manage budgets, timelines, and stakeholder expectations.",
                requirements: ["Agile", "Leadership", "Planning", "Risk Management"]
            }
        ];

        let currentJobId = null;
        let applications = [];

        // Load jobs on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadJobs();
            loadApplicationsFromStorage();
        });

        function loadJobs() {
            const container = document.getElementById('jobsContainer');
            const loading = document.querySelector('.loading');
            
            loading.style.display = 'block';
            
            // Simulate API delay
            setTimeout(() => {
                loading.style.display = 'none';
                container.innerHTML = '';
                
                jobsData.forEach(job => {
                    const jobCard = createJobCard(job);
                    container.appendChild(jobCard);
                });
            }, 500);
        }

        function createJobCard(job) {
            const card = document.createElement('div');
            card.className = 'job-card';
            
            const requirementsHTML = job.requirements
                .map(req => `<span class="requirement-tag">${req}</span>`)
                .join('');
            
            card.innerHTML = `
                <h3>${job.title}</h3>
                <div class="job-meta">📍 ${job.location}</div>
                <div class="job-salary">£${job.salary_min.toLocaleString()} - £${job.salary_max.toLocaleString()}</div>
                <div class="job-description">${job.description}</div>
                <div class="job-requirements">${requirementsHTML}</div>
                <button class="apply-btn" onclick="openApplicationModal(${job.id}, '${job.title}')">Apply Now</button>
            `;
            
            return card;
        }

        function searchJobs() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const container = document.getElementById('jobsContainer');
            
            if (!searchTerm) {
                loadJobs();
                return;
            }
            
            const filtered = jobsData.filter(job =>
                job.title.toLowerCase().includes(searchTerm) ||
                job.location.toLowerCase().includes(searchTerm) ||
                job.requirements.some(req => req.toLowerCase().includes(searchTerm))
            );
            
            container.innerHTML = '';
            
            if (filtered.length === 0) {
                container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 2rem;">No jobs found matching your search.</p>';
                return;
            }
            
            filtered.forEach(job => {
                container.appendChild(createJobCard(job));
            });
        }

        function openApplicationModal(jobId, jobTitle) {
            currentJobId = jobId;
            document.getElementById('jobTitle').textContent = jobTitle;
            document.getElementById('applicationModal').style.display = 'block';
            document.getElementById('applicationForm').reset();
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('errorMessage').style.display = 'none';
        }

        function closeApplicationModal() {
            document.getElementById('applicationModal').style.display = 'none';
            currentJobId = null;
        }

        function submitApplication(event) {
            event.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            // Get form data
            const application = {
                id: Date.now(),
                jobId: currentJobId,
                jobTitle: document.getElementById('jobTitle').textContent,
                candidateName: document.getElementById('candidateName').value,
                candidateEmail: document.getElementById('candidateEmail').value,
                candidatePhone: document.getElementById('candidatePhone').value,
                resumeFile: document.getElementById('resumeFile').files[0]?.name || 'resume.pdf',
                coverLetter: document.getElementById('coverLetter').value,
                submittedAt: new Date().toLocaleString(),
                status: 'pending'
            };
            
            // Simulate submission delay
            setTimeout(() => {
                // Save to local storage
                applications.push(application);
                localStorage.setItem('applications', JSON.stringify(applications));
                
                // Send to console for verification
                console.log('Application submitted:', application);
                
                // Show success message
                document.getElementById('successMessage').style.display = 'block';
                document.getElementById('applicationForm').reset();
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Application';
                
                // Close modal after 2 seconds
                setTimeout(() => {
                    closeApplicationModal();
                }, 2000);
            }, 1000);
        }

        function handleContactForm(event) {
            event.preventDefault();
            
            const contactData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                message: document.getElementById('contactMessage').value,
                submittedAt: new Date().toLocaleString()
            };
            
            console.log('Contact form submitted:', contactData);
            
            // Show success message
            document.getElementById('contactSuccess').style.display = 'block';
            document.getElementById('contactForm').reset();
            
            // Hide after 3 seconds
            setTimeout(() => {
                document.getElementById('contactSuccess').style.display = 'none';
            }, 3000);
        }

        function loadApplicationsFromStorage() {
            const stored = localStorage.getItem('applications');
            if (stored) {
                applications = JSON.parse(stored);
                console.log(`Loaded ${applications.length} applications from storage`);
            }
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('applicationModal');
            if (event.target == modal) {
                closeApplicationModal();
            }
        }

        // Search functionality
        document.getElementById('searchInput').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchJobs();
            }
        });
