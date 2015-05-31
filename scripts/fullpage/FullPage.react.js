var React = require("react");
var classNames = require('classnames');
var FullPage = React.createClass({
	getDefaultProps:function () {
		return {
			page: '.page',
		    start: 0,
		    duration: 500,
		    drag: false,
		    loop: false,
		    dir: 'v'
		};
	}
	,getInitialState:function(){
		return {
			 page:this.props.page
			,start:this.props.start
			,duration:this.props.duration
			,drag:this.props.drag
			,loop:this.props.loop
			,dir:this.props.dir
			,movingFlag:false
			,status:1
			,curIndex:-1
			,pHeight:window.screen.height
		};
	}

	//挂载到dom
	,componentDidMount:function(){
		var self = this;
		//检测是否配置了页面：至少配置一个
		if(!this.props.pages || this.props.pages.length == 0 ){
			throw new Error("至少配置一个页面！");
		}

		self.$this = $(React.findDOMNode(this.refs.wpInner));
		self.$parent = self.$this.parent();
		self.update();
		self.initEvent();
		window.addEventListener("resize", function() {
                self.update();
        }, false);
		//重新执行render，目的是动态高度
		self.setState({
			pagesLength: self.props.pages.length 
			,pHeight: self.$parent.height()
			,pWidth: self.$parent.width()
		});
	}
	,render:function(){
		//滑屏方向 true :竖直滑动 false:水平滑动
		var vORh = this.state.dir === 'v' ?true:false;
		//包裹层(容器)样式
		var wpInnerClass = {
			"wp-inner":true
			,"anim":this.state.anim
			,"fullPage-wp":true
		};
		
		var dist = -this.state.curIndex * ( vORh ? this.state.pHeight : this.state.pWidth);

		var translate = vORh ? 'translateY' : 'translateX';
		//引入类库之后，可以通过extend减少部分代码
		var wpInnerStyle= vORh ? {
			'WebkitTransform':translate+ '(' + dist + 'px)'
			,'transform':translate + "(" + dist + "px)"
		} :{
			'WebkitTransform':translate+ '(' + dist + 'px)'
			,'transform':translate + "(" + dist + "px)"
			,"width":this.state.pagesLength*this.state.pWidth+"px"
		};
		var ItemStyle = vORh ? {
			height:this.state.pHeight+"px"
		}:{
			height:this.state.pHeight+"px",
			width:this.state.pWidth+"px"
		};
		var componentList = [];
		//可以改写成声明式编程方法
		for(var i = 0 , len = this.props.pages.length ; i < len ;i++){
			var Component = this.props.pages[i];
			
			var componentClass = classNames("page  page"+(i+1),{
				page:true
				,"fullPage-page":true
				,"fullPage-dir-v":vORh
				,"fullPage-dir-h":!vORh
			});

			componentList.push(
				<div  className={componentClass} key={"full-page-key-"+(i+1)}  style={ItemStyle}  >
					<Component ref={"page-ref-"+(i+1)}/>
				</div>
			);
		}
		return (
			<div className="wp">
		        <div className={classNames(wpInnerClass)} ref="wpInner" style={wpInnerStyle}>
		           {componentList}
		        </div>
    		</div>
		);
	}
	,update:function(){
		var self = this;
		if (self.state.dir === 'h') {
            self.setState({
            	pWidth:this.$parent.width()
            });
        }

        self.setState({
        	pHeight:self.$parent.height()
        });
        self.moveTo(this.state.curIndex < 0 ? this.state.start : this.state.curIndex);
	}
	//before
	,beforeChange:function(position){

	}
	//ing
	,change:function(position){}
	//after
	,onChange:function(position){
		var refName = "page-ref-"+(position.cur+1);
		this.refs[refName].setState({
			active:true
		});
		if(this.props.onChange) this.props.onChange(position);
	}
	,fix:function(cur, pagesLength, loop){
		 if (cur < 0) {
           	 return !!loop ? pagesLength - 1 : 0;
        }else if (cur >= pagesLength) {
            return !!loop ? 0 : pagesLength - 1;
        }
        return cur;
	},moveTo:function(next, anim){

		var self = this;
        var $this = self.$this;
        var cur = self.state.curIndex;
        next = self.fix(next, self.state.pagesLength, self.state.loop);
		if (next !== cur) {
            //触发改变前事件
            self.beforeChange({
                next: next,
                cur: cur
            });
            //状态改变
            self.setState({
            	anim: anim
            	,movingFlag: true
            	,curIndex: next
       		});
       		//触发后
       		self.change({
                prev: cur,
                cur: next
            });

           
         }
          window.setTimeout(function() {
            	self.setState({
            		movingFlag:false
            	});
            	if (next !== cur) {
	            	self.onChange({
						 prev: cur
	                    ,cur: next
	            	});
	            }
              
            }, self.state.duration);
	}
	//注册事件
	,initEvent:function(){
		var self  = this;
        var $this = self.$this;
        //touch start事件
        $this.on('touchstart', function(e) {
            if (!self.state.status) {return 1;}
                //e.preventDefault();
            if (self.state.movingFlag) {
                    return 0;
            }
            self.setState({
            	startX : e.targetTouches[0].pageX
            	,startY : e.targetTouches[0].pageY	
            });
          
        });
        //touch end事件
        $this.on('touchend', function(e) {
                if (!self.state.status) {return 1;}
                //e.preventDefault();
                if (self.state.movingFlag) {
                    return 0;
                }
                var sub = self.state.dir === 'v' ? e.changedTouches[0].pageY - self.state.startY : e.changedTouches[0].pageX - self.state.startX;
                var der = (sub > 30 || sub < -30) ? sub > 0 ? -1 : 1 : 0;
                if(der == 0) return ;

                self.moveTo(self.state.curIndex + der, true);
        });
	}
});
module.exports = FullPage;