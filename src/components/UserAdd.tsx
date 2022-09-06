import React, { FC } from "react";

const UserAdd: FC = () => {
  let [number, setNumber] = React.useState(0);
  return (
    <div>
      用户名:
      <input />
      <hr />
      <button
        onClick={() => {
          console.log(1);
          setNumber((number) => number + 1);
        }}
      >
        {number}
      </button>
    </div>
  );
};
export default UserAdd;
