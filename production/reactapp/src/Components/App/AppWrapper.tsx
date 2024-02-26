import styled, {createGlobalStyle} from "styled-components";

export const AppGlobalStyle = createGlobalStyle`
  * {
    margin: 0;
  }

  body {
    background-color: ${props => props.theme.colors.body};
  }
  
  .main{
    display: flex;
    justify-content: center;
  }

  .global__container {
    background-color: ${props => props.theme.colors.input};
    max-width: 1000px;
    width: 90%;
    margin: 0;
    margin-top: 60px;

    font-family:'Montserrat', sans-serif;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .global__title {
    padding-top: 30px;
    font-size: 30px;
    color: ${props => props.theme.colors.globalTitle};
  }

  @media screen and (max-width: 400px) {
    body {
      background-color: ${props => props.theme.colors.phone__background};
    }

    .global__container {
      background-color: ${props => props.theme.colors.phone__background};
      margin-top: 20px;
    }
  }
`;

export const AppWrapper = styled.div`
  font-family:'Montserrat', sans-serif;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:space-evenly;

  padding-bottom: 30px;

`;