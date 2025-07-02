// React 컴포넌트 파일: todoAddPage 컴포넌트 기능
/*
  파일: todoAddPage.jsx
  설명: React 컴포넌트 파일: todoAddPage 컴포넌트 기능을 구현합니다.
*/

import { useContext } from "react";
import CountContext from "../../store/countContext";

function TodoAddPage() {

    const {count} = useContext(CountContext)

    return ( 
        <div>
            <div>Todo Add Page {count}</div>
        </div>
     );
}

export default TodoAddPage;