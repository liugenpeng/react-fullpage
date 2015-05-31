var React = require("react");
var FullPage = require('./fullpage/FullPage.react.js');
var HomePage = require('./fullpage/pages/HomePage.react.js');
var AboutPage = require('./fullpage/pages/AboutPage.react.js');
var App = React.createClass({
	getDefaultProps:function(){
		return {
			pages:[
				HomePage,AboutPage
			]
		};
	}
	,onChange:function(){
		//console.log("xxx");
	}
	,render:function() {
		return (
			<FullPage onChange={this.onChange}  pages={this.props.pages}
			 dir="v" />
		);
	}
});


React.render(
	<App ></App> 
	, 
document.getElementById('root'));

