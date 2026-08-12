(function() {
  'use strict';

  // ==================== CONFIG ====================
  var CONFIG = {
    appName: 'グラスクイズ',
    storageKey: 'mdg_glassquiz',
    questionCount: 10,
    answerRevealMs: 1100,
  };

  var DIFFICULTY_LABEL = { easy: 'かんたん', medium: 'ふつう', hard: 'むずかしい' };

  // ==================== QUESTION BANK（世界地理） ====================
  var QUESTION_BANK = [
    { category: '国土', difficulty: 'easy', q: '世界で一番面積が大きい国は？', correct: 'ロシア', wrong: ['カナダ', 'アメリカ合衆国', '中国'] },
    { category: '国土', difficulty: 'medium', q: '面積が世界で2番目に大きい国は？', correct: 'カナダ', wrong: ['アメリカ合衆国', 'ブラジル', 'オーストラリア'] },
    { category: '国土', difficulty: 'easy', q: '世界で一番小さい国は？', correct: 'バチカン市国', wrong: ['モナコ', 'サンマリノ', 'リヒテンシュタイン'] },
    { category: '国土', difficulty: 'medium', q: '世界最大の島は？', correct: 'グリーンランド', wrong: ['ニューギニア島', 'ボルネオ島', 'マダガスカル島'] },
    { category: '国土', difficulty: 'medium', q: '世界最大の島国は？', correct: 'インドネシア', wrong: ['フィリピン', '日本', 'マダガスカル'] },
    { category: '国土', difficulty: 'hard', q: '世界最大の半島は？', correct: 'アラビア半島', wrong: ['インド半島', 'スカンディナビア半島', 'バルカン半島'] },
    { category: '国土', difficulty: 'medium', q: '南極を除くと世界最大とされる砂漠は？', correct: 'サハラ砂漠', wrong: ['ゴビ砂漠', 'カラハリ砂漠', 'アタカマ砂漠'] },

    { category: '首都', difficulty: 'easy', q: 'アメリカ合衆国の首都は？', correct: 'ワシントンD.C.', wrong: ['ニューヨーク', 'ロサンゼルス', 'シカゴ'] },
    { category: '首都', difficulty: 'medium', q: 'オーストラリアの首都は？', correct: 'キャンベラ', wrong: ['シドニー', 'メルボルン', 'パース'] },
    { category: '首都', difficulty: 'medium', q: 'カナダの首都は？', correct: 'オタワ', wrong: ['トロント', 'バンクーバー', 'モントリオール'] },
    { category: '首都', difficulty: 'medium', q: 'ブラジルの首都は？', correct: 'ブラジリア', wrong: ['リオデジャネイロ', 'サンパウロ', 'サルバドール'] },
    { category: '首都', difficulty: 'hard', q: 'スイスの首都は？', correct: 'ベルン', wrong: ['チューリッヒ', 'ジュネーブ', 'バーゼル'] },
    { category: '首都', difficulty: 'hard', q: 'トルコの首都は？', correct: 'アンカラ', wrong: ['イスタンブール', 'イズミル', 'アンタルヤ'] },
    { category: '首都', difficulty: 'easy', q: 'エジプトの首都は？', correct: 'カイロ', wrong: ['アレクサンドリア', 'ルクソール', 'アスワン'] },
    { category: '首都', difficulty: 'hard', q: 'ケニアの首都は？', correct: 'ナイロビ', wrong: ['モンバサ', 'キスム', 'ナクル'] },
    { category: '首都', difficulty: 'hard', q: 'ニュージーランドの首都は？', correct: 'ウェリントン', wrong: ['オークランド', 'クライストチャーチ', 'ハミルトン'] },
    { category: '首都', difficulty: 'easy', q: 'イタリアの首都は？', correct: 'ローマ', wrong: ['ミラノ', 'ナポリ', 'ヴェネツィア'] },
    { category: '首都', difficulty: 'hard', q: '標高の高さで知られる、南米ボリビアの首都は？', correct: 'ラパス', wrong: ['キト', 'ボゴタ', 'クスコ'] },

    { category: '大陸', difficulty: 'easy', q: '世界で一番大きい大陸は？', correct: 'アジア', wrong: ['アフリカ', 'ヨーロッパ', '北アメリカ'] },
    { category: '大陸', difficulty: 'medium', q: '世界で一番小さい大陸は？', correct: 'オーストラリア大陸', wrong: ['南極大陸', 'ヨーロッパ大陸', '南アメリカ大陸'] },
    { category: '大陸', difficulty: 'easy', q: 'サハラ砂漠がある大陸は？', correct: 'アフリカ', wrong: ['アジア', '南アメリカ', 'オーストラリア'] },
    { category: '大陸', difficulty: 'easy', q: 'アマゾン熱帯雨林が広がる大陸は？', correct: '南アメリカ', wrong: ['アフリカ', 'アジア', 'オセアニア'] },
    { category: '大陸', difficulty: 'easy', q: 'ナイル川が流れる大陸は？', correct: 'アフリカ', wrong: ['アジア', '南アメリカ', 'ヨーロッパ'] },

    { category: '山', difficulty: 'easy', q: '世界最高峰の山は？', correct: 'エベレスト', wrong: ['K2', 'キリマンジャロ', 'モンブラン'] },
    { category: '山', difficulty: 'medium', q: 'アフリカ大陸最高峰の山は？', correct: 'キリマンジャロ', wrong: ['アトラス山脈', 'ケニア山', 'ドラケンスバーグ山脈'] },
    { category: '山', difficulty: 'hard', q: '南米大陸最高峰の山は？', correct: 'アコンカグア', wrong: ['ワスカラン', 'チンボラソ', 'オホスデルサラード'] },
    { category: '山', difficulty: 'hard', q: 'ヨーロッパ最高峰とされる山は？', correct: 'エルブルース山', wrong: ['モンブラン', 'マッターホルン', 'ユングフラウ'] },
    { category: '山', difficulty: 'hard', q: '北米大陸最高峰の山は？', correct: 'デナリ', wrong: ['ホイットニー山', 'ローガン山', 'オリサバ山'] },

    { category: '川・湖', difficulty: 'hard', q: '面積が世界最大の湖（塩湖含む）は？', correct: 'カスピ海', wrong: ['スペリオル湖', 'ビクトリア湖', 'バイカル湖'] },
    { category: '川・湖', difficulty: 'hard', q: '表面積が世界最大の淡水湖は？', correct: 'スペリオル湖', wrong: ['ビクトリア湖', 'バイカル湖', 'タンガニーカ湖'] },
    { category: '川・湖', difficulty: 'hard', q: '世界で一番深い湖は？', correct: 'バイカル湖', wrong: ['タンガニーカ湖', 'カスピ海', 'マラウイ湖'] },
    { category: '川・湖', difficulty: 'medium', q: '流域面積が世界最大の川は？', correct: 'アマゾン川', wrong: ['ナイル川', '長江', 'ミシシッピ川'] },

    { category: '海洋', difficulty: 'hard', q: '世界で一番深い海溝は？', correct: 'マリアナ海溝', wrong: ['トンガ海溝', 'フィリピン海溝', 'ペルー海溝'] },
    { category: '海洋', difficulty: 'easy', q: '世界で一番広い海洋は？', correct: '太平洋', wrong: ['大西洋', 'インド洋', '北極海'] },
    { category: '海洋', difficulty: 'medium', q: '世界最大の珊瑚礁「グレートバリアリーフ」がある国は？', correct: 'オーストラリア', wrong: ['インドネシア', 'フィリピン', 'タイ'] },

    { category: '建造物', difficulty: 'easy', q: 'エッフェル塔がある国は？', correct: 'フランス', wrong: ['イタリア', 'ドイツ', 'スペイン'] },
    { category: '建造物', difficulty: 'easy', q: 'コロッセオがある国は？', correct: 'イタリア', wrong: ['ギリシャ', 'フランス', 'スペイン'] },
    { category: '建造物', difficulty: 'easy', q: 'ギザの三大ピラミッドがある国は？', correct: 'エジプト', wrong: ['スーダン', 'リビア', 'モロッコ'] },
    { category: '建造物', difficulty: 'medium', q: 'マチュピチュがある国は？', correct: 'ペルー', wrong: ['ボリビア', 'チリ', 'エクアドル'] },
    { category: '建造物', difficulty: 'medium', q: 'タージ・マハルがある国は？', correct: 'インド', wrong: ['パキスタン', 'バングラデシュ', 'ネパール'] },
    { category: '建造物', difficulty: 'easy', q: '万里の長城がある国は？', correct: '中国', wrong: ['モンゴル', '韓国', 'ベトナム'] },
    { category: '建造物', difficulty: 'easy', q: '自由の女神像がある都市は？', correct: 'ニューヨーク', wrong: ['ボストン', 'シカゴ', 'サンフランシスコ'] },
    { category: '建造物', difficulty: 'medium', q: 'アンコールワットがある国は？', correct: 'カンボジア', wrong: ['タイ', 'ベトナム', 'ラオス'] },
    { category: '建造物', difficulty: 'medium', q: 'サグラダ・ファミリアがある都市は？', correct: 'バルセロナ', wrong: ['マドリード', 'セビリア', 'バレンシア'] },
    { category: '建造物', difficulty: 'hard', q: 'ナスカの地上絵がある国は？', correct: 'ペルー', wrong: ['チリ', 'ボリビア', 'コロンビア'] },
    { category: '建造物', difficulty: 'easy', q: 'ストーンヘンジがある国は？', correct: 'イギリス', wrong: ['アイルランド', 'フランス', 'ドイツ'] },
  ];

  // ==================== STATE ====================
  var state = {
    currentScreen: 'home',
    screenHistory: [],
    data: { highScore: 0, lastScore: null },
    session: null, // { questions, index, score, answered, currentAnswers }
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

  // ==================== QUIZ LOGIC ====================
  function startQuiz() {
    var pool = shuffle(QUESTION_BANK).slice(0, CONFIG.questionCount);
    state.session = {
      questions: pool,
      index: 0,
      score: 0,
      answered: false,
    };
    document.getElementById('status-indicator').textContent = 'Ready';
    navigateTo('quiz');
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
    document.getElementById('quiz-category').textContent = q.category;
    document.getElementById('quiz-difficulty').textContent = DIFFICULTY_LABEL[q.difficulty] || q.difficulty;
    document.getElementById('quiz-question').textContent = q.q;

    var answers = shuffle(q.wrong.map(function(a) {
      return { text: a, correct: false };
    }).concat([{ text: q.correct, correct: true }]));

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
    if (ratio === 1) return 'パーフェクト！世界の地理博士です。';
    if (ratio >= 0.7) return 'ナイス！かなりの地理通ですね。';
    if (ratio >= 0.4) return 'まずまず！もう一度挑戦してみよう。';
    return '地図を広げたくなる結果…もう一度チャレンジ！';
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
