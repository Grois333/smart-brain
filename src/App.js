import React, { Component } from "react";
import Particles from 'react-particles-js';
import "./App.css";
import Clarifai from 'clarifai';
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import Navigation from "./Components/Navigation/Navigation";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Rank from "./Components/Rank/Rank";


const app = new Clarifai.App({
  apiKey: 'fd2a805864b54d84baae0f7a3e6cd060'
 });

const particlesOptions = {

  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 250
      }
    }
  }
}




class App extends Component {

  constructor(){
    super();

    this.state = {

      input: '',
      imageUrl: ''

    }
  }

  onInputChange = (event) => {
    
    //console.log(event.target.value);

    this.setState({input:event.target.value});

  }

  onButtonSubmit = () => {

    //console.log('click');

    this.setState({imageUrl: this.state.input});

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
    function(response) {

      // do something with response
      console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
    },
    function(err) {
      // there was an error
    }
  );
  }

  render() {
  return (
    <div className="App">

      <Particles 
              className="particles"
              params={particlesOptions}
              
            />
      <Navigation />

       <Logo />

       <Rank />

      <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />

      <FaceRecognition imageUrl={this.state.imageUrl} /> 

    </div>
  );
}

}

export default App;
