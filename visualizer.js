// visualizer.js

class Visualizer {
    constructor(app) {
        this.app = app;
        this.isDragging = false;
        this.dragSlider = document.getElementById('drag-slider');
        this.maskSlider = document.getElementById('mask-slider');
        this.binaryContainer = document.querySelector('.binary-comparison');
        this.sliderInfo = document.getElementById('slider-info-display');
        this.selectedBitsDisplay = document.getElementById('selected-bits');
        this.possibleValuesDisplay = document.getElementById('possible-values');

        this.setupSliderEvents();
    }

    setupSliderEvents() {
        if (!this.dragSlider) return;

        this.dragSlider.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragSlider.style.transition = 'none'; // Disable transition during drag
            document.body.style.cursor = 'ew-resize';
        });

        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.dragSlider.style.transition = ''; // Re-enable transition
                document.body.style.cursor = 'default';
                this.updateSliderInfo();
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const binaryDisplayEl = document.getElementById('ipBinary');
            if (!binaryDisplayEl) return;

            const firstBit = binaryDisplayEl.querySelector('.binary-segment');
            if (!firstBit) return;

            const firstBitRect = firstBit.getBoundingClientRect();
            const containerRect = this.binaryContainer.getBoundingClientRect();
            const startOffset = firstBitRect.left - containerRect.left;
            
            const singleBitWidth = firstBit.offsetWidth;
            if (singleBitWidth === 0) return;

            // Mouse position relative to the start of the first bit
            let newX = e.clientX - firstBitRect.left;

            // --- Snap Logic ---
            const snapIndex = Math.round(newX / singleBitWidth);
            let snappedX = snapIndex * singleBitWidth;

            // Constrain the slider
            const maxSnapIndex = 32;
            snappedX = Math.max(0, Math.min(snappedX, maxSnapIndex * singleBitWidth));

            // Final position is offset by the display's position within the container
            const finalX = startOffset + snappedX;

            this.dragSlider.style.left = `${finalX}px`;
            this.updateSliderInfo();
        });
    }

    updateSliderPositions(maskBinary) {
        const fullBinary = maskBinary.join('');
        let networkBits = 0;
        for (let i = 0; i < fullBinary.length; i++) {
            if (fullBinary[i] === '1') networkBits++;
            else break;
        }

        const binaryDisplayEl = document.getElementById('ipBinary');
        if (!binaryDisplayEl) return;
        
        const firstBit = binaryDisplayEl.querySelector('.binary-segment');
        if (!firstBit) return;

        const firstBitRect = firstBit.getBoundingClientRect();
        const containerRect = this.binaryContainer.getBoundingClientRect();

        // The starting offset is the first bit's position relative to the main container.
        const startOffset = firstBitRect.left - containerRect.left;
        
        // The width of a single bit is just its own offsetWidth.
        const singleBitWidth = firstBit.offsetWidth;
        
        // The position is the start offset + (number of bits * width of each bit)
        const maskPosition = startOffset + (networkBits * singleBitWidth);

        this.maskSlider.style.left = `${maskPosition}px`;

        if (!this.isDragging) {
            this.dragSlider.style.left = this.maskSlider.style.left;
        }
        this.updateSliderInfo();
    }
    
    updateSliderInfo() {
        const binaryDisplayEl = document.getElementById('ipBinary');
        if (!binaryDisplayEl) return;

        const firstBit = binaryDisplayEl.querySelector('.binary-segment');
        if (!firstBit) return;

        const firstBitRect = firstBit.getBoundingClientRect();
        const containerRect = this.binaryContainer.getBoundingClientRect();
        const startOffset = firstBitRect.left - containerRect.left;

        const maskPos = parseFloat(this.maskSlider.style.left) - startOffset;
        const dragPos = parseFloat(this.dragSlider.style.left) - startOffset;
        
        const singleBitWidth = firstBit.offsetWidth;

        // Prevent division by zero if width is 0
        if (singleBitWidth === 0) return;

        const startBit = Math.round(Math.min(maskPos, dragPos) / singleBitWidth);
        const endBit = Math.round(Math.max(maskPos, dragPos) / singleBitWidth);
        
        const selectedBits = endBit - startBit;
        const possibleValues = Math.pow(2, selectedBits);

        this.selectedBitsDisplay.textContent = selectedBits;
        this.possibleValuesDisplay.textContent = possibleValues.toLocaleString();
        this.sliderInfo.style.display = 'block';
    }

    visualizeSubnet() {
        const ipAddress = document.getElementById('ipAddress')?.value;
        const subnetMask = document.getElementById('subnetMask')?.value;
        const secondIpAddress = document.getElementById('secondIpAddress')?.value;
        
        if (!ipAddress || !subnetMask) return;
        
        try {
            this.displayIPAndSubnet(ipAddress, subnetMask, secondIpAddress);
            this.calculateNetworkInfo(ipAddress, subnetMask, secondIpAddress);
            
            const maskBinary = this.ipToBinary(subnetMask);
            this.updateSliderPositions(maskBinary);

        } catch (error) {
            console.error('Error:', error);
            const divisionElement = document.getElementById('networkDivision');
            if (divisionElement) {
                divisionElement.textContent = 'Invalid IP or Subnet Mask';
            }
        }
    }

    displayIPAndSubnet(ipAddress, subnetMask, secondIpAddress) {
        const ipBinary = this.ipToBinary(ipAddress);
        const maskBinary = this.ipToBinary(subnetMask);
        
        const positionIndicatorElement = document.getElementById('positionIndicator');
        if (positionIndicatorElement) {
            positionIndicatorElement.innerHTML = this.generatePositionIndicator('.');
        }
        
        const ipBinaryElement = document.getElementById('ipBinary');
        if (ipBinaryElement) {
            ipBinaryElement.innerHTML = this.formatBinaryWithClasses(ipBinary, '.');
        }
        
        const maskBinaryElement = document.getElementById('maskBinary');
        if (maskBinaryElement) {
            maskBinaryElement.innerHTML = this.formatBinaryWithNetworkHost(maskBinary, '.');
        }
        
        const secondIpRow = document.getElementById('secondIpRow');
        const secondIpBinaryElement = document.getElementById('secondIpBinary');
        
        if (secondIpAddress && secondIpAddress.trim() !== '') {
            try {
                const secondIpBinary = this.ipToBinary(secondIpAddress);
                if (secondIpBinaryElement) {
                    secondIpBinaryElement.innerHTML = this.formatBinaryWithClasses(secondIpBinary, '.');
                }
                if (secondIpRow) {
                    secondIpRow.style.display = 'flex';
                    
                    const isSameNetwork = this.app.checkSameNetwork(ipAddress, secondIpAddress, subnetMask);
                    if (!isSameNetwork) {
                        secondIpRow.classList.add('second-ip-different');
                    } else {
                        secondIpRow.classList.remove('second-ip-different');
                    }
                }
            } catch (error) {
                if (secondIpBinaryElement) secondIpBinaryElement.textContent = 'Invalid IP';
                if (secondIpRow) secondIpRow.style.display = 'flex';
            }
        } else if (secondIpRow) {
            secondIpRow.style.display = 'none';
        }
        
        this.showNetworkDivision(maskBinary);
    }

    calculateNetworkInfo(ipAddress, subnetMask, secondIpAddress) {
        const ipOctets = ipAddress.split('.').map(octet => parseInt(octet));
        const maskOctets = subnetMask.split('.').map(octet => parseInt(octet));
        
        const ipClassLetter = this.getIPClass(ipOctets[0]);
    
        const defaultMask = this.getDefaultMask(ipClassLetter);
        
        let ipClassDisplay = (ipClassLetter === 'Unknown') ? 'Unknown' : `Class ${ipClassLetter}`;
        
        if (defaultMask !== '-') {
            ipClassDisplay += ` (Default: ${defaultMask})`;
        }

        this.app.updateInfoElement('ipClass', ipClassDisplay, `ip-class-${ipClassLetter.toLowerCase()}`);

        const networkOctets = ipOctets.map((octet, i) => octet & maskOctets[i]);
        const networkAddress = networkOctets.join('.');
        this.app.updateInfoElement('networkAddress', networkAddress);

        const hostBits = this.countZeroBits(maskOctets.join('.'));
        const usableHosts = Math.pow(2, hostBits) - 2;
        this.app.updateInfoElement('usableHosts', usableHosts > 0 ? usableHosts : 0);

        const cidr = this.countOneBits(maskOctets.join('.'));
        this.app.updateInfoElement('cidrNotation', `/${cidr}`);

        this.checkAndDisplaySameNetwork(ipAddress, secondIpAddress, subnetMask);
    }

    checkAndDisplaySameNetwork(ip1, ip2, mask) {
        const sameNetworkItem = document.getElementById('sameNetworkItem');
        if (ip2 && ip2.trim() !== '') {
            const isSame = this.app.checkSameNetwork(ip1, ip2, mask);
            this.app.updateInfoElement('sameNetwork', isSame ? 'Yes' : 'No', isSame ? 'same-network-true' : 'same-network-false');
            sameNetworkItem.style.display = 'flex';
        } else {
            sameNetworkItem.style.display = 'none';
        }
    }

    // Helper methods
    ipToBinary(ipAddress) {
        const octets = ipAddress.split('.');
        if (octets.length !== 4) throw new Error('Invalid IP address format');
        return octets.map(octet => {
            const decimal = parseInt(octet, 10);
            if (isNaN(decimal) || decimal < 0 || decimal > 255) throw new Error('Invalid IP octet: ' + octet);
            return decimal.toString(2).padStart(8, '0');
        });
    }

    formatBinaryWithClasses(binaryArray, separator) {
        return binaryArray.map(segment => {
            return segment.split('').map(bit => {
                const cssClass = bit === '1' ? 'binary-1' : 'binary-0';
                return `<span class="binary-segment ${cssClass}">${bit}</span>`;
            }).join('');
        }).join('');
    }

    generatePositionIndicator(separator) {
        const positionValues = [128, 64, 32, 16, 8, 4, 2, 1];
        const octets = [];
        for (let i = 0; i < 4; i++) {
            const octetValues = positionValues.map(val => `<span class="binary-segment position-value">${val}</span>`).join('');
            octets.push(octetValues);
        }
        return octets.join('');
    }

    formatBinaryWithNetworkHost(binaryArray, separator) {
        const fullBinary = binaryArray.join('');
        let networkBits = 0;
        for (let i = 0; i < fullBinary.length; i++) {
            if (fullBinary[i] === '1') networkBits++;
            else break;
        }

        let bitIndex = 0;
        const formattedOctets = binaryArray.map(octet => {
            const bits = octet.split('').map(bit => {
                let cssClass = bitIndex < networkBits ? 'network-bit' : 'host-bit';
                bitIndex++;
                return `<span class="binary-segment ${cssClass}">${bit}</span>`;
            });
            return bits.join('');
        });

        return formattedOctets.join('');
    }

    showNetworkDivision(maskBinary) {
        const fullBinary = maskBinary.join('');
        let networkBits = 0;
        for (let i = 0; i < fullBinary.length; i++) {
            if (fullBinary[i] === '1') networkBits++;
            else break;
        }
        const hostBits = 32 - networkBits;
        const divisionElement = document.getElementById('networkDivision');
        if (divisionElement) {
            divisionElement.innerHTML = `
                Network Bits: <span class="text-network">${networkBits} bits</span> | 
                Host Bits: <span class="text-host">${hostBits} bits</span> | 
                Division: <span class="text-division">/${networkBits}</span>
            `;
        }
    }

    getDefaultMask(ipClass) {
        switch(ipClass) {
            case 'A': return '255.0.0.0';
            case 'B': return '255.255.0.0';
            case 'C': return '255.255.255.0';
            default: return '-';
        }
    }

    getIPClass(firstOctet) {
        if (firstOctet >= 1 && firstOctet <= 126) return 'A';
        if (firstOctet >= 128 && firstOctet <= 191) return 'B';
        if (firstOctet >= 192 && firstOctet <= 223) return 'C';
        if (firstOctet >= 224 && firstOctet <= 239) return 'D';
        if (firstOctet >= 240 && firstOctet <= 255) return 'E';
        return 'Unknown';
    }

    countZeroBits(mask) {
        return mask.split('.').reduce((acc, octet) => {
            const binary = parseInt(octet).toString(2).padStart(8, '0');
            return acc + (binary.match(/0/g) || []).length;
        }, 0);
    }

    countOneBits(mask) {
        return 32 - this.countZeroBits(mask);
    }
}
