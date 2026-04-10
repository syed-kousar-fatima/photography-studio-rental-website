document.addEventListener('DOMContentLoaded', () => {
    // ---- DOM Elements ----
    const hamburger = document.getElementById('hamburger');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const themeToggle = document.getElementById('theme-toggle');
    const profileBtn = document.getElementById('profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    const body = document.body;

    // ---- Sidebar Toggle Logic ----
    const toggleSidebar = () => {
        if (window.innerWidth > 900) {
            body.classList.toggle('sidebar-collapsed');
        } else {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }
    };

    const closeSidebarHandler = () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    };

    hamburger.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', closeSidebarHandler);
    overlay.addEventListener('click', closeSidebarHandler);

    // Close sidebar when clicking menu items on mobile
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                closeSidebarHandler();
            }
        });
    });

    // ---- Theme Toggle Logic ----
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    body.className = savedTheme;
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme', 'light-mode');
            updateThemeIcon('light-mode');
        } else {
            body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            updateThemeIcon('dark-mode');
        }
        // Update Chart colors if necessary
        updateCharts();
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark-mode') {
            icon.classList.replace('fa-sun', 'fa-moon');
        } else {
            icon.classList.add('fa-sun');
            icon.classList.remove('fa-moon');
        }
    }

    // ---- Profile Dropdown Logic ----
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target) && e.target !== profileBtn) {
            profileDropdown.classList.remove('active');
        }
    });

    // ---- Chart.js Implementation ----
    Chart.defaults.font.family = "'Outfit', sans-serif";
    Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();

    let usageChartInstance;
    let distributionChartInstance;

    function initCharts() {
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4af37';
        const secondaryTextColor = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();

        // 1. Monthly Usage Stats (Bar Chart)
        const ctxBar = document.getElementById('monthlyUsageChart').getContext('2d');
        usageChartInstance = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Studio Hours',
                    data: [120, 150, 140, 180, 210, 245],
                    backgroundColor: primaryColor,
                    borderRadius: 8,
                    maxBarThickness: 40
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: { color: secondaryTextColor }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: secondaryTextColor }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // 2. Booking Distribution (Pie Chart)
        const ctxPie = document.getElementById('bookingDistributionChart').getContext('2d');
        distributionChartInstance = new Chart(ctxPie, {
            type: 'doughnut',
            data: {
                labels: ['Studio A', 'Studio B', 'Studio C', 'Equipment'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [
                        '#d4af37', // Gold (Accent)
                        '#1496ff', // Bright Blue
                        '#ff6b6b', // Soft Red
                        '#2ecc71'  // Green
                    ],
                    borderWidth: 0,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: secondaryTextColor,
                            padding: 20,
                            usePointStyle: true,
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    }

    function updateCharts() {
        if (usageChartInstance) usageChartInstance.destroy();
        if (distributionChartInstance) distributionChartInstance.destroy();
        initCharts();
    }

    initCharts();

    // ---- Sidebar Hover Effect (Optional Desktop Refinement) ----
    const menuItems = document.querySelectorAll('.nav-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.classList.add('hovered');
            }
        });
        item.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
    });

    // ---- Page Switching Logic ----
    const pages = document.querySelectorAll('.dashboard-page');
    const pageTitle = document.querySelector('.page-title');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetPageId = link.getAttribute('data-page');
            if (!targetPageId) return;

            e.preventDefault();

            // 1. Update Active Nav Item
            menuItems.forEach(item => item.classList.remove('active'));
            link.parentElement.classList.add('active');

            // 2. Hide all pages and show target
            pages.forEach(page => page.classList.remove('active'));
            const targetPage = document.getElementById(`${targetPageId}-page`);
            if (targetPage) {
                targetPage.classList.add('active');
            }

            // 3. Update Header Title
            const linkText = link.querySelector('span').innerText;
            pageTitle.innerText = targetPageId === 'dashboard' ? 'Dashboard Overview' : linkText;

            // 4. Special Handling for Charts
            if (targetPageId === 'dashboard') {
                updateCharts();
            }

            // Close sidebar on mobile after selection
            if (window.innerWidth <= 900) {
                closeSidebarHandler();
            }
        });
    });

    // Make sidebar nav items clickable active (Revised)
    // Removed old menuItems.forEach(item => item.click) logic as it's now handled above
});
