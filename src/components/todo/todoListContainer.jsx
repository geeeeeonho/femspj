// React 컴포넌트 파일: todoListContainer 컴포넌트 기능
/*
  파일: todoListContainer.jsx
  설명: React 컴포넌트 파일: todoListContainer 컴포넌트 기능을 구현합니다.
*/

import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { getTodoList } from "../../apis/todoApi";
import CountContext from "../../store/countContext";


function TodoListContainer() {

    const {count, change} = useContext(CountContext)

    const [searchParam, setSearchParam] = useSearchParams()

    const page = searchParam.get("page") ||'1'

    const [todos, setTodos] = useState([])
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        setFetching(true)
        getTodoList(page).then((result) => {
            setFetching(false)
            console.log(result);
            setTodos(() => result)
        })
    }, [page])

    const navigate = useNavigate()

    const handleClickPage = (pageNum) => {

        navigate({pathname:"/todo/list", search:`?page=${pageNum}`})

    }


    return ( 
        <div>
            <div>Todo List Container</div>

            <div onClick={change}>COUNT {count}</div>

            {fetching && <div className="bg-amber-600 h-10 ">Todo List Loading..............</div>}

            <ul>
                {todos.map(todo => <li key={todo.id}> {todo.id} ------ {todo.title} </li>)}
            </ul>

            <div>
                <ul className="flex m-3 p-3">
                    <li className="p-2 m-2 " onClick={() => handleClickPage(1)}>1</li>
                    <li className="p-2 m-2 " onClick={() => handleClickPage(2)}>2</li>
                    <li className="p-2 m-2 " onClick={() => handleClickPage(3)}>3</li>
                    <li className="p-2 m-2 " onClick={() => handleClickPage(4)}>4</li>
                    <li className="p-2 m-2 " onClick={() => handleClickPage(5)}>5</li>

                </ul>
            </div>
        </div>
     );
}

export default TodoListContainer;