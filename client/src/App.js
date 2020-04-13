import React, { Component } from "react";
import Particles from 'react-particles-js';
import "./App.css";
import Clarifai from 'clarifai';
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import Register from "./Components/Register/Register";
import Signin from "./Components/Signin/Signin";
import Navigation from "./Components/Navigation/Navigation";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Rank from "./Components/Rank/Rank";


//Clarifai API KEY
const app = new Clarifai.App({
  apiKey: 'fd2a805864b54d84baae0f7a3e6cd060'
});

//Background Particles
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
      box: '',

      //To Route the between signin forms and dashboard
      route: 'signin',
      isSignedIn: false,

      user: {

        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''

      }

    }
  }


  //Function to load the user when register form is inputed(pass function to Register Component)
  loadUser = (data) => {

    this.setState({user: {

      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined

    }})
  }



  // //Fetch our server
  // componentDidMount(){

  //   fetch('http://localhost:3001/')
  //     .then(response => response.json())
  //     .then(console.log)
  // }






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

    //console.log(box);

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

      .then(response => {

        if (response) {

          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            //Keep current user
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
        }

        this.displayFaceBox(this.claculateFaceLocation(response))
      })
      .catch(err => console.log(err));

  }

  
  //Function to Change Routes from Signin and Home Dashboard
  onRouteChange = (route) => {

    if (route === 'signout') {

      this.setState({isSignedIn: false});

    } else if (route === 'home') {

      this.setState({isSignedIn: true});
    }

    this.setState({route: route});
  }

  render() {

    //Destructuring our states instead of using this.state
    const { isSignedIn, imageUrl, route, box} = this.state;

    return (
      <div className="App">

        <Particles
          className="particles"
          params={particlesOptions}

        />

        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>


        { /* Jsx Javascript expression to know when to change the route */

         route === 'home' ? //if this is true then route to home dashboard 

             <div>

                <Logo />

                <Rank name={this.state.user.name} entries={this.state.user.entries} />

                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />

                <FaceRecognition box={box} imageUrl={imageUrl} />

             </div>

           : (   //else if route is Signin go to Signin

             route === 'signin' ?

             <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />

           :

             //else return the route to Register

             <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
           )
              

        }

      </div>
    );
  }

}

export default App;
