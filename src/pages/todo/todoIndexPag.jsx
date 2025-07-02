// React 컴포넌트 파일: todoIndexPag 컴포넌트 기능
/*
  파일: todoIndexPag.jsx
  설명: React 컴포넌트 파일: todoIndexPag 컴포넌트 기능을 구현합니다.
*/

import { NavLink, Outlet } from "react-router";
import BasicLayout from "../../layouts/basicLayout";
import { useState } from "react";
import CountContext from "../../store/countContext";

function TodoIndexPage() {

    const [count,setCount] = useState(33)

    const change = () => {
        setCount(() => count + 1)
    }

    return ( 
        <BasicLayout>
            <CountContext.Provider value={ {count,change }}>
            <div className="w-full">
                Todo Menus...
                <div> <NavLink to={'/todo/add'}>ADD</NavLink></div>
            </div>
            <div className="w-full">
                <Outlet/>
            </div>
            </CountContext.Provider>
        </BasicLayout>
    );
}

export default TodoIndexPage;