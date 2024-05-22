import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './StudentEvents.css'; 

function TeacherEvents() {
  const { studentID } = useParams();
  const [student, setStudent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all'); 


  const fetchEvents = async (sectionId) => {
    try {
      const response = await axios.get(`http://localhost:8080/sectionevents/${sectionId}`);
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message); 
      setLoading(false);
    }
  };

  const truncateDescription = (description, maxLength) => {
    if (!description) {
      return '';
    }
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  };
  

  useEffect(() => {
    
    const fetchTeacherUserId = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/sectionstudents/${studentID}`);
        console.log(response)
        const teacherUserId = response.data[0].section.id; 
        fetchEvents(teacherUserId);
        console.log(teacherUserId)
      } catch (error) {
        setError(error.response.data.message); 
        setLoading(false);
      }
    };

    fetchTeacherUserId();
  }, [studentID]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getByStudentID/${studentID}`);
        setStudent(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response.data.message); 
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentID]);


  const openModal = (event) => {
    if (isOngoing(event) || isUpcoming(event)) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    } else {
      alert("Only ongoing or upcoming events can be clicked.");
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const registerForEvent = async () => {
    try {
      const registrationData = {
        event: {
          eventID: selectedEvent.event.eventID,
          eventTitle: selectedEvent.event.eventTitle,
          eventStart: selectedEvent.event.eventStart,
          eventEnd: selectedEvent.event.eventEnd,
          image: selectedEvent.event.image,
          description: selectedEvent.event.description
        },
        student: {
          userid: student.userid,
          studentID: student.studentID,
          firstName: student.firstName,
          lastName: student.lastName,
          course: student.course,
          email: student.email,
          password: student.password,
          profile: student.profile
        },
        timeIN: null,
        timeOUT: null,
        registered: true
      };

      console.log(registrationData);
      const response = await axios.post('http://localhost:8080/createStudentEvent', registrationData);


      alert("You're already registered for this event.");
    } catch (error) {
      alert("You're already registered for this event.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const isOngoing = (event) => {
    const currentDate = new Date();
    const eventStart = new Date(event.event.eventStart);
    const eventEnd = new Date(event.event.eventEnd);
    return currentDate >= eventStart && currentDate <= eventEnd;
  };

  const isUpcoming = (event) => {
    const currentDate = new Date();
    const eventStart = new Date(event.event.eventStart);
    return currentDate < eventStart;
  };

  const isCompleted = (event) => {
    const currentDate = new Date();
    const eventEnd = new Date(event.event.eventEnd);
    return currentDate > eventEnd;
  };

  let filteredEvents = events;
  if (filter === 'ongoing') {
    filteredEvents = events.filter(isOngoing);
  } else if (filter === 'upcoming') {
    filteredEvents = events.filter(isUpcoming);
  } else if (filter === 'completed') {
    filteredEvents = events.filter(isCompleted);
  }

  return (
    <div className="teacher-events-container"> 
      <h1>EVENTS</h1>

      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>All Events</button>
        <button onClick={() => setFilter('ongoing')}>Ongoing Events</button>
        <button onClick={() => setFilter('upcoming')}>Upcoming Events</button>
        <button onClick={() => setFilter('completed')}>Completed Events</button>
      </div>

    
      <div className="events-list">
        {filteredEvents.map((event) => (
          <div key={event.id} className="event-card" onClick={() => openModal(event)}>
            {event.event.image && <p><img src={`data:image/png;base64,${event.event.image}`} alt={event.eventTitle} /></p>}
            <p><strong>{event.event.eventTitle}</strong></p>
            <p>{event.event.eventStart}</p>
            <p dangerouslySetInnerHTML={{ __html: truncateDescription(event.event.description, 100) }}></p>
          </div>
        ))}
      </div>

      {isModalOpen && (
  <div className="announcement-modal">
    <div className="studentevent-modal">
      <span className="studentevent-closeButton" onClick={closeModal}>&times;</span>
      <div className='studentevent-image'>
      {selectedEvent.event.image && <p><img src={`data:image/png;base64,${selectedEvent.event.image}`} alt={selectedEvent.event.eventTitle} /></p>}
      </div>
      <h1>{selectedEvent.event.eventTitle}</h1>
      <p>{selectedEvent.event.eventStart}</p>
      <p>{selectedEvent.event.eventEnd}</p>
      <p dangerouslySetInnerHTML={{ __html: selectedEvent.event.description }}></p>
      <div className='studentevent-filter-buttons'>
      <button  onClick={registerForEvent}>Register</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default TeacherEvents;