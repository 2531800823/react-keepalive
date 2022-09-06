# 路由上的keepalive



## 流程

1. 使用 withKeepAlive 高阶函数把组件传入 withKeepAlive(Home, { cacheId: "Home" });，返回值当作路由元素
   1. withKeepAlive 组件内 useEffect => 判断 首次创建，把 传入的组件 缓存到 state
   2. KeepAliveProvider  创建 div 把路由组件的孩子传入 state
   3. 通过 state 缓存代理后使用 appendChild 把缓存的dom拿到自己的元素下
2. 然后 KeepAliveProvider 包裹配置路由
3. 在 KeepAliveProvider  组件中，直接放入 children，然后渲染 state，创建缓存 div
4. 把路由组件 挂在到 div 上，给div 绑定一个 ref ，div 渲染完成
5. 通过 ref -》 dom.childNodes 获取所有的孩子 dom ，然后注册 路由组件到 state

### 核心思想

> 分装一封  content 把路由配置包裹起来，让原本的路由渲染，在路由包裹的同一层级下，进行渲染缓存

```tsx
  <keepaliveContent.Provider value={{ state, dispatch, scrollCache }}>
    {/* 这里是路由配置信息 */}  
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
                     // 给原始dom的ref放一个函数，当dom渲染成功会把真实dom元素传入进来
                    if (dom && !state[cacheId].doms) {
                       // 把真是dom元素的孩子全部放进 reducer 缓存里面
                      dispatch({
                        type: cacheType.CREATED,
                        payload: { cacheId, doms:Array.from(dom?.childNodes)},
                      });
                    }
                  }}
                >
        {/* 这个是 路由要渲染的 dom 元素，后面会通过 appendChild 转移到该渲染的位置 */}
                  {element ?? null}
                </div>
              )}
            </Fragment>
          );
        })}
    </keepaliveContent.Provider>
```

> 把渲染缓存的dom代理到要渲染的路由配置里面

```tsx
const divRef = useRef<HTMLDivElement>(null);

// 这个是记录 scroll 位置的操作
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
    // 判断 reducer 中是否已经存在了 虚拟 dom，初始化，肯定走 else if
    if (state[cacheId] && state[cacheId]?.doms) {
        // 当上层代理成功，会把代理的真是dom 的孩子放到 doms 里面
        const doms = state[cacheId]?.doms;
        doms?.forEach((dom: HTMLDivElement) => {
            // 循环插入路由配置占位里面
            (divRef.current as HTMLDivElement).appendChild(dom);
			// 这个是记录 scroll 位置的操作
            if (scroll) {
                if (state[cacheId].scrolls[dom as unknown as string]) {
                    dom.scrollTop = state[cacheId].scrolls[dom as unknown as string];
                }
            }
        });
    } else if (!state[cacheId]) {
        // 初始化创建对象，并把路由配置对象的 dom 传入进去
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
```

### 对象属性

```js
// reducer 维护的 state
state:{
    [cacheId]:{
        cacheId: 'state 对象唯一的标识',
        element: '路由配置传进来的 dom',
        doms:  '通过上面 dom 生成获取的 dom 的孩子 .childNodes:[]',
    }
}
```

