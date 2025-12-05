// Traders management specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeTradersPage();
});

function initializeTradersPage() {
    // Initialize traders-specific functionality
    initializeTraderTable();
    initializeTraderFilters();
    initializeTraderModals();
    
    // Load initial data
    loadTradersData();
}

function initializeTraderTable() {
    const table = document.getElementById('tradersTable');
    if (!table) return;
    
    // Add row click handlers
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Don't trigger if clicking on buttons or checkboxes
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') {
                return;
            }
            
            // Toggle row selection
            const checkbox = this.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                updateSelectionCount();
            }
        });
    });
    
    // Add hover effects
    rows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(102, 126, 234, 0.05)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
}

function initializeTraderFilters() {
    const searchInput = document.getElementById('searchTrader');
    const levelFilter = document.getElementById('filterLevel');
    const statusFilter = document.getElementById('filterStatus');
    const dateFilter = document.getElementById('filterDate');
    
    // Real-time search
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
    
    // Filter change handlers
    [levelFilter, statusFilter, dateFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
}

function initializeTraderModals() {
    // Add trader modal enhancements
    const addModal = document.getElementById('addTraderModal');
    if (addModal) {
        addModal.addEventListener('shown.bs.modal', function() {
            // Generate username based on name
            const nameInput = document.getElementById('traderName');
            const usernameInput = document.getElementById('traderUsername');
            
            if (nameInput && usernameInput) {
                nameInput.addEventListener('input', function() {
                    const username = this.value.toLowerCase()
                        .replace(/[^a-zа-я\s]/g, '')
                        .replace(/\s+/g, '_')
                        .substring(0, 20);
                    usernameInput.value = username;
                });
            }
            
            // Validate email uniqueness
            const emailInput = document.getElementById('traderEmail');
            if (emailInput) {
                emailInput.addEventListener('blur', function() {
                    validateEmailUniqueness(this.value);
                });
            }
        });
    }
}

function loadTradersData() {
    // Simulate loading traders data
    const traders = [
        {
            id: 1,
            name: 'Иван Петров',
            username: 'ivan_trader',
            email: 'ivan@example.com',
            level: 'expert',
            balance: 15250.00,
            status: 'active',
            registration: '2024-01-15',
            profit: 2450.00,
            trades: 156,
            successRate: 89
        },
        {
            id: 2,
            name: 'Мария Сидорова',
            username: 'maria_crypto',
            email: 'maria@example.com',
            level: 'intermediate',
            balance: 8750.50,
            status: 'active',
            registration: '2024-01-14',
            profit: 1200.00,
            trades: 89,
            successRate: 76
        },
        {
            id: 3,
            name: 'Алексей Козлов',
            username: 'alex_trading',
            email: 'alex@example.com',
            level: 'advanced',
            balance: 22100.00,
            status: 'inactive',
            registration: '2024-01-13',
            profit: 3200.00,
            trades: 234,
            successRate: 82
        },
        {
            id: 4,
            name: 'Елена Волкова',
            username: 'elena_crypto',
            email: 'elena@example.com',
            level: 'beginner',
            balance: 1500.00,
            status: 'active',
            registration: '2024-01-12',
            profit: 150.00,
            trades: 23,
            successRate: 65
        },
        {
            id: 5,
            name: 'Дмитрий Новиков',
            username: 'dmitry_trader',
            email: 'dmitry@example.com',
            level: 'expert',
            balance: 45000.00,
            status: 'active',
            registration: '2024-01-11',
            profit: 8900.00,
            trades: 445,
            successRate: 92
        }
    ];
    
    // Update traders table
    updateTradersTable(traders);
    
    // Update sidebar counters
    updateSidebarCounters(traders);
}

function updateTradersTable(traders) {
    const tbody = document.querySelector('#tradersTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = traders.map(trader => `
        <tr>
            <td><input type="checkbox" class="trader-checkbox" value="${trader.id}"></td>
            <td>#${trader.id.toString().padStart(3, '0')}</td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar me-2">${getInitials(trader.name)}</div>
                    <div>
                        <div class="fw-bold">${trader.name}</div>
                        <small class="text-muted">@${trader.username}</small>
                    </div>
                </div>
            </td>
            <td>${trader.email}</td>
            <td>${getLevelBadge(trader.level)}</td>
            <td class="text-success">$${trader.balance.toLocaleString()}</td>
            <td>${getStatusBadge(trader.status)}</td>
            <td>${formatDate(trader.registration)}</td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewTrader(${trader.id})" title="Просмотр">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" onclick="editTrader(${trader.id})" title="Редактировать">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" onclick="viewTraderStats(${trader.id})" title="Статистика">
                        <i class="fas fa-chart-bar"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteTrader(${trader.id})" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Re-initialize table functionality
    initializeTraderTable();
}

function updateSidebarCounters(traders) {
    const activeCount = traders.filter(t => t.status === 'active').length;
    const totalCount = traders.length;
    
    // Update sidebar badge
    const badge = document.querySelector('.sidebar .nav-link[href="traders.html"] .badge');
    if (badge) {
        badge.textContent = totalCount;
    }
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function getLevelBadge(level) {
    const badges = {
        'beginner': '<span class="badge bg-secondary">Начинающий</span>',
        'intermediate': '<span class="badge bg-warning">Средний</span>',
        'advanced': '<span class="badge bg-info">Продвинутый</span>',
        'expert': '<span class="badge bg-success">Эксперт</span>'
    };
    return badges[level] || '<span class="badge bg-secondary">Неизвестно</span>';
}

function getStatusBadge(status) {
    const badges = {
        'active': '<span class="badge bg-success">Активный</span>',
        'inactive': '<span class="badge bg-warning">Неактивный</span>',
        'suspended': '<span class="badge bg-danger">Заблокирован</span>'
    };
    return badges[status] || '<span class="badge bg-secondary">Неизвестно</span>';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function validateEmailUniqueness(email) {
    // Simulate email uniqueness check
    const existingEmails = ['ivan@example.com', 'maria@example.com', 'alex@example.com'];
    
    if (existingEmails.includes(email)) {
        showFieldError(document.getElementById('traderEmail'), 'Email уже используется');
        return false;
    }
    
    return true;
}

function viewTrader(id) {
    // Load trader data and show view modal
    const traderData = getTraderById(id);
    if (!traderData) return;
    
    showTraderDetailsModal(traderData);
}

function getTraderById(id) {
    // Simulate getting trader data
    const traders = [
        {
            id: 1,
            name: 'Иван Петров',
            username: 'ivan_trader',
            email: 'ivan@example.com',
            level: 'expert',
            balance: 15250.00,
            status: 'active',
            registration: '2024-01-15',
            profit: 2450.00,
            trades: 156,
            successRate: 89,
            phone: '+7 (999) 123-45-67',
            country: 'Россия',
            lastLogin: '2024-01-15 14:30',
            totalDeposits: 10000.00,
            totalWithdrawals: 5000.00
        }
    ];
    
    return traders.find(t => t.id === id);
}

function showTraderDetailsModal(trader) {
    // Create and show trader details modal
    const modalHtml = `
        <div class="modal fade" id="traderDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Детали трейдера</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Основная информация</h6>
                                <table class="table table-sm">
                                    <tr><td><strong>ID:</strong></td><td>#${trader.id.toString().padStart(3, '0')}</td></tr>
                                    <tr><td><strong>Имя:</strong></td><td>${trader.name}</td></tr>
                                    <tr><td><strong>Username:</strong></td><td>@${trader.username}</td></tr>
                                    <tr><td><strong>Email:</strong></td><td>${trader.email}</td></tr>
                                    <tr><td><strong>Телефон:</strong></td><td>${trader.phone || 'Не указан'}</td></tr>
                                    <tr><td><strong>Страна:</strong></td><td>${trader.country || 'Не указана'}</td></tr>
                                    <tr><td><strong>Уровень:</strong></td><td>${getLevelBadge(trader.level)}</td></tr>
                                    <tr><td><strong>Статус:</strong></td><td>${getStatusBadge(trader.status)}</td></tr>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <h6>Торговая информация</h6>
                                <table class="table table-sm">
                                    <tr><td><strong>Баланс:</strong></td><td class="text-success">$${trader.balance.toLocaleString()}</td></tr>
                                    <tr><td><strong>Прибыль:</strong></td><td class="text-success">+$${trader.profit.toLocaleString()}</td></tr>
                                    <tr><td><strong>Сделки:</strong></td><td>${trader.trades}</td></tr>
                                    <tr><td><strong>Успешность:</strong></td><td>${trader.successRate}%</td></tr>
                                    <tr><td><strong>Депозиты:</strong></td><td>$${trader.totalDeposits.toLocaleString()}</td></tr>
                                    <tr><td><strong>Выводы:</strong></td><td>$${trader.totalWithdrawals.toLocaleString()}</td></tr>
                                    <tr><td><strong>Регистрация:</strong></td><td>${formatDate(trader.registration)}</td></tr>
                                    <tr><td><strong>Последний вход:</strong></td><td>${trader.lastLogin}</td></tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                        <button type="button" class="btn btn-warning" onclick="editTrader(${trader.id}); bootstrap.Modal.getInstance(document.getElementById('traderDetailsModal')).hide();">
                            <i class="fas fa-edit me-1"></i>
                            Редактировать
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if present
    const existingModal = document.getElementById('traderDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('traderDetailsModal'));
    modal.show();
    
    // Clean up modal when hidden
    modal._element.addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

function editTrader(id) {
    // Load trader data and populate edit form
    const traderData = getTraderById(id);
    if (!traderData) return;
    
    // Populate edit form
    document.getElementById('editTraderId').value = traderData.id;
    document.getElementById('editTraderName').value = traderData.name;
    document.getElementById('editTraderEmail').value = traderData.email;
    document.getElementById('editTraderUsername').value = traderData.username;
    document.getElementById('editTraderBalance').value = traderData.balance;
    document.getElementById('editTraderLevel').value = traderData.level;
    document.getElementById('editTraderStatus').value = traderData.status;
    
    // Show edit modal
    const editModal = new bootstrap.Modal(document.getElementById('editTraderModal'));
    editModal.show();
}

function deleteTrader(id) {
    const traderData = getTraderById(id);
    if (!traderData) return;
    
    if (confirm(`Вы уверены, что хотите удалить трейдера "${traderData.name}"? Это действие нельзя отменить.`)) {
        showLoading();
        
        // Simulate API call
        setTimeout(() => {
            hideLoading();
            showSuccessAlert(`Трейдер "${traderData.name}" успешно удален!`);
            
            // Remove from table
            const row = document.querySelector(`input[value="${id}"]`).closest('tr');
            if (row) {
                row.remove();
                updateSelectionCount();
            }
        }, 1500);
    }
}

function viewTraderStats(id) {
    const traderData = getTraderById(id);
    if (!traderData) return;
    
    // Update stats modal with trader data
    const statsModal = document.getElementById('traderStatsModal');
    if (statsModal) {
        const modalTitle = statsModal.querySelector('.modal-title');
        modalTitle.textContent = `Статистика: ${traderData.name}`;
        
        // Update stats content
        const statsContent = statsModal.querySelector('.modal-body');
        statsContent.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body text-center">
                            <h6 class="card-title">Общая прибыль</h6>
                            <h3 class="text-success">+$${traderData.profit.toLocaleString()}</h3>
                            <small class="text-muted">+${((traderData.profit / traderData.balance) * 100).toFixed(1)}% за месяц</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body text-center">
                            <h6 class="card-title">Количество сделок</h6>
                            <h3 class="text-primary">${traderData.trades}</h3>
                            <small class="text-muted">Успешных: ${traderData.successRate}%</small>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-3">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body text-center">
                            <h6 class="card-title">Средняя сделка</h6>
                            <h3 class="text-info">$${(traderData.balance / traderData.trades).toFixed(2)}</h3>
                            <small class="text-muted">За последний месяц</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body text-center">
                            <h6 class="card-title">Рейтинг</h6>
                            <h3 class="text-warning">${(traderData.successRate / 20).toFixed(1)}/5</h3>
                            <small class="text-muted">На основе успешности</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('traderStatsModal'));
    modal.show();
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functionality
function exportTradersToCSV() {
    const table = document.getElementById('tradersTable');
    const rows = table.querySelectorAll('tbody tr');
    
    let csv = 'ID,Имя,Email,Уровень,Баланс,Статус,Регистрация\n';
    
    rows.forEach(row => {
        if (row.style.display !== 'none') {
            const cells = row.querySelectorAll('td');
            const rowData = [
                cells[1].textContent.trim(),
                cells[2].querySelector('.fw-bold').textContent.trim(),
                cells[3].textContent.trim(),
                cells[4].textContent.trim(),
                cells[5].textContent.trim(),
                cells[6].textContent.trim(),
                cells[7].textContent.trim()
            ];
            csv += rowData.join(',') + '\n';
        }
    });
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'traders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showSuccessAlert('Данные экспортированы в CSV');
}

// Enhanced filter functionality
function applyAdvancedFilters() {
    const searchTerm = document.getElementById('searchTrader')?.value.toLowerCase();
    const levelFilter = document.getElementById('filterLevel')?.value;
    const statusFilter = document.getElementById('filterStatus')?.value;
    const dateFilter = document.getElementById('filterDate')?.value;
    const balanceMin = document.getElementById('balanceMin')?.value;
    const balanceMax = document.getElementById('balanceMax')?.value;
    
    const rows = document.querySelectorAll('#tradersTable tbody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const name = row.cells[2].textContent.toLowerCase();
        const email = row.cells[3].textContent.toLowerCase();
        const level = row.cells[4].textContent.toLowerCase();
        const status = row.cells[6].textContent.toLowerCase();
        const balance = parseFloat(row.cells[5].textContent.replace(/[^0-9.-]/g, ''));
        
        let showRow = true;
        
        // Search filter
        if (searchTerm && !name.includes(searchTerm) && !email.includes(searchTerm)) {
            showRow = false;
        }
        
        // Level filter
        if (levelFilter && !level.includes(levelFilter)) {
            showRow = false;
        }
        
        // Status filter
        if (statusFilter && !status.includes(statusFilter)) {
            showRow = false;
        }
        
        // Balance filter
        if (balanceMin && balance < parseFloat(balanceMin)) {
            showRow = false;
        }
        
        if (balanceMax && balance > parseFloat(balanceMax)) {
            showRow = false;
        }
        
        row.style.display = showRow ? '' : 'none';
        if (showRow) visibleCount++;
    });
    
    // Update results count
    const resultsInfo = document.querySelector('.results-info');
    if (resultsInfo) {
        resultsInfo.textContent = `Показано ${visibleCount} из ${rows.length} трейдеров`;
    }
    
    showInfoAlert(`Найдено ${visibleCount} трейдеров`);
}

// Initialize enhanced filtering
document.addEventListener('DOMContentLoaded', function() {
    const filterButton = document.querySelector('[onclick="applyFilters()"]');
    if (filterButton) {
        filterButton.setAttribute('onclick', 'applyAdvancedFilters()');
    }
});
