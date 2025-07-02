// React 컴포넌트 파일: todoReadPage 컴포넌트 기능
/*
  파일: todoReadPage.jsx
  설명: React 컴포넌트 파일: todoReadPage 컴포넌트 기능을 구현합니다.
*/

import { useParams } from "react-router";

function TodoReadPage() {

    const {tno} = useParams()

    return ( 
        <div>
            <div>Todo Read Page   {tno} </div>
        </div>
     );
}

export default TodoReadPage;