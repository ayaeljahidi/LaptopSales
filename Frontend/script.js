const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const views = {
    list: document.getElementById('list-view'),
    create: document.getElementById('create-view'),
    detail: document.getElementById('detail-view')
};

const loadingElement = document.getElementById('loading');
const laptopsGrid = document.getElementById('laptops-grid');
const laptopForm = document.getElementById('laptop-form');
const laptopCount = document.getElementById('laptop-count');
const notification = document.getElementById('notification');

let currentEditingId = null;

// Default laptop placeholder image
const DEFAULT_IMAGE = 'https://via.placeholder.com/400x300/2563eb/ffffff?text=Laptop+Image';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeForm();
    showView('list');
    loadLaptops();
});

// Navigation
function initializeNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            showView(view);
            
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.getElementById('back-btn').addEventListener('click', () => showView('list'));
    document.getElementById('cancel-btn').addEventListener('click', () => showView('list'));
}

function showView(viewName) {
    Object.values(views).forEach(view => view.classList.add('hidden'));
    loadingElement.classList.add('hidden');
    
    if (viewName === 'list') {
        views.list.classList.remove('hidden');
        loadLaptops();
    } else if (viewName === 'create') {
        views.create.classList.remove('hidden');
        resetForm();
    } else if (viewName === 'detail') {
        views.detail.classList.remove('hidden');
    }
}

// API Functions
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        showNotification('Error: ' + error.message, 'error');
        throw error;
    }
}

// Laptop Operations
async function loadLaptops() {
    showLoading();
    try {
        const laptops = await apiCall('/stuff');
        displayLaptops(laptops);
        laptopCount.textContent = `${laptops.length} laptop${laptops.length !== 1 ? 's' : ''}`;
    } catch (error) {
        laptopsGrid.innerHTML = '<div class="empty-state">Error loading laptops. Make sure the backend is running on port 3000.</div>';
    } finally {
        hideLoading();
    }
}

