import React from 'react';
import { ButtonWrapper } from './ButtonWrapper';

interface Props {
  title: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>, parametr?: number) => void ;
  isButtonDisabled?: boolean;
  parametr?: number;
  isButtonActive?: boolean;
}

const Button: React.FC<Props> = (props) => {
  const {
    isButtonDisabled = false,
    isButtonActive = false,
  } = props;

  return (
    <ButtonWrapper
      type='button'
      isButtonDisabled={isButtonDisabled}
      onClick={props.onClick}
      isButtonActive={isButtonActive}
      >
      {props.title}
    </ButtonWrapper>
  );
}

export default Button;