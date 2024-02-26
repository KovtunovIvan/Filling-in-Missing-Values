import styled from "styled-components";

export const LoginWrapper = styled.div`
  font-family:'Montserrat', sans-serif;

  .login_container{
    width: 100w;
    height: 100h;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content:space-evenly;
  }

  .login_form{
    padding-top: 15px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content:space-evenly;
  }

  .login_textfield{
    width: 100%;
    margin: 7px 0 7px 0;
  }
`;