var React = require("react");
var HelloWorld = React.createClass({
	getDefaultProps:function () {
		return {};
	}
	,getInitialState:function(){
		return {
			active:false
		};
	}
	,initPage:function(){
		// 实现自己的逻辑
		return (<div>默认的首页返回内容</div>);
	}
	,render:function(){
		var self = this;
		var component ;
		if(self.state.active){
			component = (<div>欢迎欢迎</div>);
		}else{
			component = (
				<div>
					首页
				</div>
			);
		}
		return component;
		
	}
});
module.exports = HelloWorld;