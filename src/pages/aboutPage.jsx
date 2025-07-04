// React 컴포넌트 파일: aboutPage 컴포넌트 기능
/*
  파일: aboutPage.jsx
  설명: React 컴포넌트 파일: aboutPage 컴포넌트 기능을 구현합니다.
*/

import BasicLayout from "../layouts/basicLayout";

function AboutPage() {
    return ( 
        <BasicLayout>
        <div>
            <h1>
                저희는 기존 FEMS 시스템을 보다 쉽고 간편하게 제공을 목표로 하는 솔루션 제공 프로그램입니다.
                <br></br>기본적인 감지 외에도 실시간으로 전력의 기준치 초과의 사태의 경우 빠르게 알람으로 제공합니다.
                <br></br>각각의 메뉴는 다음과 같은 역할을 합니다.
            </h1>
            <h2>
                <br></br>먼저 전력 소모 항목입니다.
                <br></br>전력 소모와 관련된 항목으로 전체 전력 소모, 설비라인별 전력 소모를 기본적으로 제시합니다.
            </h2>
        </div>
        </BasicLayout>
    );
}

export default AboutPage;