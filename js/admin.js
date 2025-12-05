// Admin panel JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
    initializeDataTables();
    initializeModals();
    initializeFormValidation();
    initializeSidebar();
    loadDashboardData();
});

// Initialize admin panel
function initializeAdminPanel() {
    // Add fade-in animation to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
    
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
        initializeCharts();
    }
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Data table functionality
function initializeDataTables() {
    const tables = document.querySelectorAll('table[id$="Table"]');
    
    tables.forEach(table => {
        // Add sorting functionality
        const headers = table.querySelectorAll('th[onclick]');
        headers.forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                const column = this.getAttribute('onclick').match(/'([^']+)'/)[1];
                sortTable(table, column);
            });
        });
        
        // Add row selection
        const checkboxes = table.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectionCount);
        });
    });
}

// Table sorting functionality
function sortTable(table, column) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const columnIndex = Array.from(table.querySelectorAll('th')).findIndex(th => 
        th.getAttribute('onclick') && th.getAttribute('onclick').includes(column)
    );
    
    if (columnIndex === -1) return;
    
    const isAscending = table.getAttribute('data-sort-direction') !== 'asc';
    table.setAttribute('data-sort-direction', isAscending ? 'asc' : 'desc');
    
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        
        // Handle numeric values
        const aNum = parseFloat(aText.replace(/[^\d.-]/g, ''));
        const bNum = parseFloat(bText.replace(/[^\d.-]/g, ''));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAscending ? aNum - bNum : bNum - aNum;
        }
        
        // Handle text values
        return isAscending ? 
            aText.localeCompare(bText) : 
            bText.localeCompare(aText);
    });
    
    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
    
    // Update sort indicators
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
        const icon = header.querySelector('i');
        if (icon) {
            icon.className = index === columnIndex ? 
                (isAscending ? 'fas fa-sort-up' : 'fas fa-sort-down') : 
                'fas fa-sort';
        }
    });
}

// Update selection count
function updateSelectionCount() {
    const checkboxes = document.querySelectorAll('.trader-checkbox:checked');
    const countElement = document.getElementById('selectedCount');
    if (countElement) {
        countElement.textContent = checkboxes.length;
    }
}

// Toggle select all functionality
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const itemCheckboxes = document.querySelectorAll('.trader-checkbox');
    
    itemCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateSelectionCount();
}

// Modal functionality
function initializeModals() {
    // Auto-focus first input in modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', function() {
            const firstInput = this.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        });
        
        // Clear form on modal hide
        modal.addEventListener('hidden.bs.modal', function() {
            const form = this.querySelector('form');
            if (form) {
                form.reset();
                clearFormErrors(form);
            }
        });
    });
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                handleFormSubmission(this);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Это поле обязательно для заполнения';
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Введите корректный email адрес';
    }
    
    // Number validation
    if (field.type === 'number' && value) {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) {
            isValid = false;
            errorMessage = 'Введите корректное положительное число';
        }
    }
    
    // Password validation
    if (field.type === 'password' && value && value.length < 6) {
        isValid = false;
        errorMessage = 'Пароль должен содержать минимум 6 символов';
    }
    
    // Show/hide error
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        hideFieldError(field);
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    hideFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function hideFieldError(field) {
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
}

function clearFormErrors(form) {
    const inputs = form.querySelectorAll('.is-invalid, .is-valid');
    inputs.forEach(input => {
        input.classList.remove('is-invalid', 'is-valid');
        hideFieldError(input);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sidebar functionality
function initializeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.navbar-toggler');
    
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !toggleButton.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });
}

// Dashboard data loading
function loadDashboardData() {
    // Simulate loading dashboard statistics
    setTimeout(() => {
        updateDashboardStats();
        loadRecentOperations();
    }, 1000);
}

function updateDashboardStats() {
    const stats = [
        { selector: '.border-left-primary .stat-number', value: '$18.5B' },
        { selector: '.border-left-success .stat-number', value: '21.5K' },
        { selector: '.border-left-info .stat-number', value: '325M' },
        { selector: '.border-left-warning .stat-number', value: '8' }
    ];
    
    stats.forEach(stat => {
        const element = document.querySelector(stat.selector);
        if (element) {
            animateCounter(element, stat.value);
        }
    });
}

