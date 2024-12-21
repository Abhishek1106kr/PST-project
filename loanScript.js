
// Mock API endpoint (replace with actual API endpoint in production)
const API_ENDPOINT = 'https://api.example.com/loans';

// Mock loan data (replace with API data in production)
const mockLoans = [
    {
        id: 1,
        bankName: 'Chase Bank',
        loanType: 'business',
        amount: 50000,
        interestRate: 8.5,
        tenure: 5,
        processingFee: 500,
        minCreditScore: 680
    },
    {
        id: 2,
        bankName: 'Bank of America',
        loanType: 'personal',
        amount: 25000,
        interestRate: 10.2,
        tenure: 3,
        processingFee: 300,
        minCreditScore: 650
    },
    // Add more mock data as needed
];

// Function to fetch loans from API
async function fetchLoans(filters = {}) {
    // In production, replace this with actual API call
    // const response = await fetch(`${API_ENDPOINT}?${new URLSearchParams(filters)}`);
    // const data = await response.json();
    
    // For demo, we'll filter mock data
    return mockLoans.filter(loan => {
        if (filters.loanType && filters.loanType !== loan.loanType) return false;
        if (filters.maxInterest && loan.interestRate > filters.maxInterest) return false;
        if (filters.tenure && loan.tenure > filters.tenure) return false;
        
        if (filters.amount) {
            const [min, max] = filters.amount.split('-').map(Number);
            if (max && (loan.amount < min || loan.amount > max)) return false;
            if (!max && loan.amount < min) return false;
        }
        
        return true;
    });
}

// Function to create loan card
function createLoanCard(loan) {
    return `
        <div class="loan-card">
            <div class="bank-info">
                <div class="bank-logo">${loan.bankName[0]}</div>
                <h3>${loan.bankName}</h3>
            </div>
            <div class="loan-details">
                <div class="loan-detail">
                    <span class="detail-label">Loan Amount:</span>
                    <span>$${loan.amount.toLocaleString()}</span>
                </div>
                <div class="loan-detail">
                    <span class="detail-label">Interest Rate:</span>
                    <span>${loan.interestRate}%</span>
                </div>
                <div class="loan-detail">
                    <span class="detail-label">Tenure:</span>
                    <span>${loan.tenure} years</span>
                </div>
                <div class="loan-detail">
                    <span class="detail-label">Processing Fee:</span>
                    <span>$${loan.processingFee}</span>
                </div>
                <div class="loan-detail">
                    <span class="detail-label">Min Credit Score:</span>
                    <span>${loan.minCreditScore}</span>
                </div>
            </div>
            <button class="apply-button" onclick="applyForLoan(${loan.id})">Apply Now</button>
        </div>
    `;
}

// Function to apply filters
async function applyFilters() {
    const filters = {
        loanType: document.getElementById('loanType').value,
        amount: document.getElementById('amount').value,
        maxInterest: document.getElementById('interest').value,
        tenure: document.getElementById('tenure').value
    };

    const loansGrid = document.getElementById('loansGrid');
    loansGrid.innerHTML = '<div class="loading">Loading loans...</div>';

    try {
        const loans = await fetchLoans(filters);
        loansGrid.innerHTML = loans.length ? 
            loans.map(loan => createLoanCard(loan)).join('') :
            '<div class="loading">No loans found matching your criteria.</div>';
    } catch (error) {
        loansGrid.innerHTML = '<div class="loading">Error loading loans. Please try again.</div>';
    }
}

// Function to reset filters
function resetFilters() {
    document.getElementById('loanType').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('interest').value = '';
    document.getElementById('tenure').value = '';
    applyFilters();
}

// Function to handle loan application
function applyForLoan(loanId) {
    console.log(`Applying for loan ${loanId}`);
    // Add your loan application logic here
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    applyFilters();
});

let plaidHandler = null;
        
// Initialize Plaid Link
async function initializePlaid() {
    try {
        const response = await fetch('/api/create-link-token');
        const { link_token } = await response.json();
        
        plaidHandler = Plaid.create({
            token: link_token,
            onSuccess: async (public_token, metadata) => {
                await handlePlaidSuccess(public_token, metadata);
            },
            onExit: (err, metadata) => {
                if (err != null) {
                    console.error('Plaid Link error:', err);
                }
            },
            onEvent: (eventName, metadata) => {
                console.log('Plaid Link event:', eventName);
            }
        });
    } catch (error) {
        console.error('Error initializing Plaid:', error);
    }
}

// Handle successful Plaid connection
async function handlePlaidSuccess(publicToken, metadata) {
    try {
        showLoading('Connecting to your bank...');
        
        // Exchange public token for access token
        const tokenResponse = await fetch('/api/exchange-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ public_token: publicToken })
        });
        
        const { access_token } = await tokenResponse.json();
        
        // Fetch loan data
        const loansResponse = await fetch('/api/get-loans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token })
        });
        
        const loans = await loansResponse.json();
        displayLoans(loans);
        
    } catch (error) {
        console.error('Error handling Plaid success:', error);
        alert('Error connecting to bank. Please try again.');
    } finally {
        hideLoading();
    }
}

// Connect bank button handler
function connectBank() {
    if (plaidHandler) {
        plaidHandler.open();
    }
}

// Display loans in the UI
function displayLoans(loans) {
    const loansGrid = document.getElementById('loansGrid');
    
    if (!loans.length) {
        loansGrid.innerHTML = '<div class="loading">No loans found.</div>';
        return;
    }

    const loanCards = loans.map(loan => createLoanCard({
        bankName: loan.account.institution_name,
        loanType: loan.loan_type,
        amount: loan.original_principal_balance,
        interestRate: loan.interest_rate,
        tenure: loan.term,
        processingFee: loan.origination_fee || 0,
        minCreditScore: loan.minimum_credit_score || 'N/A'
    })).join('');

    loansGrid.innerHTML = loanCards;
}

// Loading overlay functions
function showLoading(message) {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `<div>${message}</div>`;
    document.body.appendChild(overlay);
}

function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializePlaid();
});