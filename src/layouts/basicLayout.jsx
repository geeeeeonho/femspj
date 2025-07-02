// React 컴포넌트 파일: basicLayout 컴포넌트 기능
/*
  파일: basicLayout.jsx
  설명: React 컴포넌트 파일: basicLayout 컴포넌트 기능을 구현합니다.
*/

import { NavLink } from "react-router";
import TopMenuComponent from "../components/menu/topMenu";

function BasicLayout({children}) {
    return ( 
<>

  <TopMenuComponent/>    
  
  <div className="container mx-auto py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {children}
  </div>
</>  
     );
}

export default BasicLayout;