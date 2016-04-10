
//选择过度属性
var selectAllAttr = {
	attr : {  //过度属性配置
		xr : true,
		yr : false,
		w : false,
		h : false,
		xt : false,
		yt : false,
		zt : false
	},
	add : function(attrItem) { //添加过渡属性
		this.attr[attrItem] = true;
	},
	compTrue : function() { //已选择的数量
		var num = 0;
		for(var i in this.attr)
			if(this.attr[i])
				num ++;
		return num;
	},
	remove : function(attrItem) { //删除过度属性
		if(this.compTrue() > 1)
		{
			this.attr[attrItem] = false;
			return true;
		}
		else
			return false;
	},
	bindClick : function(){ //给每一项都绑定事件，事件为点击及选中
		var liItem = document.querySelectorAll(".selectAllAttr li .selectItem li");
		for(var i = 0; i < liItem.length; i++)
		{
			liItem[i].onclick = function() {
				var attrItem = this.getAttribute("saa");
				if(selectAllAttr.attr[attrItem])
				{
					if(selectAllAttr.remove(attrItem))
						this.getElementsByTagName('span')[0].style.display = "none";
				}
				else
				{
					selectAllAttr.add(attrItem);
					this.getElementsByTagName('span')[0].style.display = "block";
				}
			}
		}
		document.getElementById('selectAll').onclick = function(){ //全选
			for(var i in selectAllAttr.attr)
				selectAllAttr.attr[i] = true;
			for(var i = 0; i < liItem.length; i++)
				liItem[i].getElementsByTagName('span')[0].style.display = "block";
		}
	},
	setAttr : function(obj) //对外接口，配置属性
	{
		var liItem = document.querySelectorAll(".selectAllAttr li .selectItem li");
		for(var i = 0; i < liItem.length; i++)
			if(obj[liItem[i].getAttribute("saa")])
				liItem[i].getElementsByTagName('span')[0].style.display = "block";
			else
				liItem[i].getElementsByTagName('span')[0].style.display = "none";
		this.attr = allPic.clone(obj);
	}
};

//条条拖动
var bar = {
	colorBar : 0,
	left : 0,
	switchBar : function(that){ //根据参数that选择拖动的bar
		var node = that.parentNode;
		switch(node.id)
		{
			case 'color':compColor.compPro(this.left,that.getAttribute('long') - 0);break;
			case 'speed':compSpeed.compSpe(this.left,that.getAttribute('long') - 0);break;
		}
	},
	move : function(e) //onmousemove事件
	{
		e = e || window.event;
		
		bar.left = e.clientX - this.offsetLeft;
		if(bar.left > this.getAttribute('long') - 0)
			bar.left = this.getAttribute('long') - 0;
		if(bar.left < 0)
			bar.left = 0;
		this.getElementsByTagName('div')[0].style.left = bar.left + 'px';
		bar.switchBar(this);
	},
	down : function(e) //onmousedown事件
	{
		e = e || window.event;
		e.preventDefault();
		bar.left = e.clientX - this.offsetLeft;
		this.getElementsByTagName('div')[0].style.left = bar.left + 'px';
		bar.switchBar(this); //调用
		window.onmousemove = bar.move.bind(this);
		window.onmouseup = function(){
			window.onmousemove = "";
			window.onmouseup = "";
		}
	},
	init : function(){ //初始化
		var bars = document.querySelectorAll('.bar');
		for(var i = 0; i < bars.length; i++)
			bars[i].onmousedown = bar.down;
	}
}

//color计算
var compColor = {
	config : { //颜色配置，用于镜像更改DOM
		left : 0,
		allLong : 170,
	},
	color : '00FFFF',
	compPro : function(num,allLong) //根据拖动的距离，计算颜色
	{
		this.config.left = num;
		this.config.allLong = allLong;
		var progress = num * 1.0 / allLong;
		if(progress <= 0.5) //两种颜色过渡，从中间划分。即兰到黑，黑到红
		{	
			var newColor = Math.floor(65535 - 65535 * progress * 2).toString(16);
			this.color = '00' + newColor;
		}
		else
		{
			this.color = Math.floor(255 * progress).toString(16) + '0000';
		}
		this.setFontColor();
	},
	setFontColor : function() //更改字体颜色
	{
		document.getElementById('color').getElementsByTagName('p')[0].style.color = '#' + this.color;
	},
	setColor : function(num,allLong){ //对外接口，配置bar位置和颜色
		document.getElementById('color').getElementsByTagName('div')[1].style.left = num + 'px';
		this.compPro(num,allLong);
	}
}

