import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import './StudentProfile.css';

const QRCodeModal = ({ studentID, closeModal, firstName }) => {
  return (
    <div className="student-profile-qr-modal">
      <div className="student-profile-qr-modal-content">
        <h1>QR Code for {studentID}, {firstName}</h1>
        <div className="qr-code-container">
          <QRCode className='QRCode' value={studentID} />
          <button className='closeQR' onClick={closeModal}>Close QR Code</button>
        </div>
      </div>
    </div>
  );
};

const StudentProfile = () => {
  const { studentID } = useParams();
  const [qrVisible, setQrVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [assignedSections, setAssignedSections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [student, setStudent] = useState({
    studentID: '',
    firstName: '',
    lastName: '',
    email: '',
    course: '',
    section: '',
  });

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    try {
      console.log('Saving changes:', student); // Debugging line
      const response = await axios.put(`http://localhost:8080/updateStudent/${studentID}`, student);
      setIsEditing(false);
      console.log('Response:', response); // Debugging line
      // Optionally, you can show a success message or reload the data
    } catch (error) {
      console.error('Error updating student profile:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStudent((prevStudent) => ({ ...prevStudent, [name]: value }));
  };

  const onClickFunction = () => {
    assignSection();
    assignSectionName();
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getByStudentID/${studentID}`);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [studentID]);

  const handleFileChange = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  const updateProfilePicture = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      console.error('Please select a profile picture.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profile', selectedFile);
      const response = await axios.put(`http://localhost:8080/addpicture/${studentID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfilePicture(selectedFile);
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setQrVisible(false);
    window.location.reload();
  };

  const closeModal2 = () => {
    setShowModal(false);
    setQrVisible(false);
  };

  const assignSection = async () => {
    try {
      const response = await axios.post('http://localhost:8080/assignStudentToSection', {
        student: { userid: student.userid },
        section: { id: selectedSection }
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error assigning section:', error);
    }
  };

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getAllSections');
        setSections(response.data);
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };

    fetchSections();
  }, []);

  useEffect(() => {
    const fetchAssignedSections = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/studentsection/${student.userid}`);
        setAssignedSections(response.data);
      } catch (error) {
        console.error('Error fetching assigned sections:', error);
      }
    };

    fetchAssignedSections();
  }, [student.userid]);

  const assignSectionName = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/students/${studentID}/section`, null, {
        params: {
          section: selectedSection
        }
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error assigning section name:', error);
    }
  };

  return (
    <div className="student-profile-container">
      <div className='student-profile'>
        <h1>Student Profile</h1>
        <div className="student-profile-details">
          <div className='student-profile-picture'>
            <div className='student-profile-content'>
              {(profilePicture && <p><img src={URL.createObjectURL(profilePicture)} alt={student.firstName} style={{ width: '100%' }} /></p>) ||
                (student.profile && <p><img src={`data:image/png;base64,${student.profile}`} alt={student.firstName} style={{ width: '100%' }} /></p>)
              }
              <input className='student-profile-picture-btn' id="profile-picture" type="file" accept="image/*" onChange={updateProfilePicture} style={{ display: 'none' }} />
              <label htmlFor="profile-picture" className="choosefile">Update Profile Picture</label>
            </div>
          </div>
          <div className="student-profile-credentials">
            {isEditing ? (
              <div>
                <p><strong>Student ID:</strong><br /><input type="text" name="studentID" value={student.studentID} onChange={handleInputChange} /></p>
                <p><strong>Name:</strong><br /><input type="text" name="firstName" value={student.firstName} onChange={handleInputChange} /> <input type="text" name="lastName" value={student.lastName} onChange={handleInputChange} /></p>
                <p><strong>Email:</strong><br /><input type="email" name="email" value={student.email} onChange={handleInputChange} /></p>
                <p><strong>Course:</strong><br /><input type="text" name="course" value={student.course} onChange={handleInputChange} /></p>
              </div>
            ) : (
              <div>
                <p><strong>Student ID:</strong><br /><span className="student-entered-value">{student.studentID}</span></p>
                <p><strong>Name:</strong><br /><span className="student-entered-value">{student.firstName} {student.lastName}</span></p>
                <p><strong>Email:</strong><br /><span className="student-entered-value">{student.email}</span></p>
                <p><strong>Course:</strong><br /><span className="student-entered-value">{student.course}</span></p>
              </div>
            )}

            <div className="student-section-dropdown">
              <p><strong>Section:</strong></p>
              {assignedSections.length > 0 ? (
                <p><span className="entered-value">{assignedSections[0].section.sectionName}</span></p>
              ) : (
                <select className='student-select-sec' onChange={(e) => setSelectedSection(e.target.value)}>
                  <option value="">Assign Section</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.sectionName}
                    </option>
                  ))}
                </select>
              )}
              {assignedSections.length === 0 && (
                <button className='student-assign-sec' onClick={onClickFunction}>Assign Section</button>
              )}
            </div>

            {showModal && (
              <div className="created-announcement-modal">
                <div className="create-announcement-modal-content">
                  <p className='create-announcement-message'>Section Assigned!</p>
                  <button className='created-announcement-close' onClick={closeModal}>&times;</button>
                </div>
              </div>
            )}

            <div className='student-profile-btn'>
              {isEditing ? (
                <button className='save-profile-button' onClick={handleSaveChanges}>Save Changes</button>
              ) : (
                <button className='edit-profile-button' onClick={handleEditProfile}>Edit Profile</button>
              )}
              <button className='QRbutton' onClick={() => setQrVisible(true)}>Show QR Code</button>
              <button className='logout-button' onClick={() => window.location.href = '/Student/Login'}>Logout</button>
            </div>
          </div>
        </div>

        {qrVisible && <QRCodeModal studentID={student.studentID} firstName={student.firstName} closeModal={closeModal2} />}
      </div>
    </div>
  );
};

export default StudentProfile;
