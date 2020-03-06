import React from 'react';
import Button, { ButtonProps } from 'antd/lib/button';
import styled from 'styled-components';
import FlexContainer from './FlexContainer';

const ActionButtonWrapper = styled(FlexContainer)`
  flex: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TextWrapper = styled.span`
  margin-top: 1em;
`;

const XChangeButton: React.FC<ButtonProps & { text: string }> = props => {
  return (
    <ActionButtonWrapper>
      <Button {...props} />
      <TextWrapper>{props.text}</TextWrapper>
    </ActionButtonWrapper>
  );
};

export default XChangeButton;