//speed计算
var compSpeed = {
	config : { //速度配置
		left : 0,
		allLong : 130,
	},
	speed : 0.1,
	compSpe : function(num,allLong){ 
		this.config.left = num;
		this.config.allLong = allLong;
		var progress = num * 1.0 / allLong;
		this.speed = Math.floor(10 * progress * 10) / 10.0;
		this.setFontSpeed();
	},
	setFontSpeed : function(){
		document.getElementById('speed').getElementsByTagName('span')[0].innerHTML = this.speed;
	},
	setSpeed : function(num,allLong){
		document.getElementById('speed').getElementsByTagName('div')[1].style.left = num + 'px';
		this.compSpe(num,allLong);
	}

}

//curveAPI
var compCurve = {
	value : [ //初始化贝塞尔曲线参数
		33,33,66,66
	],
	setValue : function(){  //参数设置
		if(arguments.length === 2)
		{
			this.value[arguments[0]] = arguments[1];
			compCanvas.update(0,0,this.value);
		}
		else
		{
			var arr = arguments[1] ? arguments : arguments[0];
			for(var i = 0; i < 4; i++)
				this.value[i] = arr[i];
		}
				
	},
	setInput : function(){ //更改input内容，达到拖动曲线，改变input值
		var inputs = document.getElementById('curve').getElementsByTagName('input');
		if(arguments.length == 1)
			arguments = arguments[0];
		// for(var i = 0; i < 4; i++)
		// 	inputs[3 - i].value = arguments[i];
		inputs[2].value = arguments[3] >= 10 ? arguments[3] : '0' + arguments[3];
		inputs[1].value = arguments[2] >= 10 ? arguments[2] : '0' + arguments[2];
		inputs[0].value = arguments[1] >= 10 ? arguments[1] : '0' + arguments[1];
		inputs[3].value = arguments[0] >= 10 ? arguments[0] : '0' + arguments[0];
		this.setValue(arguments);
	},
	bindInputThat : function(that,i) 
	{
		var val = that.value;
		if(val === '')
			val = '0';
		if(val.length === 1)
			val += '0';
		if((val - 0) != 0 && !(val - 0))
			that.value = compCurve.value[i];
		else
			compCurve.setValue(i,val - 0);


	},
	bindInput : function(){ //绑定input的oninput事件，输入及改变参数和canvas曲线
		var inputs = document.getElementById('curve').getElementsByTagName('input');
		inputs[0].oninput = function(){
			compCurve.bindInputThat(this,1);
		}
		inputs[1].oninput = function(){
			compCurve.bindInputThat(this,2);
		}
		inputs[2].oninput = function(){
			compCurve.bindInputThat(this,3);
		}
		inputs[3].oninput = function(){
			compCurve.bindInputThat(this,0);
		}
		// for(var i = 0; i < 4; i++)
		// 	(function(i){
		// 		inputs[i].oninput = function(e){
		// 			e = e || window.event;
		// 			var num = this.value - 0;
		// 			if(this.value === '' || num)
		// 				compCurve.setValue(3-i,this.value - 0 || 0);
		// 			else
		// 				this.value = 	compCurve.value[3 - i];
		// 		}
		// 	})(i);
			
	}
}

