// List of model folder names to check (하위 폴더 이름으로 업데이트)
const modelFolderNames = [
    'black hole', 'earth', 'jupiter', 'mars', 'mercury',
    'neptune', 'pluto', 'saturn', 'space shuttle', 'spear of adun', 'sun', 'uranus', 'venus'
];

// Object to store the measured sizes
const modelSizes = {};

// Function to measure the size of a single model
function measureModel(folderName) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.GLTFLoader();
        // 폴더 이름을 기반으로 모델 경로 생성 (예: sun/sun.glb)
        const modelName = folderName; // 모델 파일 이름은 폴더 이름과 동일하다고 가정
        const modelPath = `${folderName}/${modelName}.glb`; // model 폴더 기준 상대 경로

        loader.load(modelPath, (gltf) => {
            // Calculate bounding box
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const size = new THREE.Vector3();
            box.getSize(size);

            console.log(`Model: ${folderName}, Size:`, size);

            // Store the size
            modelSizes[folderName] = {
                width: size.x,
                height: size.y,
                depth: size.z,
                maxDim: Math.max(size.x, size.y, size.z)
            };

            resolve();
        }, undefined, (error) => {
            console.error(`Failed to load model ${folderName}:`, error);
            // 실패한 모델도 결과에 표시하기 위해 오류 정보 저장
            modelSizes[folderName] = { error: error.message };
            resolve(); // 에러가 발생해도 다음 모델을 계속 로드하기 위해 resolve
        });
    });
}

// Function to display results on the webpage
function displayResults() {
    const resultsDiv = document.getElementById('results');
    const statusDiv = document.getElementById('status');
    
    statusDiv.textContent = 'Measurement complete!';
    
    modelFolderNames.forEach(folderName => {
        const sizeInfo = modelSizes[folderName];
        const modelDiv = document.createElement('div');
        modelDiv.className = 'model-info';
        
        if (sizeInfo && !sizeInfo.error) {
            // 성공적으로 측정된 경우
            modelDiv.innerHTML = `
                <span class="model-name">${folderName}</span>
                <span class="size-info">(W: ${sizeInfo.width.toFixed(2)}, H: ${sizeInfo.height.toFixed(2)}, D: ${sizeInfo.depth.toFixed(2)}, Max: ${sizeInfo.maxDim.toFixed(2)})</span>
            `;
        } else if (sizeInfo && sizeInfo.error) {
            // 로드 실패한 경우
            modelDiv.innerHTML = `
                <span class="model-name">${folderName}</span>
                <span class="size-info" style="color: red;">(Error: ${sizeInfo.error})</span>
            `;
        } else {
            // 측정되지 않은 경우 (예상치 못한 상황)
            modelDiv.innerHTML = `
                <span class="model-name">${folderName}</span>
                <span class="size-info" style="color: orange;">(Not measured)</span>
            `;
        }
        resultsDiv.appendChild(modelDiv);
    });
}

// Main function to load and measure all models
async function init() {
    console.log("Starting model size measurement...");
    
    try {
        // Measure each model sequentially
        for (const folderName of modelFolderNames) {
            await measureModel(folderName);
        }
        
        console.log("All models measured:", modelSizes);
        displayResults();
        
    } catch (error) {
        console.error("An error occurred during measurement:", error);
        document.getElementById('status').textContent = 'An error occurred during measurement. Check the console for details.';
    }
}

// Start the process when the page loads
window.addEventListener('load', init);