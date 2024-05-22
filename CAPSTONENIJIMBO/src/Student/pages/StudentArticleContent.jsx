import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './page.css';

const StudentContent = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/articles/getall');
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();


    return () => {
      setArticles([]);
    };
  }, []);


  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  };

  const openModal = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedArticle(null);
    setIsModalOpen(false);
  };

  const modalContent = selectedArticle && (
    <div className='article-modal'>
      <div className='article-modal-content'>
      <span className='article-edit-closeButton' onClick={closeModal}>&times;</span>

        <div className='A-article-content'>
          <h1>{selectedArticle.title}</h1>
          <p>Date Created: {new Date(selectedArticle.date).toLocaleDateString()}</p>
          <p  classname="A-article-description" dangerouslySetInnerHTML={{ __html: selectedArticle.description }}></p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-articles" >
      {articles.map((article) => (
        <article key={article.articleID} className="A-article" onClick={() => openModal(article)}>

          <div className='A-article-content'>
            <h1>{article.title}</h1>
            <p>Article Created: {new Date(article.date).toLocaleDateString()}</p>
            <p classname="A-article-description" dangerouslySetInnerHTML={{ __html: truncateDescription(article.description, 500) }}></p>
          </div>
        </article>
      ))}
    {isModalOpen && modalContent}
    </div>
  );
};

export default StudentContent;
