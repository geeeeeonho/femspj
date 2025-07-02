// React 컴포넌트 파일: todoApi 컴포넌트 기능
/*
  파일: todoApi.jsx
  설명: React 컴포넌트 파일: todoApi 컴포넌트 기능을 구현합니다.
*/

import axios from "axios";

export async function getTodoList(page) {

    //https://jsonplaceholder.typicode.com/todos

    const res = await axios.get(`https://jsonplaceholder.typicode.com/todos?_page=${page}`)

    return res.data


}