import React from "react";
import * as cacheType from "../stores/cache-type";

const Home = (props: any) => {
  return (
    <div>
      <button
        onClick={() =>
          props.dispatch({
            type: cacheType.DESTROY,
            payload: { cacheId: "UserAdd" },
          })
        }
      >
        重置UserAdd
      </button>
      <button
        onClick={() =>
          props.dispatch({
            type: cacheType.DESTROY,
            payload: { cacheId: "UserList" },
          })
        }
      >
        重置UserList
      </button>
    </div>
  );
};
export default Home;
