var React = require( 'react');
var {render} = require('react-dom');

var Console = React.createClass({
    getInitialState: function () {
        return{history: [], prompt: '> '};
    },
    render: function () {
        return (<p> {this.state.prompt} </p>);
    }
});

render(<Console/>, document.getElementById('app'));