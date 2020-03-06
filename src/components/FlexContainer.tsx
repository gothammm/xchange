import styled from 'styled-components';

interface FlexContainerProps {
  flexDirection: string;
}

const FlexContainer = styled.div<FlexContainerProps>`
  display: flex;
  flex: 1;
  flex-direction: ${(props: FlexContainerProps) => props.flexDirection || 'column'};
`;

export default FlexContainer;
