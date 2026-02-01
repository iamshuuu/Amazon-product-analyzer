function showAbout() {
    let modal = document.getElementById('aboutModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'aboutModal';
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: hsla(0, 0%, 0%, 0.85);
            backdrop-filter: blur(15px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: var(--spacing-md);
        `;

        modal.innerHTML = `
            <div style="
                background: var(--glass-bg);
                backdrop-filter: blur(20px);
                border: 1px solid var(--glass-border);
                border-radius: 2rem;
                padding: var(--spacing-xl);
                max-width: 480px;
                max-height: 85vh;
                overflow-y: auto;
                width: 100%;
                box-shadow: var(--shadow-lg);
                position: relative;
            ">
                <button onclick="closeAbout()" style="
                    position: absolute;
                    top: var(--spacing-md);
                    right: var(--spacing-md);
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: all var(--transition-base);
                " onmouseover="this.style.color='var(--text-primary)'" onmouseout="this.style.color='var(--text-secondary)'">✕</button>
                
                <h2 style="margin-bottom: var(--spacing-md); background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Amazon Product Intelligence</h2>
                
                <div style="margin-bottom: var(--spacing-lg); color: var(--text-secondary); line-height: 1.8;">
                    <p style="margin-bottom: var(--spacing-sm);">A comprehensive product analysis tool with sales tracking, review insights, and competitive intelligence.</p>
                    
                    <div style="
                        margin: var(--spacing-lg) 0;
                        padding: var(--spacing-md);
                        background: hsla(0, 80%, 60%, 0.1);
                        border-left: 4px solid var(--danger);
                        border-radius: var(--radius-sm);
                    ">
                        <strong style="color: var(--danger);">⚠️ Educational Purpose Only</strong><br>
                        <span style="font-size: 0.9rem;">This tool was built to demonstrate web development skills and data visualization techniques. It uses simulated data for demo purposes. Not affiliated with Amazon. Don't be that person who thinks this is real Amazon sales data - it's a portfolio project, not a crystal ball. 🔮</span>
                    </div>
                    
                    <p style="margin-bottom: var(--spacing-sm);"><strong>Features:</strong></p>
                    <ul style="margin-left: var(--spacing-lg); margin-bottom: var(--spacing-md);">
                        <li>📊 Sales estimation & revenue tracking</li>
                        <li>⭐ Review analytics & sentiment analysis</li>
                        <li>💰 Price history monitoring</li>
                        <li>🎯 Competitor comparison</li>
                        <li>✅ Listing quality scoring</li>
                        <li>📈 BSR trend analysis</li>
                    </ul>
                    
                    <p style="font-size: 0.875rem; color: var(--text-tertiary);">Built with vanilla JavaScript, Chart.js, and an unhealthy amount of caffeine ☕</p>
                </div>
                
                <div style="
                    display: flex;
                    gap: var(--spacing-sm);
                    align-items: center;
                    padding-top: var(--spacing-md);
                    border-top: 1px solid var(--glass-border);
                ">
                    <span style="color: var(--text-secondary); font-size: 0.9rem;">Built by:</span>
                    <a href="https://x.com/imshuXP" target="_blank" rel="noopener noreferrer" style="
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        padding: 0.5rem 1rem;
                        background: linear-gradient(135deg, #1DA1F2, #0d8bd9);
                        color: white;
                        text-decoration: none;
                        border-radius: var(--radius-md);
                        font-weight: 600;
                        transition: all var(--transition-base);
                        box-shadow: 0 4px 12px rgba(29, 161, 242, 0.3);
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(29, 161, 242, 0.5)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(29, 161, 242, 0.3)'">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        @imshuXP
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAbout();
            }
        });
    } else {
        modal.style.display = 'flex';
    }
}

function closeAbout() {
    const modal = document.getElementById('aboutModal');
    if (modal) {
        modal.style.display = 'none';
    }
}
