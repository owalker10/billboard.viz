import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import ContextProvider from './context/GlobalContext'
import theme from './styles/theme'
import ContentPage from './layouts/ContentPage'
import SplashPage from './pages/SplashPage'
import VizPage from './pages/VizPage'


function App() {

  return (
    <div className="App" style={{minHeight: '100vh'}}>
      <ContextProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline>
            <Router>
              <Switch>
                <Route path='/viz'>
                  <VizPage/>
                </Route>
                <Route path='/about'>
                  <ContentPage>
                    <span>hello</span>
                  </ContentPage>
                </Route>
                <Route path='/'>
                  <SplashPage/>
                </Route>
              </Switch>
            </Router>
          </CssBaseline>
        </ThemeProvider>
      </ContextProvider>
    </div>
  );
}

export default App;
