import React from "react";
import firebase from "./Firestore";

class User extends React.Component {
  constructor() {
    super();
    this.db = firebase.firestore();
    this.usersRef = this.db.collection("users");
    this.state = {
      password: "",
      email: "",
      username: "",
      userEmail: "",
      displayName: "",
      errorMsg: "",
      status: "Signed Out"
    };
    this.logIn = this.logIn.bind(this);
    this.checkAuthStateChange = this.checkAuthStateChange.bind(this);
  }

  checkAuthStateChange = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        let name = this.state.username;
        // let emailVerified = user.emailVerified;
        // let isAnonymous = user.isAnonymous;
        // let uid = user.uid;
        // let providerData = user.providerData;
        // ...
        console.log(user);
        user.updateProfile({
          displayName: name
        }).then(() => {
          // Update successful.
          this.setState({
            displayName: user.displayName,
            userEmail: user.email
        });
        }).catch(function(error) {
          // An error happened.
          console.log(error);
        });
      } else {
        // User is signed out.
        this.setState({
          status: "Signed Out",
          displayName: "",
          userEmail: ""
        });
      }
    });
  }

  componentDidMount() {
    this.checkAuthStateChange();
  }

  updateInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  addUser = async e => {
    e.preventDefault();
    let error = "";
    await firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .catch(updateError => {
        error = updateError.message;
      });
    this.setState({
      errorMsg: error
    });
  };

  logIn = async e => {
    e.preventDefault();
    let error = "";
    await firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(thisError => {
        error = thisError.message;
      });
    this.setState({
      errorMsg: error
    });
  };

  logOut() {
    firebase.auth().signOut();
  }

  render() {
    return (
      <>
        <p>{this.state.status}</p>
        {this.state.errorMsg !== "" ? <p>{this.state.errorMsg}</p> : null}
        {this.state.displayName !== "" ? (
          <div
            style={{
              display: "flex",
              width: "600px",
              justifyContent: "space-between"
            }}
          >
            <p>User Name: {this.state.displayName}</p>
            <p>Email: {this.state.userEmail}</p>
          </div>
        ) : null}
        <form>
          <input
            type="username"
            name="username"
            placeholder="username"
            onChange={this.updateInput}
            value={this.state.username}
          />
          <input
            type="email"
            name="email"
            placeholder="email"
            onChange={this.updateInput}
            value={this.state.email}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={this.updateInput}
            value={this.state.password}
          />
          <button type="submit" onClick={this.addUser}>
            Sign Up
          </button>
          <button type="submit" onClick={this.logIn}>
            Log In
          </button>
          <button type="submit" onClick={this.logOut}>
            Log Out
          </button>
        </form>
      </>
    );
  }
}

export default User;
