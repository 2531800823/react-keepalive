import React, { FC, ReactNode, useContext, useEffect, useRef } from "react";

interface withKeepAliveProps {}

import keepaliveContent from "../stores/content";
import * as cacheType from "../stores/cache-type";

const withKeepAlive = (
  OldDocumen: FC,
  { cacheId = "", scroll = false }
): FC => {
  return function (props: withKeepAliveProps) {
    const {} = props;

    const { state, dispatch, scrollCache } = useContext(keepaliveContent);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (scroll) {
        divRef.current?.addEventListener(
          "scroll",
          scrollCache.bind(null, cacheId),
          true
        );
      }
    }, [scrollCache]);

    useEffect(() => {
      if (state[cacheId] && state[cacheId]?.doms) {
        const doms = state[cacheId]?.doms;
        doms?.forEach((dom: HTMLDivElement) => {
          (divRef.current as HTMLDivElement).appendChild(dom);

          if (scroll) {
            if (state[cacheId].scrolls[dom as unknown as string]) {
              dom.scrollTop = state[cacheId].scrolls[dom as unknown as string];
            }
          }
        });
      } else if (!state[cacheId]) {
        dispatch({
          type: cacheType.CREATE,
          payload: {
            element: <OldDocumen {...props} dispatch={dispatch} />,
            cacheId,
          },
        });
      }
    }, [state]);

    return <div id={`dom-${cacheId}`} ref={divRef}></div>;
  };
};

export default withKeepAlive;
