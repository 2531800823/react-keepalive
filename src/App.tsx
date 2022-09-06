import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes as Switch,
} from "react-router-dom";
import Home from "./components/Home";
import UserList from "./components/UserList";
import UserAdd from "./components/UserAdd";
import { KeepAliveProvider, withKeepAlive } from "./lib";
let KeepAliveHome = withKeepAlive(Home, { cacheId: "Home" });
let KeepAliveUserList = withKeepAlive(UserList, {
  cacheId: "UserList",
  scroll: true,
});
let KeepAliveUserAdd = withKeepAlive(UserAdd, { cacheId: "UserAdd" });
const App = () => {
  return (
    <Router>
      <KeepAliveProvider>
        <ul>
          <li>
            <Link to="/">首页</Link>
          </li>
          <li>
            <Link to="/list">用户列表</Link>
          </li>
          <li>
            <Link to="/add">添加用户</Link>
          </li>
        </ul>
        <Switch>
          <Route path={"/"} element={<KeepAliveHome />} exact />
          <Route path={"/list"} element={<KeepAliveUserList />} />
          <Route path={"/add"} element={<KeepAliveUserAdd />} />
        </Switch>
      </KeepAliveProvider>
    </Router>
  );
};
export default App;
