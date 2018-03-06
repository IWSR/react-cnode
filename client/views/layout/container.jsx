import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';

const styles = {
  root: {
    margin: 24,
    marginTop: 80,
  },
};

const Container = ({ children, classes }) => (
  <Paper elevation={4} className={classes.root}>
    { children }
  </Paper>
);

Container.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
  ]),
};

export default withStyles(styles)(Container);
