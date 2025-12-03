// app.js

// # Install http-server globally
// npm install -g http-server

// # Run from your project directory
// http-server -p 8000


class QnAApp {
    constructor() {
        this.mode = 'visualizer';
        this.visualizer = new Visualizer(this);
        this.questionMode = new QuestionMode(this);
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log("Subnetting Visualizer Initialized");
        this.setupEventListeners();
        this.showMode('visualizer');
    }

    setupEventListeners() {
        // Mode buttons
        document.getElementById('visualizerBtn').addEventListener('click', () => this.showMode('visualizer'));
        document.getElementById('questionBtn').addEventListener('click', () => this.showMode('question'));
        document.getElementById('instructionBtn').addEventListener('click', () => this.showMode('instruction'));

        // Visualizer inputs
        const inputs = ['ipAddress', 'subnetMask', 'secondIpAddress'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.visualizer.visualizeSubnet());
            }
        });

        // Question mode buttons
        const submitBtn = document.getElementById('submitAnswer');
        if (submitBtn) submitBtn.addEventListener('click', () => this.questionMode.checkAnswer());
        
        const nextBtn = document.getElementById('nextQuestion');
        if (nextBtn) nextBtn.addEventListener('click', () => this.questionMode.generateQuestion());
        
        const visualizeBtn = document.getElementById('visualizeQuestion');
        if (visualizeBtn) visualizeBtn.addEventListener('click', () => this.questionMode.visualizeCurrentQuestion());

        const userAnswer = document.getElementById('userAnswer');
        if (userAnswer) {
            userAnswer.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.questionMode.checkAnswer();
            });
        }
    }

    showMode(mode) {
        this.mode = mode;
        
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(mode + 'Btn').classList.add('active');
        
        document.querySelectorAll('.app-mode').forEach(el => el.classList.remove('active'));
        document.getElementById(mode + 'Mode').classList.add('active');

        if (mode === 'visualizer') {
            this.visualizer.visualizeSubnet();
        } else if (mode === 'question' && !this.questionMode.currentQuestion) {
            this.questionMode.generateQuestion();
        }
    }

    // Helper functions that can be shared
    calculateSubnet(ip, mask) {
        const ipOctets = ip.split('.').map(octet => parseInt(octet));
        const maskOctets = mask.split('.').map(octet => parseInt(octet));
        const networkOctets = ipOctets.map((octet, i) => octet & maskOctets[i]);
        return networkOctets.join('.');
    }

    calculateBroadcast(subnet, mask) {
        const subnetOctets = subnet.split('.').map(octet => parseInt(octet));
        const maskOctets = mask.split('.').map(octet => parseInt(octet));
        const broadcastOctets = subnetOctets.map((octet, i) => octet | (~maskOctets[i] & 255));
        return broadcastOctets.join('.');
    }

    calculateValidSubnets(mask) {
        const maskValue = parseInt(mask.split('.')[3]);
        const blockSize = 256 - maskValue;
        const subnets = [];
        for (let i = 0; i < 256; i += blockSize) {
            subnets.push(`192.168.1.${i}`);
        }
        return subnets;
    }

    checkSameNetwork(ip1, ip2, mask) {
        const network1 = this.calculateSubnet(ip1, mask);
        const network2 = this.calculateSubnet(ip2, mask);
        return network1 === network2;
    }

    updateInfoElement(id, value, className = '') {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            element.className = 'info-value'; // Reset classes
            if (className) {
                element.classList.add(className);
            }
        }
    }
}

// Initialize the app
new QnAApp();