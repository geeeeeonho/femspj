# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---------------------------------------
React
역할: 사용자 인터페이스(UI)를 구성하는 핵심 JavaScript 라이브러리.
특징:
컴포넌트 기반 구조로 유지보수 용이.
상태(state) 관리와 훅(hook)을 활용한 동적인 UI 구성.
SPA(Single Page Application) 제작에 적합.

2. React Router
역할: 페이지 간 이동(라우팅)을 처리.
특징:
createBrowserRouter, NavLink, useNavigate 등을 통해 URL에 따라 화면을 동적으로 변경.
Suspense와 lazy를 통해 페이지 로딩을 지연시켜 성능 최적화.

3. Tailwind CSS
역할: 빠르고 유연한 스타일링을 위한 CSS 프레임워크.
특징:
클래스 기반 유틸리티 스타일링 (예: bg-gray-100, text-center, rounded-lg).
별도의 CSS 파일 없이도 HTML/JSX 내에서 직접 스타일 조정 가능.
반응형(responsive) 디자인, 테마 커스터마이징이 쉬움.

4. Vite
역할: 프론트엔드 빌드 도구. 개발 서버를 빠르게 띄워주고, 프로덕션 빌드도 빠름.
특징:
npm run dev로 빠른 개발 환경 구동.
최신 브라우저 기능(ESM 등)을 활용한 모듈 번들링 최적화.
React + TypeScript 프로젝트에 최적화되어 있음.

5. Chart.js + react-chartjs-2
역할: 차트 시각화를 위한 라이브러리.
특징:
주간/월간 전력 데이터 시각화를 위한 선형(line) 차트, 원형(pie) 차트 지원.
react-chartjs-2는 Chart.js를 React 컴포넌트로 쉽게 쓸 수 있게 도와주는 래퍼.

6. JSX (JavaScript XML)
역할: JavaScript와 HTML을 합친 문법으로 React 컴포넌트를 선언할 때 사용.
특징:
HTML 태그처럼 보이지만 JavaScript 문법 내부에서 사용 가능.
JSX를 통해 UI 구조를 직관적으로 작성 가능.

7. 기타
라우터 파일 (root.jsx): 모든 페이지를 BasicLayout으로 감싸고 라우팅.

레이아웃 폴더 (layouts/): 공통적인 페이지 틀 구조. 예: Top/Left 메뉴 등 포함.

컴포넌트 폴더 (components/): 재사용 가능한 UI 구성요소 (예: 메뉴, 차트, 로그인 폼 등).

페이지 폴더 (pages/): 실제 사용자에게 보여지는 개별 화면.

Context API (authContext.js): 로그인 상태 관리 등 전역 상태를 위한 React 기능.

-----------------------------------------
깃으로 가져온 파일을 로컬 테스트 실행시

npm install (의존성 설치)
npm install react-router-dom (라우터 설치)
npm install react-datepicker (추가 설치)
npm run dev 실행

-----------------------------------------
배포를 위해서
이 파일 위치에서
npm run build

파워셀로 이 파일 위치에서
icacls "C:\PROJECT\smartfactory-key.pem" /inheritance:r
icacls "C:\PROJECT\smartfactory-key.pem" /grant:r "${env:USERNAME}:R"

EC2 안에서 배포 반영 명령 실행(그냥 내PC에서)
ssh -i "C:\PROJECT\smartfactory-key.pem" ubuntu@43.202.118.48

sudo rm -rf /var/www/html/*
sudo cp -r ~/dist/* /var/www/html/
sudo systemctl restart nginx

이 상태에서 웹사이트에 http://43.202.118.48를 검색하면 성공

----------------------------------------
업데이트 과정
이 리액트 파일 위치에서
npm run build

빌드 파일 EC2로 업로드
scp -i "C:\PROJECT\smartfactory-key.pem" -r dist ubuntu@43.202.118.48:~/
ssh -i "C:\PROJECT\smartfactory-key.pem" ubuntu@43.202.118.48
sudo rm -rf /var/www/html/*
sudo cp -r ~/dist/* /var/www/html/
sudo systemctl restart nginx
