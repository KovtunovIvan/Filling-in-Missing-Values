// import original module declarations
import 'styled-components';


// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    phone: {
      marginHorizontal: string,
      marginVertical: string,
    },
  
    colors: {
      button__border: string,
      button__color: string,
      button__active: string,
      button__active__border: string,
      phone__background: string,
      title__number: string,
      input: string,
      extraText: string,
      body: string,
      globalTitle: string,
    },
  }
}