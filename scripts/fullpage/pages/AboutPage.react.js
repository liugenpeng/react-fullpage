var React = require("react");
var About = React.createClass({
	getDefaultProps:function () {
		return {};
	}
	,getInitialState:function(){
		return {
			active:false
		};
	}
	//必须要实现的方法
	//return 真正的dom结构
	,initPage:function(){
		// 实现自己的逻辑
		return (<div>默认的关于React返回内容</div>);
	}
	,render:function(){
		//第一次显示的内容可以放个loading,可以通过mixins实现每个页面的加载方法
		var self = this;
		var component ;
		if(self.state.active){
			component = self.initPage();
		}else{
			component = (
				<div>
					关于
				</div>
			);
		}
		return component;
		
	}
});
module.exports = About;