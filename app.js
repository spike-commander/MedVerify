console.log('MedVerify: app.js loaded');


const appData = {
    "treatments": [
        {
            "id": "T001",
            "name": "Angioplasty",
            "details": "Surgical repair or unblocking of a blood vessel, especially a coronary artery.",
            "govt_price": 95000,
            "avg_private_price": 180000,
            "rules": "CGHS - Coronary Angioplasty with stent (inclusive of stent cost as per ceiling)."
        },
        {
            "id": "T002",
            "name": "Appendectomy",
            "details": "Surgical removal of the appendix.",
            "govt_price": 25000,
            "avg_private_price": 65000,
            "rules": "PM-JAY - Standard Laparoscopic Appendectomy package."
        },
        {
            "id": "T003",
            "name": "Cataract Surgery",
            "details": "Removal of the lens of the eye and replacement with an artificial lens.",
            "govt_price": 12000,
            "avg_private_price": 45000,
            "rules": "CGHS - IOL Implantation (Folder IOL) per eye."
        },
        {
            "id": "T004",
            "name": "Hernia Repair",
            "details": "Surgical operation for the correction of a hernia.",
            "govt_price": 35000,
            "avg_private_price": 85000,
            "rules": "PM-JAY - Inguinal Hernia (Unilateral) with Mesh."
        },
        {
            "id": "T005",
            "name": "Knee Replacement",
            "details": "Surgical procedure to replace the weight-bearing surfaces of the knee joint.",
            "govt_price": 160000,
            "avg_private_price": 350000,
            "rules": "CGHS - Total Knee Replacement (Unilateral) including implant."
        }
    ],
    "bills": [
        {
            "bill_no": "BILL-101",
            "patient": "John Doe",
            "hospital": "City Care Hospital",
            "treatment_id": "T001",
            "hospital_charge": 195000
        },
        {
            "bill_no": "BILL-102",
            "patient": "Jane Smith",
            "hospital": "Global Health Center",
            "treatment_id": "T002",
            "hospital_charge": 72000
        },
        {
            "bill_no": "BILL-103",
            "patient": "Robert Brown",
            "hospital": "Apex Medical Institute",
            "treatment_id": "T003",
            "hospital_charge": 55000
        }
    ]
};

function initApp() {
    console.log('MedVerify: Initializing App');
    const data = appData;

    const billInput = document.getElementById('bill-input');
    const verifyBtn = document.getElementById('verify-btn');
    const statusIndicator = document.getElementById('status-indicator');
    const resultsSection = document.getElementById('results');
    const billResultCard = document.getElementById('bill-result-card');
    const treatmentSearch = document.getElementById('treatment-search');
    const pricingGrid = document.getElementById('pricing-grid');

    if (!verifyBtn || !pricingGrid) {
        console.error('MedVerify: Required elements not found!', { verifyBtn, pricingGrid });
        return;
    }

    renderPricingList(data.treatments);

    // Handle Bill Verification
    verifyBtn.onclick = () => {
        console.log('MedVerify: Verify Button Clicked');
        const billNo = billInput.value.trim().toUpperCase();
        console.log('MedVerify: Bill No:', billNo);
        if (!billNo) return;

        statusIndicator.classList.remove('hidden');
        resultsSection.classList.add('hidden');

        setTimeout(() => {
            const bill = data.bills.find(b => b.bill_no === billNo);
            statusIndicator.classList.add('hidden');

            if (bill) {
                console.log('MedVerify: Bill Found', bill);
                const treatment = data.treatments.find(t => t.id === bill.treatment_id);
                renderBillResult(bill, treatment);
                resultsSection.classList.remove('hidden');
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.warn('MedVerify: Bill Not Found');
                alert('Bill number not found. Please try BILL-101, BILL-102, or BILL-103.');
            }
        }, 1000);
    };

    // Handle Treatment Search
    treatmentSearch.oninput = (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = data.treatments.filter(t =>
            t.name.toLowerCase().includes(query) ||
            t.details.toLowerCase().includes(query)
        );
        renderPricingList(filtered);
    };

    function renderBillResult(bill, treatment) {
        const diff = bill.hospital_charge - treatment.govt_price;
        const isOvercharged = diff > 0;

        billResultCard.innerHTML = `
            <h3>Verification Result for ${bill.bill_no}</h3>
            <p style="margin-bottom: 1.5rem">Patient: <strong>${bill.patient}</strong> | Hospital: <strong>${bill.hospital}</strong></p>
            <div class="treatment-header">
                <h4>Recognized Treatment: ${treatment.name}</h4>
                <p>${treatment.details}</p>
            </div>
            <div class="treatment-info">
                <div class="price-box private-price">
                    <div class="price-label">Hospital Bill Amount</div>
                    <div class="price-amount">₹${bill.hospital_charge.toLocaleString()}</div>
                </div>
                <div class="price-box govt-price">
                    <div class="price-label">Govt. Mandated Rate (CGHS)</div>
                    <div class="price-amount">₹${treatment.govt_price.toLocaleString()}</div>
                </div>
            </div>
            <div style="margin-top: 2rem; padding: 1.5rem; border-radius: 16px; background: ${isOvercharged ? 'rgba(248, 113, 113, 0.1)' : 'rgba(74, 222, 128, 0.1)'}; border: 1px solid ${isOvercharged ? 'var(--danger)' : 'var(--success)'}">
                <h4 style="color: ${isOvercharged ? 'var(--danger)' : 'var(--success)'}">
                    ${isOvercharged ? '⚠️ Potential Overcharge Detected' : '✅ Price Compliant'}
                </h4>
                <p style="margin-top: 0.5rem">
                    ${isOvercharged
                ? `The hospital has charged ₹${diff.toLocaleString()} more than the government mandated rate for this treatment under ${treatment.rules}.`
                : `The hospital charges are within the government mandated limits for this treatment.`}
                </p>
            </div>
        `;
    }

    function renderPricingList(treatments) {
        pricingGrid.innerHTML = treatments.map(t => `
            <div class="glass-card pricing-card">
                <h4>${t.name}</h4>
                <p>${t.details}</p>
                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                        <div class="price-label">Govt. Rate</div>
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary)">₹${t.govt_price.toLocaleString()}</div>
                    </div>
                    <div class="savings-badge">
                        Save ~${Math.round((1 - t.govt_price / t.avg_private_price) * 100)}%
                    </div>
                </div>
                <div style="margin-top: 1rem; font-size: 0.75rem; color: var(--text-muted); border-top: 1px solid var(--glass-border); padding-top: 0.5rem;">
                    Rule: ${t.rules}
                </div>
            </div>
        `).join('');
    }
}

// Robust initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

