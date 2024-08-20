import React from 'react';
import ReportBuilder from './components/ReportBuilder';

function App() {
  return (
    <div className="App">
      <ReportBuilder />
    </div>
  );
}

export default App;







// import React from 'react';
// import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
// import ReportBuilder from './components/ReportBuilder';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//   },
// });

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <ReportBuilder />
//     </ThemeProvider>
//   );
// }

// export default App;