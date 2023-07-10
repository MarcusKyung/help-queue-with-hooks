import React, { useState } from "react";
import { auth } from "./../firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

function SignIn() {
  const [signUpSuccess, setSignUpSuccess] = useState(null);
  const [signInSuccess, setSignInSuccess] = useState(null);
  const [signOutSuccess, setSignOutSuccess] = useState(null);

  function doSignUp(event) {
    event.preventDefault(); //Prevents default reloading of page on submit
    const email = event.target.email.value; //gets value of email/pw from form submit
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setSignUpSuccess("Passwords do not match!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password) //takes three args: auth instance, email, and password. Returns promise
      .then((userCredential) => { //for successful promise
        setSignUpSuccess(
          `You've successfully signed up, ${userCredential.user.email}!`
        ); //userCredential represents firebase object. This object has property called user. User is a user object that extends functionality from UserInfo class. This is why we can access info about new user like their email
      })
      .catch((error) => { //for unsuccessful promise
        setSignUpSuccess(`There was an error signing up: ${error.message}!`);
      });
  }

  function doSignIn(event) {
    event.preventDefault();
    const email = event.target.signinEmail.value;
    const password = event.target.signinPassword.value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setSignInSuccess(
          `You've successfully signed in as ${userCredential.user.email}!`
        );
      })
      .catch((error) => {
        setSignInSuccess(`There was an error signing in: ${error.message}!`);
      });
  }

  function doSignOut() {
    signOut(auth)
      .then(function () {
        setSignOutSuccess("You have successfully signed out!");
      })
      .catch(function (error) {
        setSignOutSuccess(`There was an error signing out: ${error.message}!`);
      });
  }

  return (
    <React.Fragment>
      <React.Fragment>
        <h1>Sign up</h1>
        {signUpSuccess}
        <form onSubmit={doSignUp}>
          <input type="text" name="email" placeholder="email" />
          <input type="password" name="password" placeholder="Password" />
          <input type="password" name="confirmPassword" placeholder="Password Again" />
          <button type="submit">Sign up</button>
        </form>

        <h1>Sign In</h1>
        {signInSuccess}
        <form onSubmit={doSignIn}>
          <input type="text" name="signinEmail" placeholder="email" />
          <input type="password" name="signinPassword" placeholder="Password" />
          <button type="submit">Sign in</button>
        </form>

        <h1>Sign Out</h1>
        {signOutSuccess}
        <br />
        <button onClick={doSignOut}>Sign out</button>
      </React.Fragment>
    </React.Fragment>
  );
}

export default SignIn;