function animateCounter(element, targetValue) {
    const numericValue = parseFloat(targetValue.replace(/[^\d.]/g, ''));
    const suffix = targetValue.replace(/[\d.]/g, '');
    let current = 0;
    const increment = numericValue / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current) + suffix;
    }, 20);
}

function loadRecentOperations() {
    // Simulate loading recent operations
    const operations = [
        { id: 1, trader: 'Иван Петров', type: 'Покупка BTC', amount: '$1,250.00', status: 'success' },
        { id: 2, trader: 'Мария Сидорова', type: 'Продажа ETH', amount: '$2,100.00', status: 'warning' },
        { id: 3, trader: 'Алексей Козлов', type: 'Покупка BNB', amount: '$850.00', status: 'success' }
    ];
    
    const tbody = document.querySelector('#recentOperations tbody');
    if (tbody) {
        tbody.innerHTML = operations.map(op => `
            <tr>
                <td>#${op.id.toString().padStart(3, '0')}</td>
                <td>${op.trader}</td>
                <td>${op.type}</td>
                <td>${op.amount}</td>
                <td><span class="badge bg-${op.status === 'success' ? 'success' : 'warning'}">${op.status === 'success' ? 'Выполнено' : 'В процессе'}</span></td>
                <td>${new Date().toLocaleDateString('ru-RU')} ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewOperation(${op.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteOperation(${op.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// CRUD Operations
function addTrader() {
    const form = document.getElementById('addTraderForm');
    if (!validateForm(form)) return;
    
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        showSuccessAlert('Трейдер успешно добавлен!');
        bootstrap.Modal.getInstance(document.getElementById('addTraderModal')).hide();
        
        // Refresh traders table if on traders page
        if (window.location.pathname.includes('traders.html')) {
            location.reload();
        }
    }, 1500);
}

function addBot() {
    const form = document.getElementById('addBotForm');
    if (!validateForm(form)) return;
    
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showSuccessAlert('Бот успешно создан!');
        bootstrap.Modal.getInstance(document.getElementById('addBotModal')).hide();
    }, 1500);
}

function addArticle() {
    const form = document.getElementById('addArticleForm');
    if (!validateForm(form)) return;
    
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showSuccessAlert('Статья успешно добавлена!');
        bootstrap.Modal.getInstance(document.getElementById('addArticleModal')).hide();
    }, 1500);
}

function editTrader(id) {
    // Load trader data and show edit modal
    const editModal = new bootstrap.Modal(document.getElementById('editTraderModal'));
    
    // Simulate loading trader data
    showLoading();
    setTimeout(() => {
        hideLoading();
        
        // Populate form with trader data
        document.getElementById('editTraderId').value = id;
        document.getElementById('editTraderName').value = 'Иван Петров';
        document.getElementById('editTraderEmail').value = 'ivan@example.com';
        document.getElementById('editTraderUsername').value = 'ivan_trader';
        document.getElementById('editTraderBalance').value = '15250.00';
        document.getElementById('editTraderLevel').value = 'expert';
        document.getElementById('editTraderStatus').value = 'active';
        
        editModal.show();
    }, 500);
}

function updateTrader() {
    const form = document.getElementById('editTraderForm');
    if (!validateForm(form)) return;
    
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showSuccessAlert('Данные трейдера обновлены!');
        bootstrap.Modal.getInstance(document.getElementById('editTraderModal')).hide();
    }, 1500);
}

function deleteTrader(id) {
    if (confirm('Вы уверены, что хотите удалить этого трейдера?')) {
        showLoading();
        
        setTimeout(() => {
            hideLoading();
            showSuccessAlert('Трейдер удален!');
        }, 1000);
    }
}

function viewTrader(id) {
    showInfoAlert(`Просмотр трейдера #${id}`);
}

function viewTraderStats(id) {
    const modal = new bootstrap.Modal(document.getElementById('traderStatsModal'));
    modal.show();
}

function deleteOperation(id) {
    if (confirm('Вы уверены, что хотите удалить эту операцию?')) {
        showLoading();
        
        setTimeout(() => {
            hideLoading();
            showSuccessAlert('Операция удалена!');
        }, 1000);
    }
}

function viewOperation(id) {
    showInfoAlert(`Просмотр операции #${id}`);
}

function exportTraders() {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showSuccessAlert('Данные экспортированы успешно!');
    }, 2000);
}

