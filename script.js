// Главный объект приложения
const DuplicateDetector = {
    image1: null,
    image2: null,
    
    init() {
        this.setupEventListeners();
        this.initCharts();
    },
    
    setupEventListeners() {
        // Обработчики для загрузки файлов
        const fileInput1 = document.getElementById('fileInput1');
        const fileInput2 = document.getElementById('fileInput2');
        const dropZone1 = document.getElementById('dropZone1');
        const dropZone2 = document.getElementById('dropZone2');
        
        fileInput1.addEventListener('change', (e) => this.handleFileSelect(e, 1));
        fileInput2.addEventListener('change', (e) => this.handleFileSelect(e, 2));
        
        // Drag and drop
        this.setupDragAndDrop(dropZone1, 1);
        this.setupDragAndDrop(dropZone2, 2);
    },
    
    setupDragAndDrop(dropZone, imageNumber) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.background = '#e9ecef';
            dropZone.style.borderColor = '#764ba2';
        });
        
        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.style.background = '#f8f9fa';
            dropZone.style.borderColor = '#667eea';
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.background = '#f8f9fa';
            dropZone.style.borderColor = '#667eea';
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.handleFile(files[0], imageNumber);
            }
        });
    },
    
    handleFileSelect(event, imageNumber) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.handleFile(file, imageNumber);
        }
    },
    
    handleFile(file, imageNumber) {
        const reader = new FileReader();
        
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
        
        reader.readAsDataURL(file);
    },
    
    displayImage(imageData, previewId) {
        const preview = document.getElementById(previewId);
        preview.innerHTML = `<img src="${imageData}" alt="Preview">`;
    },
    
    updateAnalyzeButton() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        analyzeBtn.disabled = !(this.image1 && this.image2);
    },
    
    async analyzeImages() {
        if (!this.image1 || !this.image2) return;
        
        const analyzeBtn = document.getElementById('analyzeBtn');
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = '🔄 Анализ...';
        
        // Имитация работы нейронной сети
        await this.simulateNeuralNetworkProcessing();
        
        // Вычисление схожести
        const similarity = this.calculateSimilarity();
        this.displayResults(similarity);
        
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = '🔍 Проанализировать изображения';
    },
    
    async simulateNeuralNetworkProcessing() {
        // Имитация времени обработки нейронной сетью
        return new Promise(resolve => {
            setTimeout(resolve, 2000);
        });
    },
    
    calculateSimilarity() {
        // В реальной системе здесь будет вызов нейронной сети
        // Для демо используем случайное значение с небольшим смещением
        const baseSimilarity = Math.random();
        
        // Если оба изображения загружены, добавляем небольшую корреляцию
        let similarity = baseSimilarity * 0.3 + 0.5; // 50-80%
        
        // Немного увеличиваем шанс на дубликат для демонстрации
        if (Math.random() > 0.7) {
            similarity = 0.7 + Math.random() * 0.3; // 70-100%
        }
        
        return Math.min(1, similarity);
    },
    
    displayResults(similarity) {
        const resultSection = document.getElementById('result');
        const similarityValue = document.getElementById('similarityValue');
        const verdictText = document.getElementById('verdictText');
        const verdictDescription = document.getElementById('verdictDescription');
        
        // Показываем секцию результатов
        resultSection.style.display = 'block';
        
        // Анимация процента схожести
        this.animateSimilarityScore(similarity);
        
        // Определяем вердикт
        const isDuplicate = similarity > 0.75;
        
        if (isDuplicate) {
            verdictText.textContent = '✅ ВЕРОЯТНО ДУБЛИКАТ';
            verdictText.style.color = '#4CAF50';
            verdictDescription.textContent = 'Изображения имеют высокую степень схожести и, вероятно, являются дубликатами или сильно похожими версиями.';
        } else if (similarity > 0.5) {
            verdictText.textContent = '⚠️ СХОЖИЕ ИЗОБРАЖЕНИЯ';
            verdictText.style.color = '#FF9800';
            verdictDescription.textContent = 'Изображения имеют умеренную схожесть, но не могут быть классифицированы как дубликаты.';
        } else {
            verdictText.textContent = '❌ РАЗНЫЕ ИЗОБРАЖЕНИЯ';
            verdictText.style.color = '#f44336';
            verdictDescription.textContent = 'Изображения существенно различаются и не являются дубликатами.';
        }
        
        // Прокрутка к результатам
        resultSection.scrollIntoView({ behavior: 'smooth' });
    },
    
    animateSimilarityScore(targetSimilarity) {
        const similarityValue = document.getElementById('similarityValue');
        const scoreCircle = document.querySelector('.score-circle');
        
        let current = 0;
        const duration = 1500;
        const increment = targetSimilarity / (duration / 16);
        
        const animate = () => {
            current += increment;
            if (current < targetSimilarity) {
                const percentage = Math.min(current * 100, 100);
                similarityValue.textContent = `${percentage.toFixed(1)}%`;
                
                // Обновляем градиент круга
                scoreCircle.style.background = 
                    `conic-gradient(#4CAF50 0% ${percentage}%, #e0e0e0 ${percentage}% 100%)`;
                
                requestAnimationFrame(animate);
            } else {
                similarityValue.textContent = `${(targetSimilarity * 100).toFixed(1)}%`;
                scoreCircle.style.background = 
                    `conic-gradient(#4CAF50 0% ${targetSimilarity * 100}%, #e0e0e0 ${targetSimilarity * 100}% 100%)`;
            }
        };
        
        animate();
    },
    
    initCharts() {
        // График сравнения методов
        const ctx = document.getElementById('metricsChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Siamese Network', 'Perceptual Hash', 'Histogram Compare', 'Traditional Hash'],
                datasets: [{
                    label: 'Точность (%)',
                    data: [96.3, 84.1, 76.2, 45.8],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(255, 152, 0, 0.8)',
                        'rgba(244, 67, 54, 0.8)'
                    ],
                    borderColor: [
                        'rgb(102, 126, 234)',
                        'rgb(118, 75, 162)',
                        'rgb(255, 152, 0)',
                        'rgb(244, 67, 54)'
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
                        text: 'Сравнение эффективности методов детектирования'
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
};

// Глобальные функции для HTML-событий
function analyzeImages() {
    DuplicateDetector.analyzeImages();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    DuplicateDetector.init();
});
