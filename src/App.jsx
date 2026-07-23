import React, { useState, useEffect } from 'react';
import './App.css'; 

// 引入五個科目嘅題庫
import commonData from './questions-Common.json';
import mathsData from './questions-Maths.json';
import chineseData from './questions-Chinese.json';
import engData from './questions-Eng.json';
import olpMathData from './questions-OlpMath.json'; // 奧數題庫

export default function QuizApp() {
  const [view, setView] = useState('home');
  const [history, setHistory] = useState([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentQuizData, setCurrentQuizData] = useState([]);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('quizHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startQuiz = (subjectData, subjectName) => {
    const shuffled = shuffleArray(subjectData);
    const selectedQuestions = shuffled.slice(0, 10);
    
    setCurrentSubject(subjectName);
    setCurrentQuizData(selectedQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setView('quiz');
    setExpandedHistoryId(null);
  };

  const handleAnswerClick = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const isCorrect = index === currentQuizData[currentQuestion].answer;
    
    setUserAnswers([...userAnswers, {
      questionId: currentQuizData[currentQuestion].id,
      questionText: currentQuizData[currentQuestion].question,
      userChoiceText: currentQuizData[currentQuestion].options[index],
      correctAnswerText: currentQuizData[currentQuestion].options[currentQuizData[currentQuestion].answer],
      explanation: currentQuizData[currentQuestion].explanation,
      isCorrect: isCorrect
    }]);

    if (isCorrect) setScore(prev => prev + 1);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestion + 1 < currentQuizData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      saveHistoryRecord();
      setView('summary');
    }
  };

  const saveHistoryRecord = () => {
    const wrongAnswers = userAnswers.filter(ans => !ans.isCorrect);
    const newRecord = {
      id: Date.now(),
      date: new Date().toLocaleString('zh-HK'),
      subject: currentSubject,
      score: score,
      total: currentQuizData.length,
      wrongAnswers: wrongAnswers 
    };
    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    if (window.confirm("確定要清除所有紀錄嗎？")) {
      localStorage.removeItem('quizHistory');
      setHistory([]);
    }
  };

  const toggleHistoryDetail = (id) => {
    setExpandedHistoryId(expandedHistoryId === id ? null : id);
  };

  // --- 渲染畫面 ---

  const renderHome = () => {
    // 1. 計算今日完成咗邊幾科
    const todayStr = new Date().toLocaleDateString('zh-HK');
    const todaysRecords = history.filter(record => {
       return new Date(record.id).toLocaleDateString('zh-HK') === todayStr;
    });
    
    // 抽取出今日已經做過嘅科目名
    const completedSubjects = [...new Set(todaysRecords.map(r => r.subject))];

    // 2. 定義【每日任務】需要完成嘅核心科目 (已移除奧數科)
    const DAILY_MISSION_SUBJECTS = [
      { key: '中文科', label: '中文', icon: '📝' },
      { key: '英文科', label: '英文', icon: '🔤' },
      { key: '數學科', label: '數學', icon: '📐' },
      { key: '常識科', label: '常識', icon: '📘' }
    ];

    // 3. 檢查係咪 4 科核心任務都已經完成 (.every 會檢查 DAILY_MISSION_SUBJECTS 入面每一科)
    const isAllMissionsCompleted = DAILY_MISSION_SUBJECTS.every(sub => completedSubjects.includes(sub.key));

    return (
      <div className="quiz-container center-text">
        <h1>小二互動測驗挑戰</h1>
        
        {/* --- 每日任務徽章區塊 --- */}
        <div className="daily-mission-container">
          <h3>🌟 今日學習任務</h3>
          <div className="badge-grid">
            {DAILY_MISSION_SUBJECTS.map(sub => {
              const isCompleted = completedSubjects.includes(sub.key);
              return (
                <div key={sub.key} className={`badge-item ${isCompleted ? 'completed' : ''}`}>
                  <span className="badge-icon">{sub.icon}</span>
                  <span className="badge-label">{sub.label}</span>
                  {isCompleted && <span className="badge-checkmark">✅</span>}
                </div>
              );
            })}
          </div>
          {/* 當 4 科核心科都完成時顯示恭賀字句 */}
          {isAllMissionsCompleted && (
            <p style={{ color: '#d84315', fontWeight: 'bold', marginTop: '15px' }}>
              🎉 太犀利喇！今日 4 科核心任務全部完成！ 🎉
            </p>
          )}
        </div>
        {/* ------------------------ */}

        <p>請選擇你想挑戰嘅科目，每次會隨機抽出 10 題！</p>
        
        <div style={{ margin: '20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <button onClick={() => startQuiz(chineseData, '中文科')} className="btn-primary" style={{ padding: '20px', fontSize: '18px', backgroundColor: '#dc3545', margin: 0 }}>
            📝 挑戰中文科
          </button>
          
          <button onClick={() => startQuiz(engData, '英文科')} className="btn-primary" style={{ padding: '20px', fontSize: '18px', backgroundColor: '#6f42c1', margin: 0 }}>
            🔤 挑戰英文科
          </button>

          <button onClick={() => startQuiz(mathsData, '數學科')} className="btn-primary" style={{ padding: '20px', fontSize: '18px', backgroundColor: '#28a745', margin: 0 }}>
            📐 挑戰數學科
          </button>

          <button onClick={() => startQuiz(commonData, '常識科')} className="btn-primary" style={{ padding: '20px', fontSize: '18px', margin: 0 }}>
            📘 挑戰常識科
          </button>

          {/* 奧數科按鈕保留，作為額外挑戰 */}
          <button onClick={() => startQuiz(olpMathData, '奧數科')} className="btn-primary" style={{ padding: '20px', fontSize: '18px', backgroundColor: '#e83e8c', margin: 0, gridColumn: 'span 2' }}>
            🏆 挑戰奧數科 (額外挑戰)
          </button>
        </div>

        <button onClick={() => setView('history')} className="btn-secondary">查看歷史紀錄</button>
      </div>
    );
  };

  const renderHistory = () => (
    <div className="quiz-container">
      <h2>📊 歷史測驗紀錄</h2>
      {history.length === 0 ? (
        <p className="center-text" style={{ color: '#666' }}>目前還沒有任何測驗紀錄喔！</p>
      ) : (
        <div>
          <button onClick={clearHistory} className="btn-danger">清除所有紀錄</button>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {history.map((record) => (
              <li key={record.id} className="history-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <div>
                    <strong>🗓️ {record.date}</strong>
                    <div style={{ marginTop: '5px', color: '#666', fontSize: '14px' }}>
                      科目：<span style={{ fontWeight: 'bold' }}>{record.subject || '未分類'}</span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: record.score >= (record.total * 0.8) ? '#28a745' : '#007bff' }}>
                      得分：{record.score} / {record.total}
                    </div>
                  </div>
                  {record.wrongAnswers && record.wrongAnswers.length > 0 && (
                    <button onClick={() => toggleHistoryDetail(record.id)} className="btn-detail">
                      {expandedHistoryId === record.id ? '收起錯題 ▲' : '查看錯題 ▼'}
                    </button>
                  )}
                  {record.score === record.total && (
                     <span style={{ color: '#28a745', fontWeight: 'bold' }}>滿分！🎉</span>
                  )}
                </div>

                {expandedHistoryId === record.id && record.wrongAnswers && (
                  <div className="wrong-answers-container">
                    <h4 style={{ margin: '0 0 10px 0', color: '#dc3545' }}>錯誤回顧：</h4>
                    {record.wrongAnswers.map((wrong, idx) => (
                      <div key={idx} className="wrong-item">
                        <p style={{ margin: '0 0 5px 0' }}><strong>Q: {wrong.questionText}</strong></p>
                        <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                          ❌ 你選了：<span style={{ textDecoration: 'line-through' }}>{wrong.userChoiceText}</span>
                        </p>
                        <p style={{ margin: '5px 0', fontSize: '14px', color: '#28a745', fontWeight: 'bold' }}>
                          ✅ 正確答案：{wrong.correctAnswerText}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="center-text" style={{ marginTop: '20px' }}>
        <button onClick={() => setView('home')} className="btn-primary">返回主畫面</button>
      </div>
    </div>
  );

  const renderSummary = () => {
    const percentage = Math.round((score / currentQuizData.length) * 100);
    let message = percentage >= 80 ? "太棒了！你是小專家！🌟" : 
                  percentage >= 50 ? "做得好！再加把勁會更棒！👍" : "沒關係，我們再複習一下！📚";

    return (
        <div className="quiz-container center-text">
            <h2>{currentSubject} 測驗完成！</h2>
            <div className="score-badge">
                <span style={{ fontSize: '48px' }}>{score}</span> / {currentQuizData.length}
            </div>
            <p style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '15px' }}>{message}</p>
            <div style={{ marginTop: '20px' }}>
                <button onClick={() => setView('home')} className="btn-primary">返回主畫面</button>
                <button onClick={() => setView('history')} className="btn-secondary">查看歷史紀錄</button>
            </div>
        </div>
    )
  };

  const renderQuiz = () => {
      if (currentQuizData.length === 0) return null;

      return (
        <div className="quiz-container">
          <h2 style={{ textAlign: 'center', color: '#333', marginTop: 0 }}>{currentSubject}</h2>
          
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${((currentQuestion + 1) / currentQuizData.length) * 100}%` }} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' }}>
            <span>題目 {currentQuestion + 1} / {currentQuizData.length}</span>
            <span className="category-tag">{currentQuizData[currentQuestion].category}</span>
          </div>
          
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{currentQuizData[currentQuestion].question}</p>
          
          <div>
            {currentQuizData[currentQuestion].options.map((option, index) => {
              let bgColor = '#ffffff';
              let borderColor = '#ccc';
              
              if (selectedAnswer !== null) {
                if (index === currentQuizData[currentQuestion].answer) {
                  bgColor = '#d4edda'; borderColor = '#28a745'; 
                } else if (selectedAnswer === index) {
                  bgColor = '#f8d7da'; borderColor = '#dc3545'; 
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  className="option-btn"
                  style={{ backgroundColor: bgColor, borderColor: borderColor }}
                >
                  {option}
                </button>
              );
            })}
          </div>
          
          {selectedAnswer !== null && (
            <div className="center-text" style={{ marginTop: '20px' }}>
              <button onClick={handleNextQuestion} className="btn-primary">
                {currentQuestion + 1 === currentQuizData.length ? "查看總結" : "下一題"}
              </button>
            </div>
          )}
        </div>
      );
  }

  return (
    <div className="app-wrapper">
      {view === 'home' && renderHome()}
      {view === 'history' && renderHistory()}
      {view === 'quiz' && renderQuiz()}
      {view === 'summary' && renderSummary()}
    </div>
  );
}