// ==========================================================================
// ACCESSIBILITY: THEME TOGGLE & FONT RESIZING
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Elements
  const themeBtn = document.getElementById('btn-theme');
  const themeIcon = document.getElementById('theme-icon');
  
  // Font Control Elements
  const btnDecrease = document.getElementById('btn-font-decrease');
  const btnReset = document.getElementById('btn-font-reset');
  const btnIncrease = document.getElementById('btn-font-increase');
  
  // Font Size Settings
  let currentFontSize = 16; // base size in pixels
  const minFontSize = 12;
  const maxFontSize = 22;

  // --- Theme Management ---
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  themeBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '☀️';
      themeBtn.childNodes[1].textContent = ' Light';
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.textContent = '🌙';
      themeBtn.childNodes[1].textContent = ' Dark';
    }
    localStorage.setItem('theme', theme);
  }

  // --- Font Size Management ---
  btnIncrease.addEventListener('click', () => {
    if (currentFontSize < maxFontSize) {
      currentFontSize += 2;
      updateFontSize();
    }
  });

  btnDecrease.addEventListener('click', () => {
    if (currentFontSize > minFontSize) {
      currentFontSize -= 2;
      updateFontSize();
    }
  });

  btnReset.addEventListener('click', () => {
    currentFontSize = 16;
    updateFontSize();
  });

  function updateFontSize() {
    document.documentElement.style.setProperty('--font-base-size', `${currentFontSize}px`);
  }

  // ==========================================================================
  // QUIZ FUNCTIONALITY
  // ==========================================================================

  const quizQuestions = [
    {
      question: "Qual é a sua primeira atitude ao acordar?",
      options: [
        { text: "Pego o celular imediatamente para olhar redes e mensagens.", score: 0 },
        { text: "Olho apenas o relógio ou alarmes essenciais.", score: 1 },
        { text: "Tomo café/faço minha rotina matinal antes de tocar no celular.", score: 2 }
      ]
    },
    {
      question: "Como você gerencia as notificações do seu smartphone?",
      options: [
        { text: "Deixo som e vibração ativados para todos os aplicativos.", score: 0 },
        { text: "Desativo sons, mas ainda mantenho avisos visuais de quase tudo.", score: 1 },
        { text: "Mantenho ativas apenas notificações vitais (chamadas, contatos urgentes).", score: 2 }
      ]
    },
    {
      question: "Ao ler uma notícia chamativa nas redes sociais, o que você faz?",
      options: [
        { text: "Compartilho imediatamente se concordar com a manchete.", score: 0 },
        { text: "Leio o conteúdo antes de pensar em compartilhar.", score: 1 },
        { text: "Verifico a fonte, busco outras referências e checo fatos antes.", score: 2 }
      ]
    },
    {
      question: "Qual a sua postura em relação à privacidade dos seus dados na internet?",
      options: [
        { text: "Aceito todos os cookies e termos sem ler para acessar rápido.", score: 0 },
        { text: "Rejeito cookies não essenciais quando a opção é fácil.", score: 1 },
        { text: "Utilizo bloqueadores, navegadores focados em privacidade e senhas fortes.", score: 2 }
      ]
    }
  ];

  let currentQuestionIndex = 0;
  let totalScore = 0;

  const quizBody = document.getElementById('quiz-body');
  const quizResult = document.getElementById('quiz-result');

  function renderQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    
    quizBody.innerHTML = `
      <div class="quiz-question">${q.question}</div>
      <div class="quiz-options">
        ${q.options.map((option, idx) => `
          <button class="quiz-option-btn" data-score="${option.score}">${option.text}</button>
        `).join('')}
      </div>
      <div class="quiz-progress">Pergunta ${currentQuestionIndex + 1} de ${quizQuestions.length}</div>
    `;

    // Add event listeners to options
    const optionBtns = quizBody.querySelectorAll('.quiz-option-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const score = parseInt(e.target.getAttribute('data-score'));
        totalScore += score;
        currentQuestionIndex++;

        if (currentQuestionIndex < quizQuestions.length) {
          renderQuestion();
        } else {
          showResult();
        }
      });
    });
  }

  function showResult() {
    quizBody.classList.add('hidden');
    quizResult.classList.remove('hidden');

    let title = "";
    let description = "";

    const maxPossibleScore = quizQuestions.length * 2;
    const percentage = (totalScore / maxPossibleScore) * 100;

    if (percentage >= 80) {
      title = "🌟 Mestre do Equilíbrio Digital";
      description = "Parabéns! Você possui hábitos extremamente saudáveis e conscientes no uso da tecnologia. Continua assim e inspire pessoas ao seu redor!";
    } else if (percentage >= 40) {
      title = "⚖️ Em Busca de Equilíbrio";
      description = "Você tem boa noção dos impactos digitais, mas ainda cede a algumas distrações e armadilhas de privacidade. Tente aplicar as soluções apresentadas neste site!";
    } else {
      title = "⚠️ Alerta de Sobrecarga Digital";
      description = "Sua rotina digital pode estar afetando seu bem-estar e privacidade. Recomendamos experimentar pequenos hábitos, como desativar notificações e fazer detox diários.";
    }

    quizResult.innerHTML = `
      <h3>${title}</h3>
      <p>${description}</p>
      <button id="btn-restart-quiz" class="btn-primary">Refazer Quiz</button>
    `;

    document.getElementById('btn-restart-quiz').addEventListener('click', () => {
      currentQuestionIndex = 0;
      totalScore = 0;
      quizResult.classList.add('hidden');
      quizBody.classList.remove('hidden');
      renderQuestion();
    });
  }

  // Initialize Quiz
  renderQuestion();
});