//canvas
var compCanvas = {
	canvas : {}, //canvas DOM对象
	ctx : {}, //ctx对象
	width : 0, 
	height : 0,
	ifMouseout : true, //判断鼠标是否进入
	x : 0, //鼠标位置
	y : 0,
	a : 80,  //贝塞尔曲线参数
	b : 80,
	c : 160,
	d : 160,
	//两个onmousemove事件，用于没有按下鼠标和按下鼠标不同的事件
	mousemove1 : function(e){
		e = e || window.event;
		compCanvas.update(e.clientX - this.offsetLeft,e.clientY - this.offsetTop + document.body.scrollTop);
	},
	mousemove2 : function(down)
	{
		window.onmouseup = function(){
			compCanvas.canvas.onmousemove = compCanvas.mousemove1;
			window.onmouseup = "";
		}
		if(down)
		{
			return function(e)
			{
				e = e || window.event;
				var x = e.clientX - this.offsetLeft;
				var y = e.clientY - this.offsetTop + document.body.scrollTop ;
				if(x < 1)
					x = 1;
				if(y < 1)
					y = 1;
				compCanvas.update(x,y,x,y,compCanvas.c,compCanvas.d);
				compCurve.setInput(Math.floor(x * 1.0 / compCanvas.width * 100),
					Math.floor(y * 1.0 / compCanvas.height * 100),
					Math.floor(compCanvas.c * 1.0 / compCanvas.width * 100),
					Math.floor(compCanvas.d * 1.0 / compCanvas.height * 100)
					);
			}
		}else
		{
			return function(e)
			{
				e = e || window.event;
				var x = e.clientX - this.offsetLeft;
				var y = e.clientY - this.offsetTop + document.body.scrollTop;
				if(x < 1)
					x = 1;
				if(y < 1)
					y = 1;
				compCanvas.update(x,y,compCanvas.a,compCanvas.b,x,y);
				compCurve.setInput(Math.floor(compCanvas.a * 1.0 / compCanvas.width * 100),
					Math.floor(compCanvas.b * 1.0 / compCanvas.height * 100),
					Math.floor(x * 1.0 / compCanvas.width * 100),
					Math.floor(y * 1.0 / compCanvas.height * 100)
					);
			}
		}

	},
	onmouseenter : function(){
		compCanvas.ifMouseout = false;
	},
	onmouseout : function()
	{
		compCanvas.ifMouseout = true;
		compCanvas.draw();
	},
	onmousedown : function(e){
		e = e || window.event;
		e.preventDefault();
		var x = e.clientX - this.offsetLeft;
		var y = e.clientY - this.offsetTop + document.body.scrollTop;
		if(x > compCanvas.a - 7 && x < compCanvas.a + 7 && y > compCanvas.b - 7 && y < compCanvas.b + 7)
			compCanvas.canvas.onmousemove = compCanvas.mousemove2(true);
		else if(x > compCanvas.c - 7 && x < compCanvas.c + 7 && y > compCanvas.d - 7 && y < compCanvas.d + 7)
			compCanvas.canvas.onmousemove = compCanvas.mousemove2(false);
	},		
	init : function(){ //初始化，获取canvas和绑定事件
		this.canvas = document.getElementById('canvas');
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		// this.a = this.width;
		// this.c = this.height;
		if(this.canvas.getContext && this.canvas.getContext('2d'))
		{
			this.ctx = this.canvas.getContext('2d');
			this.ctx.font = "13px";
			this.ctx.fillStyle = "#999";
			this.ctx.strokeStyle = "#999";
			this.ctx.lineWidth = 3;
			this.canvas.onmousemove = this.mousemove1;
			this.canvas.onmouseenter = this.onmouseenter;
			this.canvas.onmouseout = this.onmouseout;
			this.canvas.onmousedown = this.onmousedown;
		}
		else
			alert("no");
	},
	draw : function(){ //重绘
		this.ctx.clearRect(0,0,this.width,this.height); //清空画板
		if(!this.ifMouseout) //判断鼠标是否进入
		{
			var x = Math.floor(this.x * 1.0 / this.width * 100);
			var y = Math.floor(this.y * 1.0 / this.height * 100);
			this.ctx.fillText("(0." + x + ",0."+ y +")",this.x > this.width/2 ? this.x - 70 : this.x,this.y < this.height/2 ? this.y + 30 : this.y);
		}
		this.ctx.beginPath();
		this.ctx.moveTo(0,this.height);
		this.ctx.bezierCurveTo(this.a,this.b,this.c,this.d,this.width,0); //绘制贝塞尔曲线
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.lineWidth = 2;
		this.ctx.strokeStyle = "#ddd";
		this.ctx.beginPath();
		this.ctx.moveTo(this.a,this.b);
		this.ctx.arc(this.a,this.b,8,0,Math.PI*2,true); //绘制两个可拖动的点
		this.ctx.moveTo(this.a,this.b);
		this.ctx.lineTo(0,this.height);   //绘制点到曲线终点的连线
		this.ctx.moveTo(this.c,this.d);
		this.ctx.arc(this.c,this.d,8,0,Math.PI*2,true);
		this.ctx.moveTo(this.c,this.d);
		this.ctx.lineTo(this.width,0);
		this.ctx.stroke();
		this.ctx.fill();
		this.ctx.strokeStyle = "#999";
		this.ctx.lineWidth = 3;
	},
	update : function(x,y,a,b,c,d){  //更新数据并调用重绘
		this.x = x;
		this.y = y;
		if(b)
		{
			this.a = a;
			this.b = b;
			this.c = c;
			this.d = d;
		}
		else if(a)
		{
			this.a = a[0] * this.width / 100;
			this.b = a[1] * this.width / 100;
			this.c = a[2] * this.width / 100;
			this.d = a[3] * this.width / 100;
		}
		this.draw();
	}
}

