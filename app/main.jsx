// Required node modules
var React = require('react');
var ReactDOM = require('react-dom')

var Dashboard = require('./components/Dashboard.jsx');

var MainView = React.createClass({

  getInitialState: function(){
    return {
    };
  },

  componentWillMount: function(){
  },

  render: function(){
    return (
      <div>
        <Dashboard> </Dashboard>
      </div>
    );
  },

});

ReactDOM.render(<MainView />, document.getElementById('app-root'));
