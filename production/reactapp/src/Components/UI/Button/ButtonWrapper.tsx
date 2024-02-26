import styled from "styled-components";

export const ButtonWrapper = styled.button<{
  isButtonDisabled?: boolean,
  isButtonActive?: boolean
}>`

  border: ${(props) =>
    props.isButtonActive ?
      props.theme.colors.button__active__border
      : props.theme.colors.button__border
  };
  width: 60px;
  height: 30px;

  margin-right: 15px;
  margin-left: 15px;

  cursor: pointer; 

  background-color: ${(props) =>
    props.isButtonActive ?
      props.theme.colors.button__active
      : props.theme.colors.button__color
  };

  display: ${(props) => props.isButtonDisabled ? 'none' : 'display'};
`;
