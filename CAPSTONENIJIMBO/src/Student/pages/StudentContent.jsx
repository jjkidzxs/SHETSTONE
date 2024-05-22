import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './page.css';

const StudentContent = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:8080/announcements/getall');
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
    return () => {
      setAnnouncements([]);
    };
  }, []);


  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  };

  const openModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAnnouncement(null);
    setIsModalOpen(false);
  };

  const modalContent = selectedAnnouncement && (
    <div className='announcement-modal'>
      <div className='admin-announcement-modal'>
      <span className='admin-announcement-closeButton' onClick={closeModal}>&times;</span>
        <div className='admin-announcement-image'>
          {selectedAnnouncement.image && (
            <img src={`data:image/png;base64,${selectedAnnouncement.image}`} alt="Announcement" />
          )}
        </div>
        <div className='admin-announcement-modal-content'>
        <div className='admin-announcement-content'>
          <h1>{selectedAnnouncement.title}</h1>
          <p>Date Created: {new Date(selectedAnnouncement.date).toLocaleDateString()}</p>
          <p dangerouslySetInnerHTML={{ __html: selectedAnnouncement.description }}></p>
        </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-announcements" >
      {announcements.map((announcement) => (
        <article key={announcement.announcementID} className="announcement" onClick={() => openModal(announcement)}>
          <div className='announcement-image'>
            {announcement.image && (
              <img src={`data:image/png;base64,${announcement.image}`} alt="Announcement" />
            )}
          </div>
          <div className='A-article-content'>
            <h1>{announcement.title}</h1>
            <p>Announcement Created: {new Date(announcement.date).toLocaleDateString()}</p>
            <p dangerouslySetInnerHTML={{ __html: truncateDescription(announcement.description, 200) }}></p>
          </div>
        </article>
      ))}
    {isModalOpen && modalContent}
    </div>
  );
};

export default StudentContent;
