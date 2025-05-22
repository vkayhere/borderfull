document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const editorContainer = document.getElementById('editor-container');
    const thicknessButtons = document.querySelectorAll('.thickness-btn');
    const colorButtons = document.querySelectorAll('.color-btn');
    const downloadButton = document.getElementById('download-btn');
    
    // State variables
    let originalImage = null;
    let currentBorderThickness = 5;
    let currentBorderColor = '#000000';
    
    // Event listeners
    imageUpload.addEventListener('change', handleImageUpload);
    thicknessButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setActiveThickness(btn);
            applyBorder();
        });
    });
    
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setActiveColor(btn);
            applyBorder();
        });
    });
    
    downloadButton.addEventListener('click', downloadImage);
    
    // Set initial active buttons
    setActiveThickness(thicknessButtons[0]);
    setActiveColor(colorButtons[0]);
    
    // Functions
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            originalImage = new Image();
            originalImage.onload = function() {
                editorContainer.classList.remove('hidden');
                applyBorder();
            };
            originalImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    function setActiveThickness(button) {
        thicknessButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentBorderThickness = parseInt(button.dataset.thickness);
    }
    
    function setActiveColor(button) {
        colorButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentBorderColor = button.dataset.color;
    }
    
    function applyBorder() {
        if (!originalImage) return;
        
        // Clear previous preview
        imagePreview.innerHTML = '';
        
        // Create canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions with border
        const borderSize = currentBorderThickness * 2; // Border on all sides
        canvas.width = originalImage.width + borderSize;
        canvas.height = originalImage.height + borderSize;
        
        // Draw border (fill canvas with border color)
        ctx.fillStyle = currentBorderColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw image in the center
        ctx.drawImage(
            originalImage, 
            currentBorderThickness, 
            currentBorderThickness, 
            originalImage.width, 
            originalImage.height
        );
        
        // Append the canvas to the preview
        imagePreview.appendChild(canvas);
    }
    
    function downloadImage() {
        if (!originalImage) return;
        
        const canvas = imagePreview.querySelector('canvas');
        if (!canvas) return;
        
        // Create a temporary link
        const link = document.createElement('a');
        link.download = 'borderfull-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
}); 
