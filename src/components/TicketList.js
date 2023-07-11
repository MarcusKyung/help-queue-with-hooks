import React from "react";
import Ticket from "./Ticket";
import PropTypes from "prop-types";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function TicketList(props) {
  return (
    <React.Fragment>
      <hr />
      <Carousel showArrows={true} infiniteLoop={false}>
        {props.ticketList.map((ticket) => (
          <Ticket
            whenTicketClicked={props.onTicketSelection}
            names={ticket.names}
            location={ticket.location}
            issue={ticket.issue}
            id={ticket.id}
            key={ticket.id}
            author={ticket.author}
            formattedWaitTime={ticket.formattedWaitTime}
          />
        ))}
      </Carousel>
    </React.Fragment>
  );
}

TicketList.propTypes = {
  ticketList: PropTypes.array,
  onTicketSelection: PropTypes.func,
};

export default TicketList;




// import React from "react";
// import Ticket from "./Ticket";
// import PropTypes from "prop-types";

// function TicketList(props){

//   return (
//     <React.Fragment>
//       <hr/>
//       {props.ticketList.map((ticket) =>
//         <Ticket 
//           whenTicketClicked={props.onTicketSelection}
//           names={ticket.names}
//           location={ticket.location}
//           issue={ticket.issue}
//           id={ticket.id}
//           key={ticket.id}
//           author={ticket.author}
//           formattedWaitTime={ticket.formattedWaitTime}/>
//       )}
//     </React.Fragment>
//   );
// }

// TicketList.propTypes = {
//   ticketList: PropTypes.array,
//   onTicketSelection: PropTypes.func
// };

// export default TicketList;

