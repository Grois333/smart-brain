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

  constructor() {
    super();

    this.state = {

      input: '',
      imageUrl: '',
      box: ''

    }
  }

  claculateFaceLocation = (data) => {

    const clarifaiFace =  data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.getElementById('inputimage');

    const width = Number(image.width);

    const height = Number(image.height);

    //console.log(width, height);
   
    //We return the object Bounding Box with our calculations based on the face
    return {

      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)

    }

  }

  displayFaceBox = (box) => {

    console.log(box);

    this.setState({box: box});
  }




  onInputChange = (event) => {

    //console.log(event.target.value);

    this.setState({ input: event.target.value });

  }

  onButtonSubmit = () => {

    //console.log('click');

    this.setState({ imageUrl: this.state.input });

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)

      // do something with response
      //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);

      .then(response => this.displayFaceBox(this.claculateFaceLocation(response)))
      .catch(err => console.log(err));

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

        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />

      </div>
    );
  }

}

export default App;
