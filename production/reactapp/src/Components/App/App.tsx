import { Routes, Route, BrowserRouter } from "react-router-dom";

import Login from "../Login/Login";
import Register from "../Register/Register";
import User from "../User/User";
import Navbar from "../Navbar/Navbar";

import { RequireAuth } from "./requireauth";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import jwt_decode from "jwt-decode";
import { LocalStorageTools } from "../../localStorage";
import { DecodedJWT, Token } from '../../types'
import { setUser } from "../../redux/userData";
import { userCheck } from "../../api/userApi";
import { useEffect } from "react";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userData.username);

  useEffect(() => {
    (async () => {
      try {
        const tokens: Token = LocalStorageTools.getItemFromLocalStorage('tokens')
        const userInfo: DecodedJWT | null = tokens ? jwt_decode(tokens.access) : null;
        if (userInfo) {
          userCheck(userInfo.user_id).then((response) => {
            dispatch(setUser(response?.data))
          })
        }

      } catch (err) {
        console.log(`Error! Unable to check tokens! ${err}`);
      }
    })();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        {user
          ?
          <Routes>
            <Route path="/user" element={
              <RequireAuth>
                <User />
              </RequireAuth>
            } />
          </Routes>
          : null}
      </div>
    </BrowserRouter>
  );
}

export default App;
