/* ============================================
   主应用逻辑文件
   负责页面切换、授权码验证、题目展示和报告生成
   ============================================ */

// ============================================
// 全局状态管理
// ============================================
const AppState = {
    currentPage: 'landing',  // landing, quiz, report
    currentQuestionIndex: 0,
    answers: [],  // 存储用户选择的答案
    isAuthorized: false  // 授权状态
};

// ============================================
// DOM 元素引用
// ============================================
const elements = {
    landingPage: document.getElementById('landing-page'),
    quizPage: document.getElementById('quiz-page'),
    reportPage: document.getElementById('report-page'),
    startBtn: document.getElementById('start-btn'),
    authModal: document.getElementById('auth-modal'),
    authCodeInput: document.getElementById('auth-code-input'),
    verifyBtn: document.getElementById('verify-btn'),
    closeModalBtn: document.getElementById('close-modal'),
    errorMessage: document.getElementById('error-message'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    progressText: document.getElementById('progress-text'),
    progressBar: document.getElementById('progress-bar'),
    reportContent: document.getElementById('report-content')
};

// ============================================
// 授权码验证逻辑
// ============================================
const AUTH_CODE = '111666';  // 预设的授权码

// 显示授权码弹窗
function showAuthModal() {
    elements.authModal.classList.remove('hidden');
    elements.authCodeInput.value = '';
    elements.authCodeInput.focus();
    elements.errorMessage.classList.add('hidden');
}

// 隐藏授权码弹窗
function hideAuthModal() {
    elements.authModal.classList.add('hidden');
}

// 验证授权码
function verifyAuthCode() {
    const inputCode = elements.authCodeInput.value.trim();
    
    if (inputCode === '') {
        showError('请输入探索码');
        return;
    }
    
    if (inputCode === AUTH_CODE) {
        AppState.isAuthorized = true;
        hideAuthModal();
        startQuiz();
    } else {
        showError('探索码错误，请重新输入');
        elements.authCodeInput.value = '';
        elements.authCodeInput.focus();
    }
}

// 显示错误信息
function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.remove('hidden');
}

// ============================================
// 页面切换逻辑
// ============================================
function showLandingPage() {
    elements.landingPage.classList.remove('hidden');
    elements.quizPage.classList.add('hidden');
    elements.reportPage.classList.add('hidden');
    AppState.currentPage = 'landing';
}

function showQuizPage() {
    elements.landingPage.classList.add('hidden');
    elements.quizPage.classList.remove('hidden');
    elements.reportPage.classList.add('hidden');
    AppState.currentPage = 'quiz';
}

function showReportPage() {
    elements.landingPage.classList.add('hidden');
    elements.quizPage.classList.add('hidden');
    elements.reportPage.classList.remove('hidden');
    AppState.currentPage = 'report';
}

// ============================================
// 开始测试
// ============================================
function startQuiz() {
    // 重置状态
    AppState.currentQuestionIndex = 0;
    AppState.answers = [];
    
    // 切换到测试页面
    showQuizPage();
    
    // 显示第一道题
    displayQuestion();
}

// ============================================
// 题目展示逻辑
// ============================================
function displayQuestion() {
    // 确保题目数据已加载
    if (typeof questions === 'undefined') {
        elements.questionText.textContent = '题目加载失败，请刷新页面重试。';
        elements.optionsContainer.innerHTML = '';
        return;
    }
    const question = questions[AppState.currentQuestionIndex];
    
    if (!question) {
        // 所有题目答完，生成报告
        generateReport();
        return;
    }
    
    // 更新进度
    updateProgress();
    
    // 显示题目
    elements.questionText.textContent = question.text;
    
    // 清空选项容器
    elements.optionsContainer.innerHTML = '';
    
    // 创建选项按钮
    question.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'option-button';
        optionButton.textContent = option.text;
        
        // 添加点击事件
        optionButton.addEventListener('click', () => {
            selectOption(option.type);
        });
        
        elements.optionsContainer.appendChild(optionButton);
    });
}

// ============================================
// 选择选项处理
// ============================================
function selectOption(optionType) {
    // 保存答案
    AppState.answers.push(optionType);
    
    // 移动到下一题
    AppState.currentQuestionIndex++;
    
    // 添加淡出动画
    const questionCard = document.getElementById('question-card');
    questionCard.style.opacity = '0';
    questionCard.style.transform = 'translateX(-50px)';
    
    // 延迟后显示下一题
    setTimeout(() => {
        displayQuestion();
        questionCard.style.opacity = '1';
        questionCard.style.transform = 'translateX(0)';
    }, 300);
}

// ============================================
// 更新进度条
// ============================================
function updateProgress() {
    const current = AppState.currentQuestionIndex + 1;
    const total = questions.length;
    const percentage = (current / total) * 100;
    
    elements.progressText.textContent = `${current} / ${total}`;
    elements.progressBar.style.width = `${percentage}%`;
}

// ============================================
// 生成报告
// ============================================
function generateReport() {
    // 显示加载动画
    showQuizPage();
    elements.questionText.textContent = '正在生成您的专属报告...';
    elements.optionsContainer.innerHTML = '<div class="text-center text-white">请稍候</div>';
    
    // 延迟一下，让用户看到加载状态
    setTimeout(() => {
        try {
            // 确保报告相关函数已加载
            if (typeof calculatePersonalityType !== 'function' || typeof generateReportHTML !== 'function') {
                throw new Error('报告模块加载失败，请刷新页面重试');
            }
            // 计算人格类型
            const personalityType = calculatePersonalityType(AppState.answers);
            
            // 生成报告HTML
            const reportHTML = generateReportHTML(personalityType);
            
            // 显示报告
            elements.reportContent.innerHTML = reportHTML;
            showReportPage();
            
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            elements.questionText.textContent = '报告生成失败：' + (err.message || '未知错误');
            elements.optionsContainer.innerHTML = '<div class="text-center text-white mt-4"><button id="retry-btn" class="decode-cta-btn inline-flex items-center justify-center px-8 py-3 rounded-full text-white font-medium">刷新重试</button></div>';
            document.getElementById('retry-btn')?.addEventListener('click', () => location.reload());
        }
    }, 1500);
}

// ============================================
// 事件监听器绑定
// ============================================
function initEventListeners() {
    // 开始按钮点击事件
    elements.startBtn.addEventListener('click', () => {
        showAuthModal();
    });
    
    // 验证按钮点击事件
    elements.verifyBtn.addEventListener('click', verifyAuthCode);
    
    // 关闭弹窗按钮
    elements.closeModalBtn.addEventListener('click', hideAuthModal);
    
    // 点击磨砂玻璃背景关闭
    document.getElementById('auth-modal-backdrop')?.addEventListener('click', hideAuthModal);
    
    // 授权码输入框回车事件
    elements.authCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyAuthCode();
        }
    });
    
    // 限制输入为数字
    elements.authCodeInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// ============================================
// 应用初始化
// ============================================
function init() {
    // 初始化事件监听器
    initEventListeners();
    
    // 确保初始状态正确
    showLandingPage();
    
    console.log('恋爱人格测评应用已初始化');
}

// ============================================
// 页面加载完成后初始化
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