function exportData() {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showSuccessAlert('Экспорт данных завершен!');
    }, 2000);
}

function bulkAction(action) {
    const selectedCheckboxes = document.querySelectorAll('.trader-checkbox:checked');
    
    if (selectedCheckboxes.length === 0) {
        showWarningAlert('Выберите трейдеров для выполнения действия');
        return;
    }
    
    const actionNames = {
        'activate': 'активированы',
        'suspend': 'заблокированы',
        'delete': 'удалены'
    };
    
    if (confirm(`Вы уверены, что хотите ${actionNames[action]} ${selectedCheckboxes.length} трейдеров?`)) {
        showLoading();
        
        setTimeout(() => {
            hideLoading();
            showSuccessAlert(`Трейдеры ${actionNames[action]}!`);
        }, 1500);
    }
}

// Utility functions
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = `
        <div class="loading-content">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Загрузка...</span>
            </div>
            <p class="mt-2">Загрузка...</p>
        </div>
    `;
    
    document.body.appendChild(loader);
    
    // Add loading styles
    const style = document.createElement('style');
    style.textContent = `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        
        .loading-content {
            text-align: center;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(style);
}

function hideLoading() {
    const loader = document.querySelector('.loading-overlay');
    if (loader) {
        loader.remove();
    }
}

function showSuccessAlert(message) {
    showAlert(message, 'success');
}

function showErrorAlert(message) {
    showAlert(message, 'danger');
}

function showWarningAlert(message) {
    showAlert(message, 'warning');
}

function showInfoAlert(message) {
    showAlert(message, 'info');
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Chart initialization
function initializeCharts() {
    // Dashboard charts would go here
    // This is a placeholder for when Chart.js is included
}

// Search and filter functionality
function applyFilters() {
    const searchTerm = document.getElementById('searchTrader')?.value.toLowerCase();
    const levelFilter = document.getElementById('filterLevel')?.value;
    const statusFilter = document.getElementById('filterStatus')?.value;
    const dateFilter = document.getElementById('filterDate')?.value;
    
    const rows = document.querySelectorAll('#tradersTable tbody tr');
    
    rows.forEach(row => {
        const name = row.cells[2].textContent.toLowerCase();
        const email = row.cells[3].textContent.toLowerCase();
        const level = row.cells[4].textContent.toLowerCase();
        const status = row.cells[6].textContent.toLowerCase();
        
        let showRow = true;
        
        if (searchTerm && !name.includes(searchTerm) && !email.includes(searchTerm)) {
            showRow = false;
        }
        
        if (levelFilter && !level.includes(levelFilter)) {
            showRow = false;
        }
        
        if (statusFilter && !status.includes(statusFilter)) {
            showRow = false;
        }
        
        row.style.display = showRow ? '' : 'none';
    });
    
    showInfoAlert('Фильтры применены');
}

// Responsive table functionality
function makeTableResponsive() {
    const tables = document.querySelectorAll('.table-responsive');
    
    tables.forEach(table => {
        if (table.scrollWidth > table.clientWidth) {
            table.classList.add('table-scroll');
        }
    });
}

// Initialize responsive tables
window.addEventListener('resize', makeTableResponsive);
document.addEventListener('DOMContentLoaded', makeTableResponsive);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + N - New item
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        const addButton = document.querySelector('[data-bs-target*="Modal"]');
        if (addButton) {
            addButton.click();
        }
    }
    
    // Ctrl + F - Focus search
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape - Close modals
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            bootstrap.Modal.getInstance(openModal).hide();
        }
    }
});
