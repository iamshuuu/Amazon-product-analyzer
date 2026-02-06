// Main application logic

let currentProduct = null;
let charts = {};
let currentSalesMetric = 'units';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Allow Enter key to trigger search
    document.getElementById('productUrl').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            analyzeProduct();
        }
    });
});

// Load example product
function loadExample(asin) {
    document.getElementById('productUrl').value = `https://amazon.com/dp/${asin}`;
    analyzeProduct();
}

// Main analyze function
async function analyzeProduct() {
    const urlInput = document.getElementById('productUrl').value.trim();

    if (!urlInput) {
        alert('Please enter an Amazon product URL');
        return;
    }

    // Parse ASIN from URL
    const asin = parseAmazonUrl(urlInput);

    if (!asin) {
        alert('Invalid Amazon URL. Please check and try again.');
        return;
    }

    // Show loading state
    showLoading();

    try {
        // Fetch real product data from API
        const productData = await apiClient.fetchProduct(asin);

        // Validate that we have usable product data
        if (!productData || !productData.title || productData.title === 'Product Title Not Found' || !productData.salesHistory) {
            hideLoading();
            alert(`Product not available.\n\nASIN: ${asin}\n\nThis product doesn't have fallback data.\nPlease try one of these example products:\n\n• AirPods Pro (B08N5WRWNW)\n• Samsung S24 Ultra (B0BSHF7WHW)`);
            return;
        }

        currentProduct = productData;

        // Display product data
        displayProductOverview(productData);
        displayQuickStats(productData);
        displaySalesChart(productData);
        displayPriceChart(productData);
        displayReviewAnalytics(productData);
        displayBSRChart(productData);
        displayListingQuality(productData);
        displayCompetitors(productData);

        // Hide loading, show results
        hideLoading();
        showResults();
    } catch (error) {
        hideLoading();

        console.error('Error analyzing product:', error);

        // Show user-friendly error message
        const errorMessage = error.message.includes('Failed to fetch')
            ? 'Cannot connect to server. Please make sure the backend server is running on http://localhost:3001'
            : `Error: ${error.message}`;

        alert(`Failed to analyze product.\n\n${errorMessage}\n\nASIN: ${asin}`);
    }
}

// Loading states
function showLoading() {
    document.getElementById('loadingContainer').classList.add('active');
    document.getElementById('resultsContainer').classList.remove('active');
    document.getElementById('searchBtnText').textContent = 'Analyzing...';
    document.querySelector('.search-btn').disabled = true;
}

function hideLoading() {
    document.getElementById('loadingContainer').classList.remove('active');
    document.getElementById('searchBtnText').textContent = 'Analyze';
    document.querySelector('.search-btn').disabled = false;
}

