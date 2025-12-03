// question.js

class QuestionMode {
    constructor(app) {
        this.app = app;
        this.currentQuestion = null;
        this.score = 0;
        this.totalQuestions = 0;
    }

    generateQuestion() {
        const questionTypes = [
            'subnetCalculation', 'hostCount', 'sameNetwork', 
            'broadcastAddress', 'validSubnet'
        ];
        const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        this.currentQuestion = this.createQuestion(randomType);
        
        const questionText = document.getElementById('questionText');
        if (questionText) questionText.textContent = this.currentQuestion.question;
        
        const userAnswer = document.getElementById('userAnswer');
        if (userAnswer) userAnswer.value = '';
        
        const feedback = document.getElementById('questionFeedback');
        if (feedback) {
            feedback.textContent = '';
            feedback.className = 'feedback';
        }
    }

    createQuestion(type) {
        const masks = [
            { mask: '255.255.255.128', cidr: 25, hosts: 126, subnets: 2 },
            { mask: '255.255.255.192', cidr: 26, hosts: 62, subnets: 4 },
            { mask: '255.255.255.224', cidr: 27, hosts: 30, subnets: 8 },
            { mask: '255.255.255.240', cidr: 28, hosts: 14, subnets: 16 },
            { mask: '255.255.255.248', cidr: 29, hosts: 6, subnets: 32 },
            { mask: '255.255.255.252', cidr: 30, hosts: 2, subnets: 64 }
        ];
        const selectedMask = masks[Math.floor(Math.random() * masks.length)];
        const ip = `192.168.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 250) + 1}`;
        
        let questionData = {
            ip: ip,
            mask: selectedMask.mask
        };

        switch(type) {
            case 'subnetCalculation':
                questionData.question = `How many subnets does the mask ${selectedMask.mask} (/${selectedMask.cidr}) create for a Class C network?`;
                questionData.answer = selectedMask.subnets.toString();
                break;
            case 'hostCount':
                questionData.question = `How many usable hosts per subnet with mask ${selectedMask.mask} (/${selectedMask.cidr})?`;
                questionData.answer = selectedMask.hosts.toString();
                break;
            case 'sameNetwork':
                const ip2 = `192.168.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 250) + 1}`;
                const sameNetwork = this.app.checkSameNetwork(ip, ip2, selectedMask.mask);
                questionData.question = `Are ${ip} and ${ip2} on the same network with mask ${selectedMask.mask}? (yes/no)`;
                questionData.answer = sameNetwork ? 'yes' : 'no';
                questionData.secondIp = ip2;
                break;
            case 'broadcastAddress':
                const subnet = this.app.calculateSubnet(ip, selectedMask.mask);
                const broadcast = this.app.calculateBroadcast(subnet, selectedMask.mask);
                questionData.question = `What is the broadcast address for IP ${ip} with mask ${selectedMask.mask}?`;
                questionData.answer = broadcast;
                break;
            case 'validSubnet':
                const validSubnets = this.app.calculateValidSubnets(selectedMask.mask);
                const randomSubnet = validSubnets[Math.floor(Math.random() * validSubnets.length)];
                questionData.question = `Is ${randomSubnet} a valid subnet address for mask ${selectedMask.mask}? (yes/no)`;
                questionData.answer = 'yes';
                questionData.ip = randomSubnet;
                break;
            default:
                questionData = { 
                    question: "How many subnets does 255.255.255.192 create?", 
                    answer: "4",
                    ip: "192.168.1.1",
                    mask: "255.255.255.192"
                };
        }
        return questionData;
    }

    visualizeCurrentQuestion() {
        if (!this.currentQuestion) return;

        const ipInput = document.getElementById('ipAddress');
        const maskInput = document.getElementById('subnetMask');
        const secondIpInput = document.getElementById('secondIpAddress');

        if (ipInput) ipInput.value = this.currentQuestion.ip;
        if (maskInput) maskInput.value = this.currentQuestion.mask;
        
        if (secondIpInput) {
            secondIpInput.value = this.currentQuestion.secondIp || '';
        }

        this.app.showMode('visualizer');
    }

    checkAnswer() {
        if (!this.currentQuestion) return;
        
        const userAnswerInput = document.getElementById('userAnswer');
        const feedback = document.getElementById('questionFeedback');
        if (!userAnswerInput || !feedback) return;
        
        const userAnswer = userAnswerInput.value.trim().toLowerCase();
        const correctAnswer = this.currentQuestion.answer.toLowerCase();
        
        if (userAnswer === correctAnswer) {
            this.score++;
            feedback.textContent = 'Correct! Well done!';
            feedback.className = 'feedback correct';
        } else {
            feedback.textContent = `Incorrect. The correct answer is: ${correctAnswer}`;
            feedback.className = 'feedback incorrect';
        }
        
        this.totalQuestions++;
        this.updateScore();
    }

    updateScore() {
        const scoreElement = document.getElementById('score');
        const totalElement = document.getElementById('totalQuestions');
        if (scoreElement) scoreElement.textContent = this.score;
        if (totalElement) totalElement.textContent = this.totalQuestions;
    }
}
