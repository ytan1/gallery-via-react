require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//use json loader in webpack
let imageData = require('../data/imageData.json');

//convert image name to image URL in src folder 
//self-excuted function
imageData = (function getImageURL(imageArr){
	 
	for (var i = 0; i < imageArr.length; i++){
		var singleImageData = imageArr[i];
		singleImageData = require('../images/' + singleImageData.fileName);
		imageArr[i] = singleImageData;
	}
	return imageArr[i];
})(imageData);



class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
      
      	<section className="img-sec">
      	</section>
      	<nav className="nav-bar">
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
