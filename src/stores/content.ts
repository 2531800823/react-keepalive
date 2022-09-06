import React from "react";

interface IContent {
  state: any;
  dispatch: any;
  scrollCache: any;
}

const keepaliveContent = React.createContext<IContent>({
  state: {},
  dispatch: () => {},
  scrollCache: () => {},
});

export default keepaliveContent;
