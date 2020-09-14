import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './dashboard/Dashboard';


ReactDOM.render(
  // <ThemeProvider theme={theme}>
  //   {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
  //   <CssBaseline />
  //   <Dashboard />
  // </ThemeProvider>,
  <Dashboard />,
  document.querySelector('#root'),
);
