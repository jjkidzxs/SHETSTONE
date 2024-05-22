import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './TeacherEvents.css';

const TeacherEvents = () => {
    const { teacherID } = useParams();
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEventID, setSelectedEventID] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/getbyteacheridsection/${teacherID}`);
                const responseData = response.data;

                if (responseData.length > 0) {
                    const sectionIds = responseData.map(section => section.id);

                    const eventsPromises = sectionIds.map(async (sectionId) => {
                        const eventsResponse = await axios.get(`http://localhost:8080/sectionevents/${sectionId}`);
                        return eventsResponse.data;
                    });
                    const allEvents = (await Promise.all(eventsPromises)).flat();

                    const uniqueEvents = Array.from(new Set(allEvents.map(event => event.event.eventID)))
                        .map(eventID => allEvents.find(event => event.event.eventID === eventID));

                    setEvents(uniqueEvents);
                } else {
                    alert('Teacher not found or no sections assigned');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Error fetching data');
            }
        };

        fetchData();
    }, [teacherID]);

    const openModal = (eventID) => {
        setSelectedEventID(eventID);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEventID(null);
    };

    return (
        <div className="cards-wrapper">
            <h1>EVENT LIST</h1>
            <div className="cards-container">
                {events.slice().reverse().map(event => (
                    <div key={event.eventID} className="card">
                        <h1>{event.event.eventTitle}</h1>
                        <p><strong>Start Date:</strong> {event.event.eventStart}</p>
                        <p><strong>End Date:</strong> {event.event.eventEnd}</p>
                        <p dangerouslySetInnerHTML={{ __html: event.event.description.length > 100 ? `${event.event.description.substring(0, 100)}...` : event.event.description }}></p>
                        <button onClick={() => openModal(event.event.eventID)}>
                            View Records
                        </button>
                    </div>
                ))}
            </div>
            {isModalOpen && <TeacherAttendance eventID={selectedEventID} teacherID={teacherID} closeModal={closeModal} />}
        </div>
    );
};

const TeacherAttendance = ({ eventID, teacherID, closeModal }) => {
    const [sections, setSections] = useState([]);
    const [teacherSections, setTeacherSections] = useState([]);
    const [selectedSectionID, setSelectedSectionID] = useState(null);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchSections();
        getByTeacherID();
    }, [eventID, teacherID]);

    const fetchSections = () => {
        axios.get(`http://localhost:8080/sectionevent/${eventID}`)
            .then(response => {
                setSections(response.data.map(section => section.section));
            })
            .catch(error => {
                console.error('Error fetching sections:', error);
            });
    };

    const getByTeacherID = () => {
        axios.get(`http://localhost:8080/getbyteacheridsection/${teacherID}`)
            .then(response => {
                setTeacherSections(response.data.map(section => section.section));
            })
            .catch(error => {
                console.error('Error fetching teacher sections:', error);
            });
    };

    const handleSectionClick = (sectionID) => {
        setSelectedSectionID(sectionID);
        fetchStudents(sectionID);
    };

    const fetchStudents = (sectionID) => {
        axios.get(`http://localhost:8080/students/section/${sectionID}`)
            .then(response => {
                const studentsData = response.data;
                const promises = studentsData.map(student => {
                    return axios.get(`http://localhost:8080/getstatus/${student.userid}/${eventID}`)
                        .then(statusResponse => {
                            student.isRegistered = statusResponse.data.length > 0;
                            if (student.isRegistered) {
                                student.timeIN = student.isRegistered && statusResponse.data[0].timeIN ? formatDate(statusResponse.data[0].timeIN) : '-';
                                student.timeOUT = student.isRegistered && statusResponse.data[0].timeOUT ? formatDate(statusResponse.data[0].timeOUT) : '-';
                            }
                            return student;
                        })
                        .catch(error => {
                            console.error('Error fetching student status:', error);
                            return student;
                        });
                });

                Promise.all(promises)
                    .then(updatedStudents => {
                        setStudents(updatedStudents);
                    });
            })
            .catch(error => {
                console.error('Error fetching students:', error);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
    };


    const thTdStyle = {
        border: '1px solid #dddddd',
        textAlign: 'left',
        padding: '8px',
    };

    return (
        <div className="teacher-section-event-modal">
        <div className="teacher-section-event-modal-content">
            <span className="teacher-section-event-close" onClick={closeModal}>&times;</span>
            <h1>Sections:</h1>
            <div className="teacher-list">
            {sections.map(section => {
                if (teacherSections.find(teacherSection => teacherSection.id === section.id)) {
                    
                    
                    
                    return (
                        <div key={section.id}>
                            <div onClick={() => handleSectionClick(section.id)} className="teacher-list-section-container">
                                <p>{section.sectionName}</p>
                            </div>

                            {selectedSectionID === section.id && (
                                <div class="teacher-student-attendance-overlay">
                                <div class="teacher-student-attendance">
                                    <span class="teacher-section-event-close" onClick={closeModal}>&times;</span>
                                    <h1>Section: {section.sectionName}</h1>
                                    <div class="table-wrapper">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Student ID</th>
                                                    <th>Name</th>
                                                    <th>Course</th>
                                                    <th>Email</th>
                                                    <th>Registered</th>
                                                    <th>Time In</th>
                                                    <th>Time Out</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {students.map(student => (
                                                <tr key={student.userid}>
                                                    <td style={thTdStyle}>{student.studentID}</td>
                                                    <td style={thTdStyle}>{student.firstName} {student.lastName}</td>
                                                    <td style={thTdStyle}>{student.course}</td>
                                                    <td style={thTdStyle}>{student.email}</td>
                                                    <td style={thTdStyle}>{student.isRegistered ? 'Yes' : 'No'}</td>
                                                    <td style={thTdStyle}>{student.isRegistered ? student.timeIN : '-'}</td>
                                                    <td style={thTdStyle}>{student.isRegistered ? student.timeOUT : '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                </div>
                                </div>
                            )}
                        </div>
                    );
                } else {
                    return null;
                }
            })}
            </div>
        </div>
    </div>
    );
};

export default TeacherEvents;


