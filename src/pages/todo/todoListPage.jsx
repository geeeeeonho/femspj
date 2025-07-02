// React 컴포넌트 파일: todoListPage 컴포넌트 기능
/*
  파일: todoListPage.jsx
  설명: React 컴포넌트 파일: todoListPage 컴포넌트 기능을 구현합니다.
*/

import { useSearchParams } from "react-router";
import TodoListContainer from "../../components/todo/todoListContainer";
import { useContext } from "react";
import CountContext from "../../store/countContext";

function TodoListPage() {

    const {count} = useContext(CountContext)
    


    return (
        <div>
            <div>Todo List Page {count} </div>
            <TodoListContainer/>

        </div>
    );
}

export default TodoListPage;