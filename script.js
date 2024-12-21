
const loans = [
    {
        id: 1,
        type: 'Business Expansion',
        amount: 50000,
        nextPayment: '2024-12-28',
        paymentAmount: 2500
    },
    {
        id: 2,
        type: 'Equipment Purchase',
        amount: 25000,
        nextPayment: '2024-12-25',
        paymentAmount: 1700
    }
];
//this below code is for generating alerts 
function generateAlerts() {
    const alertsContainer = document.getElementById('alerts-container');
    loans.forEach(loan => {
        const dueDate = new Date(loan.nextPayment);
        const today = new Date();
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const alert = document.createElement('div');
        alert.className = diffDays <= 3 ? 'alert urgent' : 'alert warning';
        alert.innerHTML = `
            Payment of $${loan.paymentAmount} for ${loan.type} loan due in ${diffDays} days
            (${loan.nextPayment})
        `;
        alertsContainer.appendChild(alert);
    });
}

function createPaymentHistoryChart() {
    const ctx = document.getElementById('paymentHistoryChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Monthly Payments',
                data: [4200, 4200, 4200, 4200, 4200, 4200],
                borderColor: '#3498db',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

// Create Loan Distribution Chart
function createLoanDistributionChart() {
    const ctx = document.getElementById('loanDistributionChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: loans.map(loan => loan.type),
            datasets: [{
                data: loans.map(loan => loan.amount),
                backgroundColor: [
                    '#3498db',
                    '#2ecc71'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

// Initialize dashboard
generateAlerts();
createPaymentHistoryChart();
createLoanDistributionChart();


