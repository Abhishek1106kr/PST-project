
        const myLoans = [
            {
                id: 1,
                type: 'Business Expansion',
                amount: 50000,
                remainingAmount: 35000,
                interest: 12,
                tenure: 24,
                monthsLeft: 18,
                status: 'Active',
                nextPayment: '2024-12-28',
                monthlyPayment: 2500
            },
            {
                id: 2,
                type: 'Equipment Purchase',
                amount: 25000,
                remainingAmount: 15000,
                interest: 10,
                tenure: 12,
                monthsLeft: 7,
                status: 'Active',
                nextPayment: '2024-12-25',
                monthlyPayment: 1700
            }
        ];

        function createLoanCard(loan) {
            const progressPercentage = ((loan.tenure - loan.monthsLeft) / loan.tenure) * 100;
            
            const cardHTML = `
                <div class="loan-card">
                    <div class="loan-header">
                        <div class="loan-title">${loan.type} Loan</div>
                        <span class="loan-status status-${loan.status.toLowerCase()}">${loan.status}</span>
                    </div>
                    <div class="loan-content">
                        <div class="loan-details">
                            <div class="detail-item">
                                <div class="detail-label">Loan Amount</div>
                                <div class="detail-value">$${loan.amount.toLocaleString()}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Interest Rate</div>
                                <div class="detail-value">${loan.interest}%</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Loan Tenure</div>
                                <div class="detail-value">${loan.tenure} months</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Monthly Payment</div>
                                <div class="detail-value">$${loan.monthlyPayment}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Next Payment</div>
                                <div class="detail-value">${loan.nextPayment}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Progress</div>
                                <div class="detail-value">${Math.round(progressPercentage)}% Complete</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="pieChart${loan.id}"></canvas>
                        </div>
                    </div>
                </div>
            `;

            return cardHTML;
        }

        function createPieChart(loanId, remainingAmount, paidAmount) {
            const ctx = document.getElementById(`pieChart${loanId}`).getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Remaining Amount', 'Paid Amount'],
                    datasets: [{
                        data: [remainingAmount, paidAmount],
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
                            position: 'bottom',
                        }
                    }
                }
            });
        }

        // Initialize the page
        function initializeLoansPage() {
            const container = document.getElementById('loanCardsContainer');
            
            myLoans.forEach(loan => {
                container.innerHTML += createLoanCard(loan);
                const paidAmount = loan.amount - loan.remainingAmount;
                createPieChart(loan.id, loan.remainingAmount, paidAmount);
            });
        }

        // Initialize when the page loads
        window.onload = initializeLoansPage;

        
    