function showResults() {
    document.getElementById('resultsContainer').classList.add('active');
    // Smooth scroll to results
    document.getElementById('resultsContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function displayProductOverview(product) {
    document.getElementById('productImage').src = product.imageUrl;
    document.getElementById('productTitle').textContent = product.title;

    // Show notice if using fallback data
    if (product._meta && product._meta.dataSource === 'fallback') {
        let notice = document.getElementById('fallbackNotice');
        if (!notice) {
            notice = document.createElement('div');
            notice.id = 'fallbackNotice';
            notice.style.cssText = `
                margin-top: var(--spacing-sm);
                padding: var(--spacing-sm) var(--spacing-md);
                background: hsla(35, 95%, 60%, 0.15);
                border: 1px solid hsla(35, 95%, 60%, 0.3);
                border-radius: var(--radius-sm);
                font-size: 0.875rem;
                color: var(--warning);
            `;
            document.getElementById('productTitle').parentNode.insertBefore(notice, document.getElementById('productTitle').nextSibling);
        }
        notice.innerHTML = `
            <strong>⚠️ Note:</strong> ${product._meta.note}<br>
            <small>Amazon is blocking automated data collection. Showing demonstration data for this product.</small>
        `;
    } else {
        // Remove notice if it exists
        const existingNotice = document.getElementById('fallbackNotice');
        if (existingNotice) {
            existingNotice.remove();
        }
    }

    document.getElementById('productPrice').textContent = formatCurrency(product.price, product.currency);

    // Stars
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    document.getElementById('productStars').textContent = stars;
    document.getElementById('productRating').textContent = product.rating;
    document.getElementById('productReviews').textContent = `(${formatNumber(product.totalReviews)} reviews)`;

    // Badges
    document.getElementById('stockBadge').textContent = product.inStock ? '✓ In Stock' : '✗ Out of Stock';
    document.getElementById('bsrBadge').textContent = `#${product.bsr} in ${product.bsrCategory}`;

    const fakeReviewBadge = document.getElementById('fakeReviewBadge');
    fakeReviewBadge.textContent = `Fake Review Risk: ${product.fakeReviewRisk}`;
    if (product.fakeReviewRisk === 'Low') {
        fakeReviewBadge.className = 'badge badge-success';
    } else if (product.fakeReviewRisk === 'Medium') {
        fakeReviewBadge.className = 'badge badge-warning';
    } else {
        fakeReviewBadge.className = 'badge badge-danger';
    }
}

// Display quick stats
function displayQuickStats(product) {
    const totalSales = product.salesHistory.reduce((sum, item) => sum + item.units, 0);
    const avgMonthlySales = Math.round(totalSales / product.salesHistory.length);
    const totalRevenue = product.salesHistory.reduce((sum, item) => sum + item.revenue, 0);

    const avgPrice = product.priceHistory.reduce((sum, item) => sum + item.price, 0) / product.priceHistory.length;
    const lowestPrice = Math.min(...product.priceHistory.map(item => item.price));
    const currentDiscount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    const stats = [
        { label: 'Avg Monthly Sales', value: formatNumber(avgMonthlySales) + ' units' },
        { label: 'Total Revenue (12M)', value: formatCurrency(totalRevenue, product.currency) },
        { label: 'Current Discount', value: currentDiscount + '% OFF' },
        { label: 'Lowest Price (12M)', value: formatCurrency(lowestPrice, product.currency) }
    ];

    const statsHTML = stats.map(stat => `
    <div class="stat-card">
      <div class="stat-label">${stat.label}</div>
      <div class="stat-value">${stat.value}</div>
    </div>
  `).join('');

    document.getElementById('quickStats').innerHTML = statsHTML;
}

// Display sales chart
function displaySalesChart(product) {
    const ctx = document.getElementById('salesChart');

    // Destroy existing chart
    if (charts.sales) {
        charts.sales.destroy();
    }

    const labels = product.salesHistory.map(item => formatDate(item.month));
    const dataUnits = product.salesHistory.map(item => item.units);
    const dataRevenue = product.salesHistory.map(item => item.revenue);

    charts.sales = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Units Sold',
                data: dataUnits,
                borderColor: 'hsl(250, 80%, 60%)',
                backgroundColor: 'hsla(250, 80%, 60%, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'hsl(220, 25%, 15%)',
                    titleColor: 'hsl(220, 15%, 95%)',
                    bodyColor: 'hsl(220, 15%, 95%)',
                    borderColor: 'hsl(250, 80%, 60%)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return currentSalesMetric === 'units'
                                ? formatNumber(context.parsed.y) + ' units'
                                : formatCurrency(context.parsed.y, product.currency);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'hsla(220, 30%, 30%, 0.2)'
                    },
                    ticks: {
                        color: 'hsl(220, 10%, 70%)',
                        callback: function (value) {
                            return currentSalesMetric === 'units'
                                ? formatNumber(value)
                                : '$' + (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'hsl(220, 10%, 70%)'
                    }
                }
            }
        }
    });

    // Store data for toggle
    charts.sales.unitData = dataUnits;
    charts.sales.revenueData = dataRevenue;
}