//镜像
var allPic = {
	ISO : {}, //所有保存的镜像对象将存于此
	index : 1,
	timeout : {},
	addCookie : function(){  //将保存的镜像对象存于cookie
		var cookie = 'transitionIso=' +
				encodeURIComponent(JSON.stringify(this.ISO)) +
				';expires=' + new Date((new Date()).getTime() + 7 * 24 * 60 * 60 * 1000);
		document.cookie = cookie;
	},
	clone : function(obj){  //用于对象深拷贝
		var str = JSON.stringify(obj);
		return JSON.parse(str);
	},
	count : function(obj){ //计算保存的镜像数量
		var i = 0;
		for(var j in obj)
			i++;
		return i;
	},
	ISOObj : function(obj,index) { //镜像对象
		for(var i in obj)
			this[i] = obj[i];
		this.name = "镜像_" + index;
		var date = new Date();
		this.time = date.getMonth() + 1 + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
	},
	addISO : function(){  //获取所有参数，并添加镜像
		if(this.count(this.ISO) >= 5)
		{
			var more = document.getElementById('tooMore');
			clearTimeout(this.timeout);
			more.style.opacity = '1';
			this.timeout = setTimeout(function(){
				more.style.opacity = '0';
			},1000);
			return false;
		}
		var obj = {};
		obj.attr = this.clone(selectAllAttr.attr);
		obj.color = compColor.color;
		obj.colorConfig = this.clone(compColor.config);
		obj.speed = compSpeed.speed;
		obj.speedConfig = this.clone(compSpeed.config);
		obj.curve = this.clone(compCurve.value);
		this.ISO[this.index] = new this.ISOObj(obj,this.index);
		this.index ++;
		this.addCookie();
		return this.index - 1;
	},
	remove : function(index){ //删除指定镜像
		delete this.ISO[index];
		this.addCookie();
	}

}


