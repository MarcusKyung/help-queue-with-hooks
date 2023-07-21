import React, { useEffect, useState } from "react";
import NewTicketForm from "./NewTicketForm";
import TicketList from "./TicketList";
import EditTicketForm from "./EditTicketForm";
import TicketDetail from "./TicketDetail";
import { db, auth } from "./../firebase.js";
import { collection, addDoc, doc, updateDoc, onSnapshot, deleteDoc, query, where, orderBy } from "firebase/firestore"; //Import Firestore helper functions
import { formatDistanceToNow } from 'date-fns';
import { Button } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


function TicketControl() {
  const [formVisibleOnPage, setFormVisibleOnPage] = useState(false);
  const [mainTicketList, setMainTicketList] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);

  //Point of listener is to get realtime snapshot reference when there are changes in Firestore

  // useEffect has two arguments, first is function to run, second is array of values that useEffect should watch. If array is empty, useEffect will only run once when component is first rendered. If array has values, useEffect will run when any of those values change. If array is not included, useEffect will run every time component is rendered.
  // Cleanup function is the return statement in the first argument of useEffect. This function will run when component unmounts. This is where we will unsubscribe from Firestore listener.
  // Side effect we are running is the onSNapshot listener() that listens to db changes
  // onSnapshot takes three arguments: (1) document or collection reference we want to target, (2) callback function that runs when listener first runs, (3) callback function that runs when there is an error with listener
  // onSnapshot returns an unsubscribe function that we can call to unsubscribe from listener. We will call this function in cleanup function of useEffect

  // collectionSnapshot is a QuerySnapshot, it is made up of DocumentSnapshot objects. These are firestore object types and have their own properties and methods. For example, collectionSnapshot.forEach(...) is not normal JS, it is a QuerySnapshot method.

  //NOTE: When you create tickets as one account then delete the account the tickets remain in the db. Another thing to note is that if you create a new account with the same name the old tickets will be associated with the new account.

  //Scenarios:
    //Scenario 1: No user logged in ---> Should display no tickets and a message to log in (SUCCESS)
    //Scenario 2: User logged in but no tickets ---> Should display no tickets and a message to create a ticket (SUCCESS)
    //Scenario 3: User logged in and has tickets ---> Should display tickets associated with that user (SUCCESS)


  useEffect(() => {
    let queryRef;
  
    if (auth.currentUser !== null) { //Scenario 2 and 3
      console.log(auth.currentUser.email);
      queryRef = query(collection(db, "tickets"), where("author", "==", auth.currentUser.email)); //Removed orderbydescending because it was causing the tickets to be ordered by timeOpen and not by time created. This was causing the tickets to be ordered by time created when you refreshed the page. I would have fixed this by adding a timeCreated field to the ticket object but I didn't want to mess with the code too much.
    } else {  //Scenario 1, need this in order to render the "log in message for some reason"
      queryRef = collection(db, "tickets");
    }
  
    const unSubscribe = onSnapshot(
      queryRef,
      (collectionSnapshot) => {
        const tickets = [];
        collectionSnapshot.forEach((doc) => {
          const timeOpen = doc.get('timeOpen', {serverTimestamps: "estimate"}).toDate(); //gets value of timeOpen field for current doc. This is FS timestamp object. Call toDate on it turns into JS formatted date 
          const jsDate = new Date(timeOpen); //Use JS date to put into new Date constructor.
          tickets.push({
            names: doc.data().names,
            location: doc.data().location,
            issue: doc.data().issue,
            id: doc.id,
            timeOpen: jsDate,
            formattedWaitTime: formatDistanceToNow(jsDate),
            author: doc.data().author,
          });
        });
        setMainTicketList(tickets);
      },
      (error) => {
        setError(error.message);
      }
    );
    setMainTicketList([]); // added this because when you would reload the page it would flash all the tickets before updating. With this line it will render an empty ticket list before updating.

    return () => unSubscribe;
  }, [auth.currentUser]);
  

  useEffect(() => { 
    function updateTicketElapsedWaitTime() { // This function does two things: maps through mainTicketList state variable to update formattedWaitTime property and returns new array of updated tickets
      const newMainTicketList = mainTicketList.map(ticket => {
        const newFormattedWaitTime = formatDistanceToNow(ticket.timeOpen);
        return {...ticket, formattedWaitTime: newFormattedWaitTime};
      });
      setMainTicketList(newMainTicketList); //updates mainTicketList with the newMainTicketList, thereby updating the state variable and triggering a re-render due to dependency array
    }

    const waitTimeUpdateTimer = setInterval(() => //Set interval takes two args: function to run on every interval and the interval length. 
      updateTicketElapsedWaitTime(),  //In this case setInterval is running UpdateTicketElapsedWaitTime() every minute (60000 milliseconds)
      60000
    );

    return function cleanup() {
      clearInterval(waitTimeUpdateTimer);
    }
  }, [mainTicketList]) //This hook depends on mainTicketList so that's why we have it in the dependencies array. Effect is called when state updates


  const handleClick = () => {
    if (selectedTicket != null) {
      setFormVisibleOnPage(false);
      setSelectedTicket(null);
      setEditing(false);
    } else {
      setFormVisibleOnPage(!formVisibleOnPage); //takes current value and degates it, aka toggles it
    }
  };

  const handleDeletingTicket = async (id) => {
    //very similar to how we update tickets. Main difference is that deleteDoc() does not take second argument for data.
    await deleteDoc(doc(db, "tickets", id));
    setSelectedTicket(null);
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleEditingTicketInList = async (ticketToEdit) => {
    const ticketRef = doc(db, "tickets", ticketToEdit.id); //Create document reference with doc(). Arguments are db instance, collection name, and doc identifier. This function returns a DocumentReference Object.
    await updateDoc(ticketRef, ticketToEdit); //updateDoc() takes two arguments, first is DocumentReference object, second is the new data that the ticket should be updated with.
    setEditing(false);
    setSelectedTicket(null);
  };

  const handleAddingNewTicketToList = async (newTicketData) => {
    newTicketData.author = auth.currentUser.email;
    await addDoc(collection(db, "tickets"), newTicketData); //Collection allows us to specify collection in db. First arg is db instance, second is name of collection
    // addDoc function allows us to add new doc to specified collection. First arg is collection we want to add doc to, second is data we want to add. Second argument must be JS object. Object key and value will be FS doc field and value

    //Can also write as:
    // const collectionRef = collection(db, "tickets");
    // await addDoc(collectionRef, newTicketData);

    setFormVisibleOnPage(false); //sets formVisibleOnPage to false
  };

  const handleChangingSelectedTicket = (id) => {
    const selection = mainTicketList.filter((ticket) => ticket.id === id)[0];
    setSelectedTicket(selection);
  };


  if (auth.currentUser == null) {
    return (
      <React.Fragment>
        <Row>
          <Col />
          <Col>
            <h1 style={{ color: "red" , marginTop: "1em"}}>You must be signed in to access the queue!</h1>
          </Col>
          <Col />
        </Row>
      </React.Fragment>
    );
  } else if (auth.currentUser != null) {
    let currentlyVisibleState = null;
    let buttonText = null;

    if (error) {
      currentlyVisibleState = <p>There was an error: {error}</p>; //FS error is returned as FS object with message property description
    } else if (editing) {
      currentlyVisibleState = (
        <EditTicketForm
          ticket={selectedTicket}
          onEditTicket={handleEditingTicketInList}
        />
      );
      buttonText = "Return to Ticket List";
    } else if (selectedTicket != null) {
      currentlyVisibleState = (
        <TicketDetail
          ticket={selectedTicket}
          onClickingDelete={handleDeletingTicket}
          onClickingEdit={handleEditClick}
        />
      );
      buttonText = "Return to Ticket List";
    } else if (formVisibleOnPage) {
      currentlyVisibleState = (
        <NewTicketForm onNewTicketCreation={handleAddingNewTicketToList} />
      );
      buttonText = "Return to Ticket List";
    } else {
      currentlyVisibleState = (
        <TicketList
          onTicketSelection={handleChangingSelectedTicket}
          ticketList={mainTicketList}
        />
      );
      buttonText = "Add Ticket";
    }

    return (
      <React.Fragment>
        {currentlyVisibleState}
        <ButtonGroup>
          {error ? null : <Button variant="primary" onClick={handleClick}>{buttonText}</Button>}
        </ButtonGroup>
      </React.Fragment>
    );
  }
}

export default TicketControl;