// Toggle between units and revenue
function toggleSalesMetric(metric) {
    currentSalesMetric = metric;

    // Update button states
    document.querySelectorAll('.chart-control-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update chart data
    if (charts.sales) {
        charts.sales.data.datasets[0].data = metric === 'units'
            ? charts.sales.unitData
            : charts.sales.revenueData;
        charts.sales.data.datasets[0].label = metric === 'units' ? 'Units Sold' : 'Revenue';
        charts.sales.update();
    }
}

// Display price chart
function displayPriceChart(product) {
    const ctx = document.getElementById('priceChart');

    if (charts.price) {
        charts.price.destroy();
    }

    const labels = product.priceHistory.map(item => formatDate(item.date));
    const prices = product.priceHistory.map(item => item.price);

    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    document.getElementById('priceStats').innerHTML = `
    Avg: <strong>${formatCurrency(avgPrice, product.currency)}</strong> | 
    Min: <strong style="color: var(--success)">${formatCurrency(minPrice, product.currency)}</strong> | 
    Max: <strong style="color: var(--danger)">${formatCurrency(maxPrice, product.currency)}</strong>
  `;

    charts.price = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price',
                data: prices,
                borderColor: 'hsl(150, 70%, 50%)',
                backgroundColor: 'hsla(150, 70%, 50%, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'hsl(220, 25%, 15%)',
                    titleColor: 'hsl(220, 15%, 95%)',
                    bodyColor: 'hsl(220, 15%, 95%)',
                    borderColor: 'hsl(150, 70%, 50%)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return formatCurrency(context.parsed.y, product.currency);
                        }
                    }
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'hsla(220, 30%, 30%, 0.2)'
                    },
                    ticks: {
                        color: 'hsl(220, 10%, 70%)',
                        callback: function (value) {
                            return '$' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'hsl(220, 10%, 70%)'
                    }
                }
            }
        }
    });
}

// Display review analytics
function displayReviewAnalytics(product) {
    // Rating distribution
    const total = product.totalReviews;
    let distributionHTML = '';

    for (let i = 5; i >= 1; i--) {
        const count = product.reviewDistribution[i];
        const percentage = calculatePercentage(count, total);

        distributionHTML += `
      <div class="rating-bar">
        <div class="rating-label">${i} ★</div>
        <div class="bar">
          <div class="bar-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="rating-count">${formatNumber(count)}</div>
      </div>
    `;
    }

    document.getElementById('ratingDistribution').innerHTML = distributionHTML;

    // Sentiment
    const sentiment = product.sentiment;
    document.getElementById('sentimentScore').textContent = sentiment.positive + '%';
    document.getElementById('positivePercent').textContent = sentiment.positive + '%';
    document.getElementById('neutralPercent').textContent = sentiment.neutral + '%';
    document.getElementById('negativePercent').textContent = sentiment.negative + '%';

    // Set gauge colors
    const gaugeCircle = document.querySelector('.gauge-circle');
    const positiveAngle = (sentiment.positive / 100) * 360;
    const neutralAngle = positiveAngle + (sentiment.neutral / 100) * 360;

    gaugeCircle.style.setProperty('--positive-angle', positiveAngle + 'deg');
    gaugeCircle.style.setProperty('--neutral-angle', neutralAngle + 'deg');

    // Themes
    const positiveThemes = sentiment.themes.positive.map(theme =>
        `<span class="badge badge-success">${theme}</span>`
    ).join('');

    const negativeThemes = sentiment.themes.negative.map(theme =>
        `<span class="badge badge-danger">${theme}</span>`
    ).join('');

    document.getElementById('positiveThemes').innerHTML = positiveThemes;
    document.getElementById('negativeThemes').innerHTML = negativeThemes;
}

// Display BSR chart
function displayBSRChart(product) {
    const ctx = document.getElementById('bsrChart');

    if (charts.bsr) {
        charts.bsr.destroy();
    }

    const labels = product.bsrHistory.map(item => formatDate(item.date));
    const ranks = product.bsrHistory.map(item => item.rank);

    charts.bsr = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'BSR',
                data: ranks,
                borderColor: 'hsl(200, 90%, 55%)',
                backgroundColor: 'hsla(200, 90%, 55%, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'hsl(220, 25%, 15%)',
                    titleColor: 'hsl(220, 15%, 95%)',
                    bodyColor: 'hsl(220, 15%, 95%)',
                    borderColor: 'hsl(200, 90%, 55%)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return '#' + context.parsed.y;
                        }
                    }
                }
            },
            scales: {
                y: {
                    reverse: true, // Lower rank is better
                    grid: {
                        color: 'hsla(220, 30%, 30%, 0.2)'
                    },
                    ticks: {
                        color: 'hsl(220, 10%, 70%)',
                        callback: function (value) {
                            return '#' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'hsl(220, 10%, 70%)'
                    }
                }
            }
        }
    });
}

