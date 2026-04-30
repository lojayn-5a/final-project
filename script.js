let currentH, currentS, currentL;

// Load palette immediately when page opens
window.onload = function() {
    displayPalette();
};

function initColor(h, name, lightText, darkText) {
    currentH = h;
    currentS = 70; 
    currentL = 85; 
    updateUI();
    
    document.getElementById('light-btn').innerText = lightText;
    document.getElementById('dark-btn').innerText = darkText;
    document.getElementById('base-selector').style.display = 'none';
    document.getElementById('controls').style.display = 'block';
    document.getElementById('title').innerText = name;
}

function adjustLight(amount) {
    currentL = Math.min(Math.max(currentL + amount, 15), 95);
    updateUI();
}

function updateUI() {
    // Calculate HSL
    const hslColor = `hsl(${currentH}, ${currentS}%, ${currentL}%)`;
    document.body.style.backgroundColor = hslColor;
    
    // Convert to Hex for display
    const hex = hslToHex(currentH, currentS, currentL);
    document.getElementById('hex-display').innerText = hex;
}

function saveToPalette() {
    const hex = hslToHex(currentH, currentS, currentL);
    let palette = JSON.parse(localStorage.getItem('myPalette')) || [];
    palette.push(hex);
    localStorage.setItem('myPalette', JSON.stringify(palette));
    displayPalette();
}

function displayPalette() {
    const display = document.getElementById('palette-display');
    display.innerHTML = '';
    let palette = JSON.parse(localStorage.getItem('myPalette')) || [];
    
    palette.forEach((color, index) => {
        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = color;
        swatch.onclick = () => {
            palette.splice(index, 1);
            localStorage.setItem('myPalette', JSON.stringify(palette));
            displayPalette();
        };
        display.appendChild(swatch);
    });
}

function goBack() {
    document.getElementById('base-selector').style.display = 'flex';
    document.getElementById('controls').style.display = 'none';
    document.getElementById('title').innerText = "What's your color Base?";
    document.body.style.backgroundColor = "#fdfcfb";
}

// Helper function to turn HSL into HEX
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}