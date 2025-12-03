# IP & Subnet Mask Binary Visualizer

A comprehensive interactive tool designed to help students and network professionals understand, visualize, and practice IP subnetting concepts. This application breaks down the complex binary logic behind networking into an easy-to-understand visual format.

## 🚀 How to Run
**Windows:**
Double-click the `startapp.bat` file in the folder. This will automatically open the application in your default web browser.

**Manual Method:**
Simply open the `index.html` file in any modern web browser (Chrome, Edge, Firefox, etc.).

---

## 🌟 Features & Modes

The application consists of three main modes, accessible via the navigation tabs at the top:

### 1. 🔍 Visualize Mode
The core of the application. It allows you to input any IP address and Subnet Mask to see exactly how they interact.

*   **Input Section**: Enter an IP Address, Subnet Mask, and an optional Second IP to compare.
*   **Network Information**: Instantly calculates the Network Address, Usable Hosts, CIDR Notation, and IP Class.
*   **Binary Visualization**:
    *   Displays the IP and Mask in binary (0s and 1s).
    *   **Interactive Slider**: Drag the red slider to visually change the subnet mask bits and see how it affects the network/host portion.
    *   **Color Coding**: Green bits represent the Network portion, Blue bits represent the Host portion.
*   **Network Division**: Visually represents the network block, showing the Network ID, First Host, Last Host, and Broadcast Address.
*   **Connectivity Check**: If a second IP is entered, it tells you if the two IPs are on the same local network.

### 2. ❓ Question Mode
A practice arena to test your subnetting skills.

*   **Randomized Questions**: Generates infinite practice problems covering:
    *   Subnet calculations
    *   Host counts
    *   Valid subnet checks
    *   Broadcast address identification
    *   Same network verification
*   **Instant Feedback**: Tells you if your answer is correct or incorrect.
*   **"Visualize This"**: Stuck on a question? Click this button to automatically load the question's IP and Mask into the Visualizer Mode so you can see the answer derived step-by-step.
*   **Score Tracking**: Keeps track of your correct answers during the session.

### 3. 📚 Instruction Mode
A built-in reference guide and cheat sheet.

*   **Powers of 2**: Quick reference for binary calculations ($2^1$ to $2^{14}$).
*   **IP Classes**: Standard ranges for Class A, B, and C networks.
*   **CIDR Reference**: Mapping of CIDR notation (e.g., /24) to Subnet Masks (e.g., 255.255.255.0) and binary values.
*   **Formulas**: Essential formulas for calculating subnets, hosts, and block sizes.
*   **Step-by-Step Examples**: Walkthroughs of common subnetting questions with detailed explanations.

---

## 🛠️ Technologies
*   **HTML5**: Structure and layout.
*   **CSS3**: Styling, responsive design, and the purple/slate color theme.
*   **JavaScript (ES6)**: Logic for binary calculations, dynamic HTML generation, and question randomization.

## 📝 Notes
*   This is a **static application**, meaning it runs entirely in your browser without needing an internet connection or a backend server.
*   The application is responsive and works on desktop and tablet screens.