//镜像DOM操作类
var isoDom = {
	li : {}, //所有镜像在前端展示的DOM对象将保存于此
	ul : {},
	moban : function(obj,index){  //镜像展示的DOM模板
		var li = document.createElement('li');
		li.setAttribute('objIndex',index);
		var div1 = document.createElement('div');
		div1.className = "left index";
		var divs = document.createElement('div');
		divs.style.backgroundColor = '#' + obj.color;
		div1.appendChild(divs);
		li.appendChild(div1);
		var div2 = document.createElement('div');
		div2.className = "left content";
		div2.innerHTML = obj.name + " &nbsp;" + obj.time;
		li.appendChild(div2);
		var div3 = document.createElement('div');
		div3.className = "right del";
		div3.innerHTML = "Del";
		li.appendChild(div3);
		return li;
	},
	addLi : function(obj,index){  //添加镜像并展示
		var li = this.moban(obj,index);
		this.ul.appendChild(li);
		this.li[index] = li;
	},
	bindAdd : function(){  //绑定添加按钮
		document.getElementById('addIso').onclick = function(){
			var index = allPic.addISO();
			if(index)
				isoDom.addLi(allPic.ISO[index],index);
		}
	},
	removeLi : function(index){ //删除镜像
		this.ul.removeChild(this.li[index]);
		delete this.li[index];
		allPic.remove(index);
	},
	setOtherDom : function(index){ //将镜像值分别传递给所有模块
		var obj = allPic.ISO[index];
		compCanvas.update(0,0,obj.curve);
		compCurve.setInput(obj.curve);
		compSpeed.setSpeed(obj.speedConfig.left,obj.speedConfig.allLong);
		compColor.setColor(obj.colorConfig.left,obj.colorConfig.allLong);
		selectAllAttr.setAttr(obj.attr);
		viewRun.setItem(obj); //调用展示动画接口
	},
	bindUl : function(){ //绑定点击事件
		this.ul.onclick = function(e){
			e = e ||window.event;
			var item = e.target || e.srcElement;
			var del = false;
			if(item === this)
				return;
			if(item.className === "right del")
				del = true;
			while(item.localName != "li")
				item = item.parentNode;
			if(del)
				isoDom.removeLi(item.getAttribute("objIndex") - 0);
			else
				isoDom.setOtherDom(item.getAttribute("objIndex") - 0);
		}
	},
	getCookie : function(){ //加载cookie中保存的镜像
		var name = 'transitionIso=';
		var cookie = document.cookie;
		var start = cookie.indexOf(name);
		if(start === -1)
			return "";
		var end = cookie.indexOf(';',start);
		if(end === -1)
			end = cookie.length;
		var obj = JSON.parse(decodeURIComponent(cookie.substring(start + name.length,end))); 
		allPic.ISO = obj;
		for(var i in obj)
		{
			if(i >= allPic.index)
				allPic.index = i + 1;
			this.addLi(obj[i],i);
		}
	},
	init : function(){ //初始化
		this.ul = document.getElementById('iso');
		this.bindAdd();
		this.bindUl();
		this.getCookie();
	}

}

