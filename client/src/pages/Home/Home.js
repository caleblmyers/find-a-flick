import React, { Component } from 'react';

import API from '../../lib/API'
import Featured from '../../components/Featured'

class HomePage extends Component {
  render() {
    return (
      <div className='Home'>
        <Featured />
      </div>
    );
  }
}

export default HomePage;