function displayLaptops(laptops) {
    if (laptops.length === 0) {
        laptopsGrid.innerHTML = '<div class="empty-state">No laptops found. Add your first laptop to get started!</div>';
        return;
    }

    laptopsGrid.innerHTML = laptops.map(laptop => `
        <div class="laptop-card">
            <div class="laptop-image">
                <img src="${laptop.imageUrl || DEFAULT_IMAGE}" 
                     alt="${laptop.title}" 
                     onerror="this.src='${DEFAULT_IMAGE}'"
                     loading="lazy">
                <div class="laptop-badge">${laptop.condition || 'New'}</div>
            </div>
            <div class="laptop-content">
                <div class="laptop-brand">${laptop.brand || 'Unknown Brand'}</div>
                <h3>${laptop.title}</h3>
                <p class="laptop-specs">${laptop.description}</p>
                <p class="laptop-price">$${laptop.price}</p>
                <div class="laptop-actions">
                    <button class="view-btn" onclick="viewLaptop('${laptop._id}')">View</button>
                    <button class="edit-btn" onclick="editLaptop('${laptop._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteLaptop('${laptop._id}')">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function viewLaptop(id) {
    showLoading();
    try {
        const laptop = await apiCall(`/stuff/${id}`);
        displayLaptopDetail(laptop);
        showView('detail');
    } catch (error) {
        // Error handled in apiCall
    } finally {
        hideLoading();
    }
}

function displayLaptopDetail(laptop) {
    const detailContent = document.getElementById('detail-content');
    detailContent.innerHTML = `
        <div class="detail-grid">
            <div class="detail-image">
                <img src="${laptop.imageUrl || DEFAULT_IMAGE}" 
                     alt="${laptop.title}" 
                     onerror="this.src='${DEFAULT_IMAGE}'">
            </div>
            <div class="detail-info">
                <div class="detail-brand">${laptop.brand || 'Unknown Brand'}</div>
                <h1>${laptop.title}</h1>
                <p class="detail-specs">${laptop.description}</p>
                
                <div class="detail-meta">
                    <div class="meta-item">
                        <div class="meta-label">Processor</div>
                        <div class="meta-value">${laptop.processor || 'Not specified'}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">RAM</div>
                        <div class="meta-value">${laptop.ram || 'Not specified'} GB</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Storage</div>
                        <div class="meta-value">${laptop.storage || 'Not specified'}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Display</div>
                        <div class="meta-value">${laptop.display || 'Not specified'}</div>
                    </div>
                </div>
                
                <p class="detail-price">$${laptop.price}</p>
                <p class="detail-user">Seller ID: ${laptop.userId}</p>
                <div style="margin-top: 2rem;">
                    <button class="edit-btn" onclick="editLaptop('${laptop._id}')" style="margin-right: 1rem;">Edit This Laptop</button>
                    <button class="delete-btn" onclick="deleteLaptop('${laptop._id}')">Delete This Laptop</button>
                </div>
            </div>
        </div>
    `;
}

async function editLaptop(id) {
    showLoading();
    try {
        const laptop = await apiCall(`/stuff/${id}`);
        populateForm(laptop);
        currentEditingId = id;
        document.getElementById('form-title').textContent = 'Edit Laptop';
        showView('create');
    } catch (error) {
        // Error handled in apiCall
    } finally {
        hideLoading();
    }
}

function populateForm(laptop) {
    document.getElementById('brand').value = laptop.brand || '';
    document.getElementById('model').value = laptop.model || '';
    document.getElementById('title').value = laptop.title;
    document.getElementById('description').value = laptop.description;
    document.getElementById('processor').value = laptop.processor || '';
    document.getElementById('ram').value = laptop.ram || '';
    document.getElementById('storage').value = laptop.storage || '';
    document.getElementById('display').value = laptop.display || '';
    document.getElementById('imageUrl').value = laptop.imageUrl || '';
    document.getElementById('price').value = laptop.price;
    document.getElementById('condition').value = laptop.condition || 'New';
    document.getElementById('userId').value = laptop.userId;
}

async function deleteLaptop(id) {
    if (!confirm('Are you sure you want to delete this laptop?')) {
        return;
    }

    showLoading();
    try {
        await apiCall(`/stuff/${id}`, { method: 'DELETE' });
        showNotification('Laptop deleted successfully!', 'success');
        loadLaptops();
    } catch (error) {
        // Error handled in apiCall
    } finally {
        hideLoading();
    }
}

// Form Handling
function initializeForm() {
    laptopForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveLaptop();
    });
}

async function saveLaptop() {
    const formData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        imageUrl: document.getElementById('imageUrl').value || DEFAULT_IMAGE,
        price: parseFloat(document.getElementById('price').value),
        userId: document.getElementById('userId').value,
        brand: document.getElementById('brand').value,
        model: document.getElementById('model').value,
        processor: document.getElementById('processor').value,
        ram: parseInt(document.getElementById('ram').value),
        storage: document.getElementById('storage').value,
        display: document.getElementById('display').value,
        condition: document.getElementById('condition').value
    };

    showLoading();
    try {
        if (currentEditingId) {
            await apiCall(`/stuff/${currentEditingId}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
            showNotification('Laptop updated successfully!', 'success');
        } else {
            await apiCall('/stuff', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            showNotification('Laptop added successfully!', 'success');
        }
        
        resetForm();
        showView('list');
    } catch (error) {
        // Error handled in apiCall
    } finally {
        hideLoading();
    }
}

function resetForm() {
    laptopForm.reset();
    currentEditingId = null;
    document.getElementById('form-title').textContent = 'Add New Laptop';
    document.getElementById('userId').value = 'seller001';
    document.getElementById('imageUrl').value = '';
    document.getElementById('condition').value = 'New';
}

// UI Utilities
function showLoading() {
    loadingElement.classList.remove('hidden');
}

function hideLoading() {
    loadingElement.classList.add('hidden');
}

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Better image error handling
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.src = DEFAULT_IMAGE;
            e.target.onerror = null; // Prevent infinite loop
        }
    }, true);
});