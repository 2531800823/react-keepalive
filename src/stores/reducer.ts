type actionType = {
  type: string;
  payload: any;
};

import * as cacheType from "./cache-type";

const reducerKeepalive = (
  state: { [key: string]: any } = {},
  { type, payload }: actionType
) => {
  switch (type) {
    case cacheType.CREATE:
      return {
        ...state,
        [payload.cacheId]: {
          scrolls: {},
          cacheId: payload.cacheId,
          element: payload.element,
        },
      };
    case cacheType.CREATED:
      return {
        ...state,
        [payload.cacheId]: {
          ...state[payload.cacheId],
          doms: payload.doms,
        },
      };
    case cacheType.DESTROY:
      return {
        ...state,
        [payload.cacheId]: undefined,
      };
    default:
      return state;
  }
};
export default reducerKeepalive;
