// React 컴포넌트 파일: testContext 컴포넌트 기능
/*
  파일: testContext.jsx
  설명: React 컴포넌트 파일: testContext 컴포넌트 기능을 구현합니다.
*/

import { createContext, useState } from "react";

export const TestContext = createContext()

function TestContextWrapper({children}) {

  const [account, setAccount]  = useState({uid:"", nickname:""})

  const signin = (uid, nickname) => {

    setAccount(() => ({uid, nickname}))
  }

  return (
    <TestContext.Provider value={{account, signin}}>
      {children}
    </TestContext.Provider>
  )

}


export default TestContextWrapper