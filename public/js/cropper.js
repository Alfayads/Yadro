// Get all necessary DOM elements
const imageInput = document.getElementById('imageInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');
const saveChanges = document.getElementById('saveChanges');
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const editControls = document.getElementById('editControls');

let cropper; // For storing the cropper instance
let currentImageIndex = null; // To keep track of the selected image for cropping
let selectedFile = null; // Stores the file selected for cropping

// Handle file input and preview
imageInput.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const files = event.target.files;
    const maxFiles = 4;
    const imageFiles = Array.from(files).slice(0, maxFiles); // Limit the number of images to 4

    imageFiles.forEach((file, index) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imageUrl = e.target.result;
            const imageDiv = document.createElement('div');
            imageDiv.classList.add('relative');

            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.classList.add('w-full', 'h-40', 'object-cover', 'cursor-pointer');
            imgElement.addEventListener('click', () => openCropModal(imageUrl, index));

            imageDiv.appendChild(imgElement);
            imagePreviewContainer.appendChild(imageDiv);
        };

        reader.readAsDataURL(file); // Convert file to base64 URL
    });
}

// Open the crop modal with the selected image
function openCropModal(imageUrl, index) {
    imageModal.classList.remove('hidden');
    modalImage.src = imageUrl;
    currentImageIndex = index;

    // Initialize cropper with the selected image
    cropper = new Cropper(modalImage, {
        aspectRatio: 1, // Example: Square crop
        viewMode: 2,
        autoCropArea: 1,
    });

    // Reset sliders and hide edit controls initially
    brightnessSlider.value = 0;
    contrastSlider.value = 0;
    editControls.classList.add('hidden');
}

// Close the crop modal
closeModal.addEventListener('click', () => {
    imageModal.classList.add('hidden');
    if (cropper) {
        cropper.destroy(); // Destroy the cropper instance when closing the modal
    }
});

// Apply changes and save the cropped image
saveChanges.addEventListener('click', () => {
    const canvas = cropper.getCroppedCanvas({
        width: 200, // Set the final image size (can be adjusted)
        height: 200
    });

    // Convert the cropped canvas to a data URL (base64 image)
    const croppedImageUrl = canvas.toDataURL('image/png');

    // Update the preview with the cropped image
    const previewImage = imagePreviewContainer.children[currentImageIndex].querySelector('img');
    previewImage.src = croppedImageUrl;

    // Optionally, you can store the cropped image as a Blob
    canvas.toBlob((blob) => {
        // Here, you can upload the blob (cropped image) to the server using AJAX or a form submission
        // Example: formData.append('croppedImage', blob);
    });

    imageModal.classList.add('hidden');
    cropper.destroy(); // Destroy the cropper instance after saving changes
});

// Optionally, add brightness and contrast adjustments
brightnessSlider.addEventListener('input', updateImageEffects);
contrastSlider.addEventListener('input', updateImageEffects);

function updateImageEffects() {
    const brightness = brightnessSlider.value;
    const contrast = contrastSlider.value;

    // Apply CSS filters for brightness and contrast
    modalImage.style.filter = `brightness(${1 + brightness / 100}) contrast(${1 + contrast / 100})`;
    editControls.classList.remove('hidden'); // Show edit controls
}