// Display listing quality
function displayListingQuality(product) {
    const quality = product.listingQuality;

    document.getElementById('qualityScore').textContent = quality.score + '/100';

    const factors = [
        { label: 'Title Optimization', value: quality.factors.titleOptimization },
        { label: 'Image Quality', value: quality.factors.imageQuality },
        { label: 'A+ Content', value: quality.factors.aPlusContent ? 'Yes' : 'No' },
        { label: 'Video Present', value: quality.factors.videoPresent ? 'Yes' : 'No' },
        { label: 'Bullet Points', value: quality.factors.bulletPoints + '/6' },
        { label: 'Description Length', value: quality.factors.descriptionLength + ' chars' }
    ];

    const factorsHTML = factors.map(factor => {
        let badgeClass = '';
        let displayValue = factor.value;

        if (typeof factor.value === 'number') {
            badgeClass = factor.value >= 90 ? 'badge-success' : factor.value >= 70 ? 'badge-warning' : 'badge-danger';
            displayValue = factor.value + '%';
        } else if (factor.value === 'Yes') {
            badgeClass = 'badge-success';
        } else if (factor.value === 'No') {
            badgeClass = 'badge-danger';
        }

        return `
      <div class="stat-card">
        <div class="stat-label">${factor.label}</div>
        <div class="stat-value">
          ${typeof factor.value === 'number' && factor.value <= 100
                ? `<span class="badge ${badgeClass}">${displayValue}</span>`
                : displayValue
            }
        </div>
      </div>
    `;
    }).join('');

    document.getElementById('qualityFactors').innerHTML = factorsHTML;
}

// Display competitors
function displayCompetitors(product) {
    const currentRow = `
    <tr class="current-product">
      <td><strong>${product.title.substring(0, 50)}...</strong> <span class="badge badge-info">Current</span></td>
      <td><strong>${formatCurrency(product.price, product.currency)}</strong></td>
      <td>${product.rating} ★</td>
      <td>${formatNumber(product.totalReviews)}</td>
      <td>#${product.bsr}</td>
    </tr>
  `;

    const competitorRows = product.competitors.map(comp => {
        const priceTrend = getTrend(product.price, comp.price);
        const ratingTrend = getTrend(product.rating, comp.rating);
        const bsrTrend = getTrend(comp.bsr, product.bsr); // Reversed: lower BSR is better

        return `
      <tr>
        <td>${comp.title.substring(0, 50)}...</td>
        <td>
          ${formatCurrency(comp.price, product.currency)}
          ${priceTrend === 'up' ? '<span class="metric-trend down">↓ Lower</span>' :
                priceTrend === 'down' ? '<span class="metric-trend up">↑ Higher</span>' : ''}
        </td>
        <td>
          ${comp.rating} ★
          ${ratingTrend === 'up' ? '<span class="metric-trend up">↑</span>' :
                ratingTrend === 'down' ? '<span class="metric-trend down">↓</span>' : ''}
        </td>
        <td>${formatNumber(comp.reviews)}</td>
        <td>
          #${comp.bsr}
          ${bsrTrend === 'up' ? '<span class="metric-trend up">↑ Better</span>' :
                bsrTrend === 'down' ? '<span class="metric-trend down">↓ Worse</span>' : ''}
        </td>
      </tr>
    `;
    }).join('');

    document.getElementById('competitorTable').innerHTML = currentRow + competitorRows;
}

// Show about modal
function showAbout() {
    alert('Amazon Product Intelligence Tool\n\nDemo Version with Mock Data\n\nThis tool demonstrates comprehensive product analysis including:\n- Sales estimation\n- Review analytics\n- Price tracking\n- Competitor comparison\n- Listing quality scoring\n\nBuilt with vanilla JavaScript, Chart.js, and love ❤️');
}
