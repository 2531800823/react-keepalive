import React, { FC, Fragment, ReactNode, useCallback, useReducer } from "react";

interface KeepAliveProviderProps {
  children: ReactNode;
}
import * as cacheType from "../stores/cache-type";

import keepaliveContent from "../stores/content";
import reducer from "../stores/reducer";

const KeepAliveProvider: FC<KeepAliveProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, {});

  const mout = useCallback(
    ({ cacheId, element }: any) => {
      if (state[cacheId])
        dispatch({
          type: cacheType.CREATE,
          payload: { element, cacheId },
        });
    },
    [state]
  );

  const scrollCache = useCallback(
    (cacheId: string, { target }: any) => {
      if (state[cacheId]) {
        let scrolls = state[cacheId].scrolls;
        scrolls[target] = target.scrollTop;
      }
    },
    [state]
  );

  return (
    <keepaliveContent.Provider value={{ state, dispatch, scrollCache }}>
      {children}

      {Object.values(state)
        ?.filter((item) => item)
        .map(({ cacheId, element }: any) => {
          return (
            <Fragment key={cacheId}>
              {true && (
                <div
                  id={`cache-${cacheId}`}
                  ref={(dom) => {
                    if (dom && !state[cacheId].doms) {
                      dispatch({
                        type: cacheType.CREATED,
                        payload: { cacheId, doms: Array.from(dom?.childNodes) },
                      });
                    }
                  }}
                >
                  {element ?? null}
                </div>
              )}
            </Fragment>
          );
        })}
    </keepaliveContent.Provider>
  );
};

export default KeepAliveProvider;
