# 🌟 小二互動測驗挑戰 (Primary 2 Interactive Quiz App)

> **"學習不應局限於課室，而可以是一場好玩的闖關遊戲。"** 

這是一個專為我女兒設計的輕量級互動測驗 Web 應用程式。目的是幫助她在課餘時間，透過她最喜歡的裝置（iPad、iPhone 或手提電腦），以遊戲和測驗的形式輕鬆溫習學校的知識。

## 🎯 專案初衷與目標

小朋友天生喜愛遊戲和互動。與其讓她被動地閱讀課本，不如將常識、數學、中文及英文的知識點轉化為互動問答。

本專案的核心目標：
*   **寓學習於娛樂 (Gamified Learning)：** 將枯燥的複習變成挑戰，每答對一題都能獲得即時的正向回饋。
*   **隨時隨地學習 (Cross-device Accessibility)：** 支援跨平台瀏覽器，無論是在沙發上用 iPad，還是在車上用 iPhone，都能隨時展開小測驗。
*   **針對性溫習 (Targeted Revision)：** 透過本地記錄功能，收集答錯的題目，方便針對弱點進行重點複習。
*   **靈活的題庫擴充：** 使用簡單的 JSON 格式儲存題目，家長可以隨時根據學校進度，無縫添加新題目。

## ✨ 核心功能 (Key Features)

*   📚 **多科目支援：** 目前支援常識、數學、中文及英文四科，可自由選擇挑戰。
*   🔀 **隨機洗牌出題：** 每次測驗隨機抽出 10 題，並打亂題目順序，防止死記硬背。
*   📊 **歷史成績追蹤：** 系統會自動記錄每次測驗的得分，並標示滿分成就。
*   🔍 **錯題回顧系統：** 測驗結束後或在歷史紀錄中，可以詳細查看選錯的答案、正確答案及解析 (Explanation)。
*   🌙 **響應式設計：** 介面簡潔，並已解決深色模式 (Dark Mode) 下的顯示問題，適合各種螢幕尺寸。

## 🛠️ 技術棧 (Tech Stack)

*   **前端框架:** React.js
*   **建構工具:** Vite
*   **數據儲存:** JSON (題庫) + 瀏覽器 `localStorage` (歷史紀錄)
*   **部署環境:** GitHub Pages (完全免費且無需後端伺服器)

## 📁 題庫管理說明 (For Parents/Contributors)

所有的題目都儲存在 `src/` 目錄下的 JSON 檔案中。家長只需要修改或新增這些 JSON 檔案，網頁就會自動更新題庫。

*   `questions-Chinese.json` - 中文科
*   `questions-Eng.json` - 英文科
*   `questions-Maths.json` - 數學科
*   `questions-Common.json` - 常識科


## Data Source
# English
https://www.edb.gov.hk/attachment/en/curriculum-development/kla/eng-edu/Curriculum%20Document/ELE%20KLACG_2017.pdf 

# 個人、社會及人文教育
https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/pshe/PSHE_KLACG_P1-S6_Chi_2017.pdf

# Maths
https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/ma/curr/ME_KLACG_chi_2017_12_08.pdf

# Chinese
https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/curriculum-documents/CLEKLAG_2017_for_upload_final_R77.pdf 

**JSON 題目格式範例：**
```json
{
  "id": 1,
  "category": "乘法應用",
  "question": "一包餅乾有 5 塊，小紅買了 6 包，共有餅乾多少塊？",
  "options": ["11 塊", "25 塊", "30 塊", "35 塊"],
  "answer": 2,  // 0 代表第一個選項，2 代表第三個選項
  "explanation": "5 × 6 = 30 塊。"
}

