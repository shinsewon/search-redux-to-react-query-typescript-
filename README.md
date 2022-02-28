# Redux에서 React-Query로 쉽게 간단 검색 기능 구현하기

React-Query를 사용하여 Redux보다 쉽게 검색 기능을 구현

## Redux 단점

1. 사소한 기능조차 리덕스로 구현하려면 몇 개의 파일들을 필수로 작성하여야 한다.
2. 보일러 플레이트 코드(액션 타입, 액션 생성함수, 리듀서)를 많이 준비해야 함


## Redux로 검색기능 일부 구현 
```
// redux/search/action.js

import { createAction } from '../common/createActionReducer';

export enum ActionType {
  RequestChild = 'search/REQUEST_CHILD',
  AddChildList = 'search/ADD_CHILD_LIST',
  SetLoading = 'search/SET_LOADING',
  Error = 'search/ERROR',
}

export const actions = {
  requestChildList: (child: { child_name: string }) =>
    createAction(ActionType.RequestChild, child),
  addChildList: (list: any[]) => createAction(ActionType.AddChildList, list),
  setLoading: (isLoading: boolean) =>
    createAction(ActionType.SetLoading, isLoading),
  error: (isError: boolean) => createAction(ActionType.Error, isError),
};

// redux/search/reducer.js

import { actions, ActionType } from './action';
import { createReducer } from '../common/createActionReducer';

export interface IState {
  list: any[];
  isLoading: boolean;
  isError: boolean;
}

const INITIAL_STATE = {
  list: [],
  isLoading: false,
  isError: false,
};
type Action = ReturnType<typeof actions[keyof typeof actions]>;

export default createReducer<IState, ActionType, Action>(INITIAL_STATE, {
  [ActionType.RequestChild]: (state) => state,
  [ActionType.AddChildList]: (state, action) => (state.list = action.payload),
  [ActionType.SetLoading]: (state, action) =>
    (state.isLoading = action.payload as unknown as boolean),
  [ActionType.Error]: (state, action) =>
    (state.isError = action.payload as unknown as boolean),
});

// redux/search/saga.js

import { take, all, put, fork, call } from 'redux-saga/effects';
import { actions, ActionType } from './action';
import { getChildByName } from '../../api/API';

export function* fetchSearchChildList() {
  while (true) {
    const { payload } = yield take(ActionType.RequestChild);
    yield put(actions.setLoading(true));

    try {
      const { result } = yield call(
        getChildByName,
        payload.child_name === undefined
          ? ''
          : `?child_name=${payload?.child_name}`,
      );
      yield put(actions.addChildList(result));
      yield put(actions.error(false));
    } catch (e) {
      yield put(actions.error(true));
    }
    yield put(actions.setLoading(false));
  }
}

export default function* watcher() {
  yield all([fork(fetchSearchChildList)]);
}

...
```

## React-Query 장점

1. 손 쉬운 상태 관리
2.서버 데이터 캐싱
3.데이터 패칭 시 로딩, 에러 처리를 한 곳에서 처리 가능
4.prefetching, retry 등 다양한 옵션


## React-Query로 검색기능 구현 

```
// index.tsx
{...}
import { QueryClientProvider, QueryClient } from 'react-query';
import App from './App';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.render(
    <QueryClientProvider client={client}>
        <App />
    </QueryClientProvider>,
  document.getElementById('root'),


// src/QuerySearchPage.tsx

import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { getChildByName } from '../api/API';
import SearchListComponent from '../components/SearchListCompnent';
{...}

function QuerySearchPage() {
  const [name, setName] = useState('');
  const { data } = useQuery(['list', name], () => getChildListData(name));

  const getChildListData = useCallback(async (childName) => {
    const { result } = await getChildByName(
      childName ? `?child_name=${childName}` : '',
    );
    return result;
  }, []);

  const onFinish = (value: { child_name: string }) => {
    setName(value.child_name);
  };

  return (
    <Container>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="child_name" label="학생명">
          <Input size="large" />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            size="large"
            style={{ width: '100%' }}
            type="primary"
          >
            검색
          </Button>
        </Form.Item>
      </Form>
      <SearchListComponent list={data} />
    </Container>
  );
}

export default QuerySearchPage;

```
리덕스의 단점이었던 긴 보일러플레이트 코드와 가독성이 개선되었다.
