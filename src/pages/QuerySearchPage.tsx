import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Form, Input, Button } from 'antd';
import { getChildByName } from '../api/API';
import SearchListComponent from '../components/SearchListCompnent';

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

const Container = styled.div`
  width: 1080px;
  margin: 20px auto;
`;
