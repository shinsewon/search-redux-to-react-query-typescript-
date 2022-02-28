import React from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import SearchListComponent from 'components/SearchListCompnent';
import { Form, Input, Button } from 'antd';
import { actions } from '../redux/search/action';

function SearchPage() {
  const list = useSelector((state: RootStateOrAny) => state.list);
  const isLoading = useSelector((state: RootStateOrAny) => state.isLoading);
  const isError = useSelector((state: RootStateOrAny) => state.isError);
  const dispatch = useDispatch();

  const onFinish = (value: { child_name: string }) => {
    dispatch(actions.requestChildList(value));
  };

  return (
    <Container>
      <Form layout={'vertical'} onFinish={onFinish}>
        <Form.Item name={'child_name'} label={'학생명'}>
          <Input size={'large'} />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType={'submit'}
            size={'large'}
            style={{ width: '100%' }}
            type="primary"
          >
            검색
          </Button>
        </Form.Item>
      </Form>
      <SearchListComponent list={list} />
      {!!isLoading && <p>전송중</p>}
      {!!isError && <p>에러!!</p>}
    </Container>
  );
}

export default SearchPage;

const Container = styled.div`
  width: 1080px;
  margin: 20px auto;
`;
