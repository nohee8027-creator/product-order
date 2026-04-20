# 럭키 5 로또 추천 (Lucky 5 Lotto Master) 🎰

OpenAI와 데이터 시각화를 결합한 프리미엄 로또 번호 추천 앱입니다.

## 🚀 주요 기능

- **AI 기반 추천**: OpenAI `gpt-3.5-turbo` 모델을 사용하여 분석된 행운의 번호 세트 생성.
- **실시간 통계**: 역대 당첨 빈도 데이터를 기반으로 한 TOP 10 차트 및 번호별 빈도 툴팁 제공.
- **생동감 넘치는 UI**: `framer-motion`과 `canvas-confetti`를 활용한 화려한 당첨 축하 연출.
- **보안 설계**: Express 백엔드 서버를 통해 API 키를 안전하게 관리하는 Full-Stack 구조.

## 🛠 기술 스택

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide-React
- **Backend**: Node.js, Express, tsx
- **AI**: OpenAI API
- **Visuals**: Canvas-confetti

## 📦 설치 및 실행 방법

1. **저장소 클론**
   ```bash
   git clone https://github.com/nohee8027-creator/product-builder-lecture.git
   cd product-builder-lecture
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   `.env` 파일을 생성하고 다음 내용을 입력하세요:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

## 📝 라이선스
이 프로젝트는 Apache-2.0 라이선스 하에 배포됩니다.

---
*행운을 빕니다! 본 앱의 추천 번호는 재미를 위한 것이며 당첨을 보장하지 않습니다.*