//动画展示
var viewRun = {
	item : {},
	left : true,
	top : true,
	w : true,
	h : true,
	xt : true,
	yt : true,
	zt : true,
	rotate : ["rotateX(0deg)","rotateY(0deg)","rotateZ(0deg)"],
	getObj : function(){ //获取各个模块的参数
		var obj = {};
		obj.attr = selectAllAttr.attr;
		obj.color = compColor.color;
		obj.speed = compSpeed.speed;
		obj.curve = compCurve.value;
		return obj;
	},
	setItem : function(obj){ //给动画元素绑定新的参数
		this.item.style.backgroundColor = '#' + obj.color;
		this.item.style.transitionDuration = obj.speed + "s";
		this.item.style.transitionTimingFunction = "cubic-bezier(0." + 
													  obj.curve[0] + ",0." +
													  obj.curve[3] + ",0." +
													  obj.curve[2] + ",0." +
													  obj.curve[1] + ")";
		if(obj.attr['xr'])
		{
			if(this.left)
			{
				this.left = false;
				this.item.style.left = "300px";
			}
			else
			{
				this.left = true;
				this.item.style.left = "30px";
			}
		}
		if(obj.attr['yr'])
		{
			if(this.top)
			{
				this.top = false;
				this.item.style.top = "300px";
			}
			else
			{
				this.top = true;
				this.item.style.top = "30px";
			}
		}
		if(obj.attr['w'])
		{
			if(this.w)
			{
				this.w = false;
				this.item.style.width = "70px";
			}
			else
			{
				this.w = true;
				this.item.style.width = "40px";
			}
		}
		if(obj.attr['h'])
		{
			if(this.h)
			{
				this.h = false;
				this.item.style.height = "70px";
			}else{
				this.h = true;
				this.item.style.height = "40px";
			}
		}
		if(obj.attr['xt'])
			if(this.xt)
			{
				this.xt = false;
				this.rotate[0] = "rotateX(360deg)";
			}else{
				this.xt = true;
				this.rotate[0] = "rotateX(0deg)";
			}
		if(obj.attr['yt'])
			if(this.yt)
			{
				this.yt = false;
				this.rotate[1] = "rotateY(360deg)";
			}else{
				this.yt = true;
				this.rotate[1] = "rotateY(0deg)";
			}
		if(obj.attr['zt'])
			if(this.zt)
			{
				this.zt = false;
				this.rotate[2] = "rotateZ(360deg)";
			}else{
				this.zt = true;
				this.rotate[2] = "rotateZ(0deg)";
			}
		// if(rotate != "")
			this.item.style.transform = this.rotate.join(" ");
		// this.item.style.transform = "rotate(360deg)";
		document.getElementById('code').innerHTML = createCode.getContent(obj);
	},
	init : function(){ //初始化
		this.item = document.getElementById('runItem');
		document.getElementById('go').onclick = function(){
			viewRun.setItem(viewRun.getObj());
		};
		document.getElementById('run').onclick = function(){
			viewRun.setItem(viewRun.getObj());
		}
	}
}
//创建代码
var createCode = {
	//HTML模板
	mobanHead : "<span class='green'>div </span>{<br/>",
	mobanEnd : "}",
	moban1 : "&nbsp;<span class='blue'>a0transition</span> : a1 <span class='ash'>a2</span><br/>",
	zhushi : ['','/* Firefox 4 */'
				,'/* Safari 和 Chrome */'
				,'/* Opera */'],
	tou : ['','-moz-','-webkit-','-o-'],
	//加载不同span，获取不同颜色
	getPurple : function(str)
	{
		return "<span class='purple'>" + str + "</span>";
	},
	gets : function(num){
		return this.getPurple(num) + "<span class='red'>s</span>";
	},
	getYellow : function(str){
		return "<span class='yellow'>" + str + "</span>";
	},
	getBezier : function(obj){
		return this.getPurple('cubic-bezier') + '(' +
				this.getYellow('0.'+obj[0]) + ',' +
				this.getYellow('0.'+obj[3]) + ',' +
				this.getYellow('0.'+obj[2]) + ',' +
				this.getYellow('0.'+obj[1]) + ')';

	},
	getContent : function(obj){ //生成代码
		var item = '';
		var j = 0;
		var has = false;
		for(var i in obj.attr)
			if(obj.attr[i])
				j++;
		if(j === 7)
			item = 'all ';
		else
		{
			if(obj.attr['xt'] || obj.attr['yt'] || obj.attr['zt'])
			{
				has = true;
				item += this.getPurple('transform') + ', ';
			}
			if(obj.attr['xr']) item += this.getPurple('left') + ', ';
			if(obj.attr['yr']) item += this.getPurple('top') + ', ';
			if(obj.attr['h']) item += this.getPurple('height') + ', ';
			if(obj.attr['w']) item += this.getPurple('width') + ', ';
			item = item.substring(0,item.length - 2) + ' ';
		}
		var time = this.gets(obj.speed) + ' ';
		var bezier = this.getBezier(obj.curve) + ';';
		var all = item + time + bezier;
		var str = '';
		for(var i in this.tou)
		{
			str += this.moban1.replace(/a0/,this.tou[i])
						.replace(/a1/,(has ? this.getPurple(this.tou[i]) : '') + all)
						.replace(/a2/,this.zhushi[i]);
		}
		return this.mobanHead + str + this.mobanEnd;

	}
}






//调用所有项
window.onload = function(){
	selectAllAttr.bindClick();
	bar.init();
	compCurve.bindInput();
	compCanvas.init();
	compCanvas.draw();
	isoDom.init();
	viewRun.init();
}




