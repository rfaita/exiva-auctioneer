import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import Application from './pages/Application';
import LoginProvider from './providers/LoginProvider';
import { SnackbarProvider } from 'notistack';


const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#F1E0C6',
      main: '#D4C0A1',
      dark: '#5A2800'
    },
    secondary: {
      main: '#5A2800',
    }
  },
});


function App() {

 
  return (

    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={5} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <LoginProvider>
          <Application />
        </LoginProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
