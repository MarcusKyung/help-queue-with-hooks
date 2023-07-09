import React, { useEffect, useState } from "react";
import NewTicketForm from "./NewTicketForm";
import TicketList from "./TicketList";
import EditTicketForm from "./EditTicketForm";
import TicketDetail from "./TicketDetail";
import db from "./../firebase.js"; //Gives access to db
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore"; //Import Firestore helper functions

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

  useEffect(() => {
    const unSubscribe = onSnapshot(
      collection(db, "tickets"),
      (collectionSnapshot) => {
        const tickets = [];
        collectionSnapshot.forEach((doc) => {
          tickets.push({
            names: doc.data().names, //.data is a method that returns all documents data in JS object
            location: doc.data().location,
            issue: doc.data().issue,
            id: doc.id, //sets ticket object's id to the auto generated one from FS
          });
        });
        setMainTicketList(tickets);
      },
      (error) => {
        setError(error.message);
      }
    );

    return () => unSubscribe();
  }, []);

  const handleClick = () => {
    if (selectedTicket != null) {
      setFormVisibleOnPage(false);
      setSelectedTicket(null);
      setEditing(false);
    } else {
      setFormVisibleOnPage(!formVisibleOnPage); //takes current value and degates it, aka toggles it
    }
  };

  const handleDeletingTicket = (id) => {
    const newMainTicketList = mainTicketList.filter(
      (ticket) => ticket.id !== id
    );
    setMainTicketList(newMainTicketList);
    setSelectedTicket(null);
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleEditingTicketInList = (ticketToEdit) => {
    const editedMainTicketList = mainTicketList
      .filter((ticket) => ticket.id !== selectedTicket.id)
      .concat(ticketToEdit);
    setMainTicketList(editedMainTicketList);
    setEditing(false);
    setSelectedTicket(null);
  };

  const handleAddingNewTicketToList = async (newTicketData) => {
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
      <button onClick={handleClick}>{buttonText}</button>
      {error ? null : <button onCLick={handleClick}> {buttonText}</button>}
    </React.Fragment>
  );
}

export default TicketControl;
