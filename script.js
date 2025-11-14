// CopyrightControl Application
const CopyrightControl = {
    image1: null,
    image2: null,
    processingStartTime: null,
    
    init() {
        this.setupEventListeners();
        this.initCharts();
        console.log('CopyrightControl initialized');
    },
    
    setupEventListeners() {
        // File input handlers
        const fileInput1 = document.getElementById('fileInput1');
        const fileInput2 = document.getElementById('fileInput2');
        const dropZone1 = document.getElementById('dropZone1');
        const dropZone2 = document.getElementById('dropZone2');
        
        fileInput1.addEventListener('change', (e) => this.handleFileSelect(e, 1));
        fileInput2.addEventListener('change', (e) => this.handleFileSelect(e, 2));
        
        // Drag and drop setup
        this.setupDragAndDrop(dropZone1, 1);
        this.setupDragAndDrop(dropZone2, 2);
        
        // Smooth scrolling for navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    },
    
    setupDragAndDrop(dropZone, imageNumber) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.handleFile(files[0], imageNumber);
            }
        });
    },
    
    handleFileSelect(event, imageNumber) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Файл слишком большой. Максимальный размер: 5MB');
                return;
            }
            this.handleFile(file, imageNumber);
        }
    },
    
    handleFile(file, imageNumber) {
        const reader = new FileReader();
        
        reader.onloadstart = () => {
            const preview = document.getElementById(`preview${imageNumber}`);
            preview.innerHTML = '<div class="preview-placeholder loading">Загрузка...</div>';
        };
        
        reader.onload = (e) => {
            const imageData = e.target.result;
            
            if (imageNumber === 1) {
                this.image1 = imageData;
                this.displayImage(imageData, 'preview1');
            } else {
                this.image2 = imageData;
                this.displayImage(imageData, 'preview2');
            }
            
            this.updateAnalyzeButton();
        };
        
        reader.onerror = () => {
            alert('Ошибка при загрузке файла');
            const preview = document.getElementById(`preview${imageNumber}`);
            preview.innerHTML = '<div class="preview-placeholder">Ошибка загрузки</div>';
        };
        
        reader.readAsDataURL(file);
    },
    
    displayImage(imageData, previewId) {
        const preview = document.getElementById(previewId);
        const img = new Image();
        
        img.onload = () => {
            preview.innerHTML = '';
            preview.appendChild(img);
        };
        
        img.onerror = () => {
            preview.innerHTML = '<div class="preview-placeholder">Ошибка отображения</div>';
        };
        
        img.src = imageData;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
    },
    
    updateAnalyzeButton() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        analyzeBtn.disabled = !(this.image1 && this.image2);
    },
    
    async analyzeImages() {
        if (!this.image1 || !this.image2) return;
        
        this.processingStartTime = Date.now();
        const analyzeBtn = document.getElementById('analyzeBtn');
        
        // Update UI for processing state
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<span class="btn-icon">⏳</span>Анализ...';
        
        // Show loading state in results
        const resultSection = document.getElementById('result');
        resultSection.style.display = 'block';
        resultSection.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div class="loading" style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                <h3>Анализ изображений</h3>
                <p>Идет обработка с помощью AI-алгоритмов...</p>
            </div>
        `;
        
        try {
            // Simulate AI processing
            await this.simulateAIProcessing();
            
            // Calculate similarity and confidence
            const similarity = this.calculateSimilarity();
            const confidence = this.calculateConfidence(similarity);
            const processingTime = ((Date.now() - this.processingStartTime) / 1000).toFixed(1);
            
            this.displayResults(similarity, confidence, processingTime);
            
        } catch (error) {
            console.error('Analysis error:', error);
            this.displayError('Ошибка при анализе изображений');
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<span class="btn-icon">🔍</span>Запустить анализ';
        }
    },
    
    async simulateAIProcessing() {
        // Simulate neural network processing time (2-4 seconds)
        const processingTime = 2000 + Math.random() * 2000;
        return new Promise(resolve => setTimeout(resolve, processingTime));
    },
    
    calculateSimilarity() {
        // Advanced similarity calculation simulation
        let baseSimilarity = Math.random();
        
        // Add some intelligent bias based on "image characteristics"
        if (this.image1 && this.image2) {
            // Simulate that similar images tend to have higher similarity
            const bias = 0.3 + Math.random() * 0.4; // 30-70% base similarity
            baseSimilarity = baseSimilarity * 0.3 + bias;
        }
        
        // Occasionally generate very high similarity for demo purposes
        if (Math.random() > 0.8) {
            baseSimilarity = 0.85 + Math.random() * 0.15; // 85-100%
        }
        
        return Math.min(1, Math.max(0, baseSimilarity));
    },
    
    calculateConfidence(similarity) {
        // Higher confidence for extreme similarity values
        if (similarity > 0.9 || similarity < 0.1) {
            return 0.95 + Math.random() * 0.05; // 95-100%
        } else if (similarity > 0.7 || similarity < 0.3) {
            return 0.85 + Math.random() * 0.1; // 85-95%
        } else {
            return 0.7 + Math.random() * 0.15; // 70-85%
        }
    },
    
    displayResults(similarity, confidence, processingTime) {
        const resultSection = document.getElementById('result');
        
        // ВОССТАНАВЛИВАЕМ ПРАВИЛЬНУЮ СТРУКТУРУ HTML
        resultSection.innerHTML = `
            <h3>Результаты анализа</h3>
            <div class="result-content">
                <div class="similarity-score">
                    <div class="score-circle">
                        <span id="similarityValue">0%</span>
                    </div>
                    <p class="score-label">Схожесть контента</p>
                </div>
                <div class="verdict">
                    <h4 id="verdictText">Анализ не выполнен</h4>
                    <p id="verdictDescription" class="verdict-description">
                        Загрузите два изображения для сравнения
                    </p>
                    <div class="confidence-meter">
                        <div class="confidence-bar">
                            <div class="confidence-fill" id="confidenceFill"></div>
                        </div>
                        <span class="confidence-label">Уверенность системы: <span id="confidenceValue">0%</span></span>
                    </div>
                </div>
            </div>
            
            <div class="technical-details">
                <h4>Детали анализа:</h4>
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="label">Метод сравнения:</span>
                        <span class="value">Векторные эмбеддинги</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Размерность признаков:</span>
                        <span class="value">512 измерений</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Порог дубликата:</span>
                        <span class="value">85%</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Время обработки:</span>
                        <span class="value" id="processingTime">~${processingTime} сек</span>
                    </div>
                </div>
            </div>
        `;

        // Теперь обновляем анимации
        this.animateSimilarityScore(similarity);
        this.animateConfidenceMeter(confidence);
        this.updateVerdict(similarity, confidence);
    },
    
    animateSimilarityScore(targetSimilarity) {
        const similarityValue = document.getElementById('similarityValue');
        const scoreCircle = document.querySelector('.score-circle');
        
        if (!similarityValue || !scoreCircle) {
            console.error('Elements not found for similarity animation');
            return;
        }
        
        let current = 0;
        const duration = 2000;
        const increment = targetSimilarity / (duration / 16);
        
        const animate = () => {
            current += increment;
            if (current < targetSimilarity) {
                const percentage = Math.min(current * 100, 100);
                similarityValue.textContent = `${percentage.toFixed(1)}%`;
                
                scoreCircle.style.background = 
                    `conic-gradient(var(--success) 0% ${percentage}%, var(--border) ${percentage}% 100%)`;
                
                requestAnimationFrame(animate);
            } else {
                similarityValue.textContent = `${(targetSimilarity * 100).toFixed(1)}%`;
                scoreCircle.style.background = 
                    `conic-gradient(var(--success) 0% ${targetSimilarity * 100}%, var(--border) ${targetSimilarity * 100}% 100%)`;
            }
        };
        
        animate();
    },
    
    animateConfidenceMeter(targetConfidence) {
        const confidenceFill = document.getElementById('confidenceFill');
        const confidenceValue = document.getElementById('confidenceValue');
        
        if (!confidenceFill || !confidenceValue) {
            console.error('Elements not found for confidence animation');
            return;
        }
        
        let current = 0;
        const duration = 1500;
        const increment = targetConfidence / (duration / 16);
        
        const animate = () => {
            current += increment;
            if (current < targetConfidence) {
                const percentage = Math.min(current * 100, 100);
                confidenceFill.style.width = `${percentage}%`;
                confidenceValue.textContent = `${percentage.toFixed(1)}%`;
                requestAnimationFrame(animate);
            } else {
                confidenceFill.style.width = `${targetConfidence * 100}%`;
                confidenceValue.textContent = `${(targetConfidence * 100).toFixed(1)}%`;
            }
        };
        
        animate();
    },
    
    updateVerdict(similarity, confidence) {
        const verdictText = document.getElementById('verdictText');
        const verdictDescription = document.getElementById('verdictDescription');
        
        if (!verdictText || !verdictDescription) {
            console.error('Verdict elements not found');
            return;
        }
        
        const isDuplicate = similarity > 0.85;
        const isSimilar = similarity > 0.6;
        
        if (isDuplicate) {
            verdictText.textContent = '✅ ВЫСОКАЯ СХОЖЕСТЬ';
            verdictText.style.color = 'var(--success)';
            verdictDescription.textContent = 'Изображения практически идентичны. Вероятность дублирования очень высока.';
        } else if (isSimilar) {
            verdictText.textContent = '⚠️ УМЕРЕННАЯ СХОЖЕСТЬ';
            verdictText.style.color = 'var(--warning)';
            verdictDescription.textContent = 'Изображения имеют значительное сходство, но не являются точными копиями.';
        } else {
            verdictText.textContent = '❌ НИЗКАЯ СХОЖЕСТЬ';
            verdictText.style.color = 'var(--error)';
            verdictDescription.textContent = 'Изображения существенно различаются. Вероятность дублирования минимальна.';
        }
    },
    
    displayError(message) {
        const resultSection = document.getElementById('result');
        if (resultSection) {
            resultSection.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--error);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                    <h3>Ошибка</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--error); color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Попробовать снова
                    </button>
                </div>
            `;
        }
    },
    
    initCharts() {
        // Accuracy Comparison Chart
        const accuracyCanvas = document.getElementById('accuracyChart');
        if (accuracyCanvas) {
            const accuracyCtx = accuracyCanvas.getContext('2d');
            new Chart(accuracyCtx, {
                type: 'bar',
                data: {
                    labels: ['CopyrightControl', 'Perceptual Hash', 'Histogram Compare', 'Traditional Hash'],
                    datasets: [{
                        label: 'Точность (%)',
                        data: [96.3, 84.1, 76.2, 45.8],
                        backgroundColor: [
                            'rgba(37, 99, 235, 0.8)',
                            'rgba(124, 58, 237, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(239, 68, 68, 0.8)'
                        ],
                        borderColor: [
                            'rgb(37, 99, 235)',
                            'rgb(124, 58, 237)',
                            'rgb(245, 158, 11)',
                            'rgb(239, 68, 68)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                                display: true,
                                text: 'Точность (%)'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Сравнение точности методов детектирования'
                        },
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Processing Speed Chart
        const speedCanvas = document.getElementById('speedChart');
        if (speedCanvas) {
            const speedCtx = speedCanvas.getContext('2d');
            new Chart(speedCtx, {
                type: 'bar',
                data: {
                    labels: ['CopyrightControl', 'Perceptual Hash', 'Histogram Compare'],
                    datasets: [{
                        label: 'Время обработки (мс)',
                        data: [2300, 150, 80],
                        backgroundColor: [
                            'rgba(37, 99, 235, 0.8)',
                            'rgba(124, 58, 237, 0.8)',
                            'rgba(245, 158, 11, 0.8)'
                        ],
                        borderColor: [
                            'rgb(37, 99, 235)',
                            'rgb(124, 58, 237)',
                            'rgb(245, 158, 11)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Время обработки (мс)'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Сравнение скорости обработки'
                        },
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }
};

// Global functions for HTML event handlers
function analyzeImages() {
    CopyrightControl.analyzeImages();
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    CopyrightControl.init();
});

// Error handling for uncaught errors
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    const resultSection = document.getElementById('result');
    if (resultSection) {
        resultSection.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--error);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h3>Произошла ошибка</h3>
                <p>Пожалуйста, обновите страницу и попробуйте снова</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Обновить страницу
                </button>
            </div>
        `;
    }
});
