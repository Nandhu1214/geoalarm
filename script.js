
// GeoAlarm Interactive JavaScript

// DOM Elements
const destinationInput = document.getElementById('destination');
const mapButton = document.querySelector('.map-button');
const currentLocationToggle = document.querySelector('.toggle-input');
const radiusSlider = document.getElementById('radius');
const radiusValue = document.getElementById('radius-value');
const toneSelect = document.getElementById('tone');
const setAlarmButton = document.querySelector('.primary-button');
const alarmsList = document.querySelector('.card-content');

// State management
let activeAlarms = [
    {
        id: 1,
        destination: 'Times Square, New York',
        radius: 100,
        tone: '🔔 Bell'
    },
    {
        id: 2,
        destination: 'Central Park',
        radius: 250,
        tone: '🎵 Chime'
    }
];

let alarmIdCounter = 3;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateRadiusDisplay();
    renderActiveAlarms();
});

// Event Listeners
function initializeEventListeners() {
    // Radius slider
    radiusSlider.addEventListener('input', updateRadiusDisplay);
    
    // Set alarm button
    setAlarmButton.addEventListener('click', handleSetAlarm);
    
    // Map button hover effect
    mapButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    mapButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Form validation on input
    destinationInput.addEventListener('input', validateForm);
    toneSelect.addEventListener('change', validateForm);
    
    // Enter key support
    destinationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSetAlarm();
        }
    });
}

// Update radius display
function updateRadiusDisplay() {
    radiusValue.textContent = radiusSlider.value;
}

// Form validation
function validateForm() {
    const destination = destinationInput.value.trim();
    const tone = toneSelect.value;
    
    if (destination && tone) {
        setAlarmButton.style.opacity = '1';
        setAlarmButton.style.cursor = 'pointer';
        setAlarmButton.disabled = false;
    } else {
        setAlarmButton.style.opacity = '0.7';
        setAlarmButton.style.cursor = 'not-allowed';
        setAlarmButton.disabled = true;
    }
}

// Handle setting a new alarm
function handleSetAlarm() {
    const destination = destinationInput.value.trim();
    const radius = parseInt(radiusSlider.value);
    const tone = toneSelect.selectedOptions[0]?.text;
    
    // Validation
    if (!destination) {
        showNotification('Please enter a destination', 'error');
        destinationInput.focus();
        return;
    }
    
    if (!tone || toneSelect.value === '') {
        showNotification('Please select an alarm tone', 'error');
        toneSelect.focus();
        return;
    }
    
    // Create new alarm
    const newAlarm = {
        id: alarmIdCounter++,
        destination,
        radius,
        tone
    };
    
    activeAlarms.push(newAlarm);
    
    // Clear form
    resetForm();
    
    // Update UI
    renderActiveAlarms();
    showNotification(`Alarm set for ${destination}! You'll be notified when within ${radius}m.`, 'success');
    
    // Add some visual feedback
    setAlarmButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        setAlarmButton.style.transform = 'scale(1)';
    }, 100);
}

// Reset form
function resetForm() {
    destinationInput.value = '';
    toneSelect.value = '';
    radiusSlider.value = 500;
    updateRadiusDisplay();
    validateForm();
}

// Render active alarms
function renderActiveAlarms() {
    const alarmsContainer = document.querySelector('.card:last-of-type .card-content');
    const alarmCount = document.querySelector('.card:last-of-type .card-title');
    
    // Update count in title
    alarmCount.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
        Active Alarms (${activeAlarms.length})
    `;
    
    if (activeAlarms.length === 0) {
        alarmsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem 0; color: #6b7280;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 1rem; opacity: 0.5;">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
                <p>No active alarms</p>
                <p style="font-size: 0.875rem;">Create your first location-based alarm above!</p>
            </div>
        `;
        return;
    }
    
    alarmsContainer.innerHTML = activeAlarms.map(alarm => `
        <div class="alarm-item" data-alarm-id="${alarm.id}">
            <div class="alarm-info">
                <div class="alarm-destination">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${alarm.destination}
                </div>
                <div class="alarm-details">${alarm.radius}m radius • ${alarm.tone}</div>
            </div>
            <button class="delete-button" type="button" onclick="deleteAlarm(${alarm.id})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
            </button>
        </div>
    `).join('');
}

// Delete alarm function
function deleteAlarm(alarmId) {
    const alarmIndex = activeAlarms.findIndex(alarm => alarm.id === alarmId);
    
    if (alarmIndex !== -1) {
        const deletedAlarm = activeAlarms[alarmIndex];
        activeAlarms.splice(alarmIndex, 1);
        renderActiveAlarms();
        showNotification(`Alarm for ${deletedAlarm.destination} deleted`, 'info');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            background: white;
            border-left: 4px solid;
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
        }
        
        .notification.success {
            border-left-color: #10b981;
            background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
        }
        
        .notification.error {
            border-left-color: #ef4444;
            background: linear-gradient(135deg, #fef2f2, #fef7f7);
        }
        
        .notification.info {
            border-left-color: #3b82f6;
            background: linear-gradient(135deg, #eff6ff, #f0f9ff);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.25rem;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Initialize form validation state
document.addEventListener('DOMContentLoaded', function() {
    validateForm();
});

// Add smooth scroll for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Add some easter eggs and polish
document.addEventListener('DOMContentLoaded', function() {
    // Add a subtle pulse animation to the location pin
    const locationPin = document.querySelector('.location-pin');
    if (locationPin) {
        setInterval(() => {
            locationPin.style.transform = 'scale(1.05)';
            setTimeout(() => {
                locationPin.style.transform = 'scale(1)';
            }, 500);
        }, 3000);
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Alt + N for new alarm
        if (e.altKey && e.key === 'n') {
            e.preventDefault();
            destinationInput.focus();
        }
        
        // Escape to clear form
        if (e.key === 'Escape') {
            resetForm();
        }
    });
});

console.log('🌍 GeoAlarm initialized successfully!');
