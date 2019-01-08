import React from "react";
import firebase from "./Firestore";

class User extends React.Component {
  constructor() {
    super();
    this.db = firebase.firestore();
    this.usersRef = this.db.collection("users");
    this.state = {
      userName: "",
      email: "",
      displayName: "",
      displayEmail: "",
      LoginError: "",
      SigninError: "",
      status: "Signed Out"
    };
  }

  // checkAuthStateChange = () => {
  //   firebase.auth().onAuthStateChanged(user => {
  //     if (user) {
  //       // User exists.
  //       let name = this.state.userName;
  //       console.log(name)
  //       if (user.displayName === "") {
  //         user.updateProfile({ displayName: name }).then(() => {
  //           // Update successful.
  //           this.setState({
  //             status: "Signed In",
  //             displayName: user.displayName,
  //             userEmail: user.email
  //           });
  //         });
  //       }
  //     } else {
  //       // User is signed out.
  //       this.setState({
  //         status: "Signed Out",
  //         displayName: "",
  //         userEmail: ""
  //       });
  //     }
  //   });
  // };

  // componentDidMount() {
  //   this.checkAuthStateChange();
  // }

  updateInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    let data = new FormData(e.target);
    let email = this.state.email;
    // TODO: do something with name
    let password = this.state.password;
    switch (data.get("submitTypes")) {
      case "signup":
        this.addUser(email, password);
        break;
      case "login":
        this.logIn(email, password);
        break;
      default:
        break;
    }
  };

  addUser = async (email, password) => {
    let error = "";
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(updateError => {
        console.log(updateError.message);
      })
      .then(() => {
        this.setState({
          SigninError: error
        });
      });
    if (error === "") {
      this.logIn(email, password);
    }
  };

  logIn = async (email, password) => {
    let error = "";
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(loginError => {
        error = loginError.message;
      })
      .then(() =>
        this.setState({
          LoginError: error
        })
      );
    if (error === "") {
      this.setState({
        status: "Signed In",
        SignInError: "",
        LoginError: "",
        displayName: this.state.userName,
        displayEmail: this.state.email
      });
    }
  };

  logOut() {
    firebase.auth().signOut();
  }

  handleCheckboxChoice() {}

  render() {
    return (
      <div style={{ paddingLeft: "50px" }}>
        <p>{this.state.status}</p>
        {this.state.SigninError !== "" ? <p>{this.state.SigninError}</p> : null}
        {this.state.LoginError !== "" ? <p>{this.state.LoginError}</p> : null}
        {this.state.displayName !== "" ? (
          <div
            style={{
              display: "flex",
              paddingLeft: "50px",
              width: "600px",
              justifyContent: "space-between"
            }}
          >
            <p>User Name: {this.state.displayName}</p>
            <p>Email: {this.state.displayEmail}</p>
          </div>
        ) : null}
        <form onSubmit={this.handleSubmit}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "600px",
              justifyContent: "space-between"
            }}
          >
            <input
              className="form-control"
              type="text"
              name="userName"
              placeholder="what would you like to be called?"
              onChange={this.updateInput}
              value={this.state.userName}
            />
            <br />
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="email"
              onChange={this.updateInput}
              value={this.state.email}
            />
            <br />
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="password"
              onChange={this.updateInput}
              value={this.state.password}
            />
            <br />
          </div>
          <div className="btn-group btn-group-toggle" dataToggle="buttons" style={{paddingTop: "10px"}}>
            <label className="btn btn-secondary active">
              <input type="radio" name="submitTypes" id="signup" autoComplete="off" defaultChecked/> Sign Up
            </label>
            <label className="btn btn-secondary">
              <input type="radio" name="submitTypes" id="login" autoComplete="off"/> Log In
            </label>
          </div>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "row",
              width: "300px",
              justifyContent: "space-between"
            }}
          >
            <button className="btn btn-primary" type="submit">
              Submit!
            </button>
            {this.state.status === "Signed In" ? (
              <button className="btn btn-warning" onSubmit={this.logOut}>
                Log Out
              </button>
            ) : null}
          </div>
        </form>
      </div>
    );
  }
}

export default User;
