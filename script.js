let currentH, currentS, currentL, currentShape, currentName;

window.onload = () => {
    displayPalette();
    resetButtonToSave();
};

function initColor(h, name, lightText, darkText, shapeClass) {
    currentH = h; currentS = 70; currentL = 85; 
    currentShape = shapeClass; currentName = name;
    
    updateUI();
    
    document.getElementById('light-btn').innerText = lightText;
    document.getElementById('light-btn').onclick = () => adjustLight(7);
    document.getElementById('dark-btn').innerText = darkText;
    document.getElementById('dark-btn').onclick = () => adjustLight(-7);
    
    resetButtonToSave();
    document.getElementById('base-selector').style.display = 'none';
    document.getElementById('controls').style.display = 'block';
    document.getElementById('title').innerText = name;
}

function adjustLight(amount) {
    currentL = Math.min(Math.max(currentL + amount, 15), 95);
    updateUI();
    resetButtonToSave();
}

function updateUI() {
    const hex = hslToHex(currentH, currentS, currentL);
    document.body.style.backgroundColor = hex;
    const preview = document.getElementById('vibe-shape');
    preview.className = 'vibe-preview ' + currentShape;
    preview.style.backgroundColor = hex;
    document.getElementById('hex-display').innerText = hex;
}

function saveToPalette() {
    const hex = hslToHex(currentH, currentS, currentL);
    let palette = JSON.parse(localStorage.getItem('myPalette')) || [];
    palette.push({ hex, h: currentH, s: currentS, l: currentL, shape: currentShape, name: currentName });
    localStorage.setItem('myPalette', JSON.stringify(palette));
    displayPalette();
    
    const btn = document.getElementById('main-action-btn');
    btn.innerText = "Saved! ✨";
    setTimeout(() => { btn.innerText = "Save to Palette"; }, 1000);
}

function displayPalette() {
    const display = document.getElementById('palette-display');
    display.innerHTML = '';
    let palette = JSON.parse(localStorage.getItem('myPalette')) || [];
    palette.forEach((colorObj, index) => {
        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = colorObj.hex;
        swatch.onclick = () => loadSwatchForEditing(index);
        display.appendChild(swatch);
    });
}

function loadSwatchForEditing(index) {
    let palette = JSON.parse(localStorage.getItem('myPalette')) || [];
    const color = palette[index];
    
    currentH = color.h; currentS = color.s; currentL = color.l; 
    currentShape = color.shape; currentName = color.name;
    
    updateUI();

    const actionBtn = document.getElementById('main-action-btn');
    actionBtn.innerText = "Remove from Palette";
    actionBtn.style.background = "#ff4d4d";
    actionBtn.onclick = () => removeFromPalette(index);
    
    document.getElementById('base-selector').style.display = 'none';
    document.getElementById('controls').style.display = 'block';
    document.getElementById('title').innerText = "Saved " + currentName;
}

function resetButtonToSave() {
    const actionBtn = document.getElementById('main-action-btn');
    actionBtn.innerText = "Save to Palette";
    actionBtn.style.background = "#555";
    actionBtn.onclick = saveToPalette;
}

function removeFromPalette(index) {
    let palette = JSON.parse(localStorage.getItem('myPalette')) || [];
    palette.splice(index, 1);
    localStorage.setItem('myPalette', JSON.stringify(palette));
    displayPalette();
    goBack();
}

function goBack() {
    document.getElementById('base-selector').style.display = 'flex';
    document.getElementById('controls').style.display = 'none';
    document.getElementById('title').innerText = "What's your color Base?";
    document.body.style.backgroundColor = "#fdfcfb";
    resetButtonToSave();
}

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