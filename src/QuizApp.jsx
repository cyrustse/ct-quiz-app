import React, { useState } from 'react';
// 1. 引入外部 JSON 數據
import quizData from './questions.json'; 

export default function QuizApp() {
  // 這裡的邏輯不需要修改，因為變數名稱依然叫做 quizData
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleAnswerClick = (index) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const correct = index === quizData[currentQuestion].answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>小二常識科互動測驗</h1>
      
      {showScore ? (
        <div style={{ textAlign: 'center' }}>
          <h2>測驗完成！</h2>
          <p style={{ fontSize: '24px' }}>你的得分：{score} / {quizData.length}</p>
          <button onClick={restartQuiz} style={buttonStyle}>重新開始</button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '20px', background: '#eee', height: '10px', borderRadius: '5px' }}>
            <div style={{ 
              width: `${((currentQuestion + 1) / quizData.length) * 100}%`, 
              background: '#4CAF50', height: '100%', borderRadius: '5px' 
            }} />
          </div>
          
          <h3>第 {currentQuestion + 1} 題：</h3>
          <p style={{ fontSize: '18px' }}>{quizData[currentQuestion].question}</p>
          
          <div>
            {quizData[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                style={{
                  ...optionButtonStyle,
                  backgroundColor: selectedAnswer === index 
                    ? (index === quizData[currentQuestion].answer ? '#d4edda' : '#f8d7da')
                    : 'white'
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {selectedAnswer !== null && (
            <div style={{ marginTop: '20px', padding: '10px', borderRadius: '5px', backgroundColor: '#e2f3ff' }}>
              <p><strong>{isCorrect ? "✅ 答對了！" : "❌ 答錯了！"}</strong></p>
              <p>{quizData[currentQuestion].explanation}</p>
              <button onClick={handleNextQuestion} style={buttonStyle}>
                {currentQuestion + 1 === quizData.length ? "查看結果" : "下一題"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 樣式部分保持不變...
const optionButtonStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  fontSize: '16px',
  cursor: 'pointer',
  border: '1px solid #ccc',
  borderRadius: '8px',
  textAlign: 'left'
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};