require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//use json loader in webpack
let imageDatas = require('../data/imageData.json');

//convert image name to image URL in src folder 
//self-excuted function
imageDatas = (function getImageURL(imageArr){
	 
	var newArr = [];
	for (var i = 0; i < imageArr.length; i++){
		var singleImageData = imageArr[i];
		singleImageData.imageURL = require('../images/' + imageArr[i].fileName);
		newArr[i] = singleImageData;
	}
	return newArr;

})(imageDatas);

class ImageFigure extends React.Component{
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e){
		if(this.props.arrange.isCenter){
			this.props.inverse();
			//for IE compatability of flip animation
			setTimeout(function(){this.back.classList.toggle('hidden')}.bind(this), 300);
			//setTimeout(function(){this.props.toggleHidden();}.bind(this), 300);

		}else {
			this.props.center();
		}
		

		e.stopPropagation();
		e.preventDefault();
	}
	

	render() {
		//add position for each figure in style
		var styleObj = {};
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

		//check if is inversed
		var className = "img-figure";
		className += this.props.arrange.isInverse ? ' is-inverse' : '';

		//for img-back style
		var backClassName = "img-back hidden";
		//backClassName += this.props.arrange.backHidden ? ' hidden' : '';

		if(this.props.arrange.rotate){
			//for compatibility
			(['MozT', 'msT', 'Webkitt', 't']).forEach(function(v){
				styleObj[v + 'ransform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this))
		}
		
		


		return (

				<figure onClick={this.handleClick} ref={this.props.refPass} style={styleObj} className={className}>

					<img src={this.props.data.imageURL}
						  alt={this.props.data.title} 
					/>
					<figcaption>
						<h2 className="img-title">
							{this.props.data.title}
						</h2>
						
					</figcaption>
					<div className={backClassName} ref={(el) => this.back = el}>
						<p>
							{this.props.data.title}
						</p>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figure>

		);
	}
}

class ControllerUnit extends React.Component {

	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);


	}


	handleClick(e){

		if(this.props.arrange.isCenter) {
			this.props.inverse();
			//for IE compatability of flip animation
			setTimeout(function(){this.props.domRef.getElementsByClassName('img-back')[0].classList.toggle('hidden')}.bind(this), 300);
			//this.props.toggleHidden();

		} else{
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();

	}

	render() {

 		var className = 'unit';
		if(this.props.arrange.isCenter) {
			className += ' button-center';
		}
		if(this.props.arrange.isInverse) {
			className += ' button-inverse';
		}

		
		return <div className={className} onClick={this.handleClick}></div>
				
	}

}

function generateRandom(min, max){
	return Math.floor(Math.random()*(max - min)) + min;
}

class AppComponent extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			imgsArrangeArr: [
				/*{
					pos: {
						left: '0',
						top: '0'
					},
					rotate: 0,
					isInverse: false
				}*/
			]
		};

		this.Constant = {
			centerPos: {             //position for centered pic
				left: 0,
				top: 0
			},
			hPosRange: {            //horizontal range for position
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			vPosRange: { 			//vertical range for position
				x: [0, 0],
				topY: [0, 0]

			}
		};

		this.rearrange = this.rearrange.bind(this);
		this.inverse = this.inverse.bind(this);
		this.center = this.center.bind(this);
		this.toggleHidden = this.toggleHidden.bind(this);

	}

	toggleHidden(index){

		return function() {
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].backHidden = !imgsArrangeArr[index].backHidden;
			setTimeout(function(){
				this.setState({
					imgsArrangeArr: imgsArrangeArr
				});
			}.bind(this), 300);

		}.bind(this);
	}

	//relocation all the pics
	//@para centerIndex the pic being centered
	rearrange(centerIndex) {
		var imgsArrangeArr = this.state.imgsArrangeArr,
		Constant = this.Constant,

		centerPos = Constant.centerPos,
		hPosRange = Constant.hPosRange,
		vPosRange = Constant.vPosRange,
		hPosRangeLeftSecX = hPosRange.leftSecX,
		hPosRangeRightSecX = hPosRange.rightSecX,
		hPosRangeY = hPosRange.y,
		vPosRangeTopY = vPosRange.topY,
		vPosRangeX = vPosRange.x,


		//there can be 0 or 1 pic on top area of the gallery
		imgsArrangeTopInfo = [],
		topImgNum = Math.floor(Math.random()*2),
		imgsArrangeTopIndex = 0,

		//get the centered pic info
		imgsArrangeCenterInfo = imgsArrangeArr.splice(centerIndex, 1);
		imgsArrangeCenterInfo[0].pos = centerPos;
		imgsArrangeCenterInfo[0].isCenter = true;


		//random choose a pic on top area
		imgsArrangeTopIndex = Math.floor(Math.random()*(imgsArrangeArr.length));
		imgsArrangeTopInfo = imgsArrangeArr.splice(imgsArrangeTopIndex, topImgNum);
		//locate it
		imgsArrangeTopInfo.forEach(function(value, index){
			imgsArrangeTopInfo[index] = {
				pos: {
					top: generateRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: generateRandom(vPosRangeX[0], vPosRangeX[1])
				},
				isCenter: false,
				isInverse: false,
				backHidden: true
			}
		});

		//left area, right area arrange locations 
		var l = imgsArrangeArr.length,
			k = l/2;
		for (var i=0; i < l; i++){

			// i<k belongs to left, otherwise right
			var hPosRangeLorR = null;
			if(i < k) {
				hPosRangeLorR = hPosRangeLeftSecX;
			}else {
				hPosRangeLorR = hPosRangeRightSecX;
			}

			imgsArrangeArr[i]={
				pos: {
						left: generateRandom(hPosRangeLorR[0], hPosRangeLorR[1]),
						top: generateRandom(hPosRangeY[0], hPosRangeY[1])
					},
				isInverse: false,
				isCenter: false,
				backHidden: true
			}
		}

		//put position info of top and center pic back into array
		if(imgsArrangeTopInfo[0]){
			imgsArrangeArr.splice(imgsArrangeTopIndex, 0, imgsArrangeTopInfo[0]);
			console.log(imgsArrangeTopInfo[0], imgsArrangeTopIndex);

		}
		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterInfo[0]);

		//generate random rotation except for the centered pic
		console.log(imgsArrangeArr);
		for(var i=0; i<imgsArrangeArr.length; i++){
			if(i !== centerIndex){
				imgsArrangeArr[i].rotate = generateRandom(-30, 30);
			} else{
				imgsArrangeArr[i].rotate = 0;
			}
		}

		this.setState({
			imgsArrangeArr: imgsArrangeArr
			}
		)

	}
	

	//function passed into imageFigure for inverse
	inverse(index){
		return function(){
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			})
		}.bind(this);
	}

	//center the clicked figure
	center(index) {
		return function() {
			this.rearrange(index);
		}.bind(this);
	}

	//determine the position for each pic after mounted
	componentDidMount() {
		var stageDOM = this.stage,
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW/2),
			halfStageH = Math.ceil(stageH/2);

		//get the size of a imageFigure
		var imgFigureDOM = this.img1,
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgH = Math.ceil(imgH/2),
			halfImgW = Math.ceil(imgW/2);
			

		//caculate the position of centered pic
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH,
			zIndex: 11
		};
		//caculate the position range of pics in left/right
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - 3*halfImgW;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;
		//caculate the position range of pics in top area

		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - 3*halfImgH;
		this.Constant.vPosRange.x[0] = halfStageW - 3*halfImgW;
		this.Constant.vPosRange.x[1] = halfStageW + halfImgW;

		this.rearrange(0);
	}



  	render() {

  		let controllerUnits = [],
  			imgFigures = [];

  		imageDatas.forEach(function(single, index){

  			if(!this.state.imgsArrangeArr[index]){
  				this.state.imgsArrangeArr[index] = {
  					pos: {
  						top: 0,
  						left: 0
  					},
  					rotate: 0,
  					isInverse: false,
  					isCenter: false,
  					backHidden: true
  				};
  			}

  			imgFigures.push(<ImageFigure data={single} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} toggleHidden={this.toggleHidden(index)} key={index} refPass={(el) => {this['img' + index] = el;}} />);

  			controllerUnits.push(<ControllerUnit key={index} center={this.center(index)} inverse={this.inverse(index)} arrange={this.state.imgsArrangeArr[index]} toggleHidden={this.toggleHidden(index)} domRef={this['img' + index]} />);
  		}.bind(this));        //need to bind this for function inside forEach!!



  	  return (
  	    <section className="stage" ref={el => this.stage = el}>

  	    	<section className="img-sec">
  	    		{imgFigures}
  	    	</section>

  	    	<nav className="nav-bar">
  	    		{controllerUnits}
  	    	</nav>
  	    </section>
  	  );
  	}
}

AppComponent.defaultProps = {
};

export default AppComponent;
