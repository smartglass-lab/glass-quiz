(function() {
  'use strict';

  // ==================== CONFIG ====================
  var CONFIG = {
    appName: 'グラスクイズ',
    storageKey: 'mdg_glassquiz',
    apiUrl: 'https://opentdb.com/api.php?amount=10&type=multiple',
    questionCount: 10,
    answerRevealMs: 1100,
  };

  var DIFFICULTY_LABEL = { easy: 'かんたん', medium: 'ふつう', hard: 'むずかしい' };

  // ==================== STATE ====================
  var state = {
    currentScreen: 'home',
    screenHistory: [],
    data: { highScore: 0, lastScore: null },
    session: null, // { questions, index, score, answered }
  };

  // ==================== DOM REFS ====================
  var screens = {};
  function collectScreens() {
    document.querySelectorAll('.screen').forEach(function(s) {
      if (s.id) screens[s.id] = s;
    });
  }

  // ==================== NAVIGATION ====================
  function navigateTo(screenId, options) {
    options = options || {};
    var addToHistory = options.addToHistory !== false;
    if (addToHistory && state.currentScreen) state.screenHistory.push(state.currentScreen);

    Object.values(screens).forEach(function(s) { s.classList.add('hidden'); });
    if (screens[screenId]) {
      screens[screenId].classList.remove('hidden');
      state.currentScreen = screenId;
      onScreenEnter(screenId);
      focusFirst(screens[screenId]);
    }
  }

  function navigateBack() {
    if (state.screenHistory.length > 0) {
      navigateTo(state.screenHistory.pop(), { addToHistory: false });
    }
  }

  // ==================== FOCUS MANAGEMENT ====================
  function focusFirst(container) {
    var el = container.querySelector('.focusable:not([disabled]):not(.hidden)');
    if (el) el.focus();
  }

  function moveFocus(direction) {
    var container = screens[state.currentScreen];
    if (!container) return;
    var focusables = Array.from(container.querySelectorAll('.focusable:not([disabled]):not(.hidden)'));
    if (focusables.length === 0) return;

    var idx = focusables.indexOf(document.activeElement);
    if (idx === -1) { focusFirst(container); return; }

    var nextIdx;
    if (direction === 'up' || direction === 'left') {
      nextIdx = idx > 0 ? idx - 1 : focusables.length - 1;
    } else {
      nextIdx = idx < focusables.length - 1 ? idx + 1 : 0;
    }
    focusables[nextIdx].focus();
    focusables[nextIdx].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  // ==================== DATA PERSISTENCE ====================
  function loadData() {
    try {
      var saved = localStorage.getItem(CONFIG.storageKey);
      if (saved) Object.assign(state.data, JSON.parse(saved));
    } catch (e) { console.error('[Storage] Load error:', e); }
  }
  function saveData() {
    try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(state.data)); }
    catch (e) { console.error('[Storage] Save error:', e); }
  }

  // ==================== UI HELPERS ====================
  function setLoading(isLoading) {
    var el = document.getElementById('loading');
    if (el) el.classList.toggle('hidden', !isLoading);
  }

  function showToast(message, type) {
    var toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = 'toast' + (type ? ' ' + type : '');
    toast.offsetHeight;
    toast.classList.add('visible');
    setTimeout(function() { toast.classList.remove('visible'); }, 2500);
  }

  function decodeHtml(str) {
    var el = document.createElement('textarea');
    el.innerHTML = str;
    return el.value;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  // ==================== HOME SCREEN ====================
  function renderHomeStats() {
    document.getElementById('home-highscore').textContent =
      state.data.highScore + ' / ' + CONFIG.questionCount;
    document.getElementById('home-lastscore').textContent =
      state.data.lastScore === null ? '--' : state.data.lastScore + ' / ' + CONFIG.questionCount;
  }

  function showHomeError(show) {
    var el = document.getElementById('home-error');
    if (el) el.classList.toggle('hidden', !show);
  }

  // ==================== QUIZ LOGIC ====================
  function startQuiz() {
    showHomeError(false);
    setLoading(true);
    document.getElementById('status-indicator').textContent = '取得中';

    fetch(CONFIG.apiUrl)
      .then(function(res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
      .then(function(json) {
        setLoading(false);
        if (json.response_code !== 0 || !json.results || json.results.length === 0) {
          throw new Error('empty results');
        }
        state.session = {
          questions: json.results,
          index: 0,
          score: 0,
          answered: false,
        };
        document.getElementById('status-indicator').textContent = 'Ready';
        navigateTo('quiz');
      })
      .catch(function() {
        setLoading(false);
        document.getElementById('status-indicator').textContent = 'Ready';
        showHomeError(true);
        showToast('問題を取得できませんでした', 'error');
      });
  }

  function currentQuestion() {
    return state.session.questions[state.session.index];
  }

  function renderQuestion() {
    var s = state.session;
    var q = currentQuestion();

    document.getElementById('quiz-progress').textContent =
      '第 ' + (s.index + 1) + ' / ' + s.questions.length + ' 問';
    document.getElementById('quiz-score').textContent = '正解 ' + s.score;
    document.getElementById('quiz-category').textContent = decodeHtml(q.category);
    document.getElementById('quiz-difficulty').textContent = DIFFICULTY_LABEL[q.difficulty] || q.difficulty;
    document.getElementById('quiz-question').textContent = decodeHtml(q.question);

    var answers = shuffle(q.incorrect_answers.map(function(a) {
      return { text: decodeHtml(a), correct: false };
    }).concat([{ text: decodeHtml(q.correct_answer), correct: true }]));

    s.answered = false;
    s.currentAnswers = answers;

    var container = document.getElementById('quiz-answers');
    container.innerHTML = '';
    answers.forEach(function(a, i) {
      var btn = document.createElement('button');
      btn.className = 'list-item focusable';
      btn.setAttribute('data-action', 'answer');
      btn.setAttribute('data-index', i);
      btn.textContent = a.text;
      container.appendChild(btn);
    });

    focusFirst(screens.quiz);
  }

  function submitAnswer(index) {
    var s = state.session;
    if (s.answered) return;
    s.answered = true;

    var answers = s.currentAnswers;
    var buttons = Array.from(document.querySelectorAll('#quiz-answers .list-item'));
    var picked = answers[index];

    buttons.forEach(function(btn, i) {
      btn.setAttribute('disabled', 'true');
      if (answers[i].correct) btn.classList.add('correct');
      else if (i === index) btn.classList.add('wrong');
    });

    if (picked.correct) {
      s.score++;
      document.getElementById('quiz-score').textContent = '正解 ' + s.score;
    }

    setTimeout(function() {
      s.index++;
      if (s.index >= s.questions.length) {
        finishQuiz();
      } else {
        renderQuestion();
      }
    }, CONFIG.answerRevealMs);
  }

  function finishQuiz() {
    var s = state.session;
    var isNewHigh = s.score > state.data.highScore;
    if (isNewHigh) state.data.highScore = s.score;
    state.data.lastScore = s.score;
    saveData();

    document.getElementById('result-score').textContent = s.score + ' / ' + s.questions.length;
    document.getElementById('result-icon').textContent = isNewHigh ? '🏆' : (s.score >= 7 ? '🎉' : '🌱');
    document.getElementById('result-message').textContent = resultMessage(s.score, s.questions.length);
    document.getElementById('result-badge').classList.toggle('hidden', !isNewHigh);

    navigateTo('result', { addToHistory: false });
    state.screenHistory = [];
  }

  function resultMessage(score, total) {
    var ratio = score / total;
    if (ratio === 1) return 'パーフェクト！世界のトリビア博士です。';
    if (ratio >= 0.7) return 'ナイス！かなりの物知りですね。';
    if (ratio >= 0.4) return 'まずまず！もう一度挑戦してみよう。';
    return 'このジャンルは奥が深い…もう一度チャレンジ！';
  }

  // ==================== SCREEN LIFECYCLE ====================
  function onScreenEnter(screenId) {
    if (screenId === 'home') {
      renderHomeStats();
    } else if (screenId === 'quiz') {
      renderQuestion();
    }
  }

  // ==================== ACTION HANDLING ====================
  function handleAction(action, element) {
    switch (action) {
      case 'back':
        navigateBack();
        break;
      case 'start-quiz':
        startQuiz();
        break;
      case 'go-home':
        navigateTo('home', { addToHistory: false });
        state.screenHistory = [];
        break;
      case 'answer':
        submitAnswer(parseInt(element.getAttribute('data-index'), 10));
        break;
    }
  }

  // ==================== EVENT LISTENERS ====================
  function setupEvents() {
    document.addEventListener('click', function(e) {
      var actionEl = e.target.closest('[data-action]');
      if (actionEl && !actionEl.hasAttribute('disabled')) handleAction(actionEl.dataset.action, actionEl);
    });

    document.addEventListener('keydown', function(e) {
      switch (e.key) {
        case 'ArrowUp': moveFocus('up'); e.preventDefault(); break;
        case 'ArrowDown': moveFocus('down'); e.preventDefault(); break;
        case 'ArrowLeft': moveFocus('left'); e.preventDefault(); break;
        case 'ArrowRight': moveFocus('right'); e.preventDefault(); break;
        case 'Enter':
          if (document.activeElement && document.activeElement.classList.contains('focusable') &&
              !document.activeElement.hasAttribute('disabled')) {
            document.activeElement.click();
          }
          e.preventDefault();
          break;
        case 'Escape':
          navigateBack();
          e.preventDefault();
          break;
      }
    });
  }

  // ==================== INITIALIZATION ====================
  function init() {
    collectScreens();
    setupEvents();
    loadData();

    setTimeout(function() {
      navigateTo('home', { addToHistory: false });
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
