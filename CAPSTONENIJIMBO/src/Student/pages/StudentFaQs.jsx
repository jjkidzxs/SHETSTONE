import React, { useState, useEffect } from 'react'
import './StudentFaQs.css';
import axios from 'axios';

function StudentFaQs() {
  const [teachers, setTeachers] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:8080/getallteachers')
      .then(response => {
        setTeachers(response.data.reverse());
      })
      .catch(error => {
        console.error('Error fetching teachers:', error);
      });
  }, []);






  return (
    <div class="FAQS-container">
    <div class="faqstitle">
        <h1><strong>Cebu Institute of Technology - University National Service Training Program FAQs</strong></h1>
    </div>
    <div class="FAQS-answers-wrapper">
        <div class="FAQS-answers-column">
        <div className="FAQS-answers-container">
    <h3>1. What is the National Service Training Program (NSTP)?</h3>
    <p>The National Service Training Program (NSTP) is a program aimed at enhancing civic consciousness and defense preparedness among the Filipino youth. It is a requirement for all college students in the Philippines, including those enrolled at Cebu Institute of Technology - University (CIT-U).</p>
    </div>
    <div className="FAQS-answers-container">
    <h3>2. What are the components of NSTP at CIT-U?</h3>
    <p>At CIT-U, the NSTP consists of two components: the Reserve Officers' Training Corps (ROTC) and the Civic Welfare Training Service (CWTS). Students can choose between these two components based on their interests and career goals.</p>
    </div>
    <div className="FAQS-answers-container">
    <h3>3. Who is required to undergo NSTP at CIT-U?</h3>
    <p>All Filipino college students, including freshmen and transferees, who are 18 years old and above are required to undergo NSTP at CIT-U. This requirement is mandated by the Philippine government.</p>
    </div>
    <div className="FAQS-answers-container">
    <h3>4. What are the benefits of participating in NSTP?</h3>
    <p>Participating in NSTP provides students with valuable skills and experiences, including leadership training, disaster preparedness, community service, and teamwork. Additionally, completion of NSTP is a prerequisite for graduation.</p>
    </div>
    <div className="FAQS-answers-container">
    <h3>5. How long is the NSTP program at CIT-U?</h3>
    <p>The NSTP program at CIT-U typically spans two semesters, with students devoting a certain number of hours per week to their chosen component (ROTC or CWTS). The specific duration may vary depending on the curriculum and requirements set by the university.</p>
    </div>
        </div>

        
        <div class="FAQS-answers-column">
        <div className="FAQS-answers-container">
    <h3>6. Is NSTP a credited course at CIT-U?</h3>
    <p>Yes, NSTP is a credited course at CIT-U. Students who successfully complete the program will earn academic credits, which contribute to their overall academic progress and graduation requirements.</p>
    </div>
    <div className="FAQS-answers-container">
    <h3>7. Can students choose their preferred NSTP component?</h3>
    <p>Yes, students at CIT-U have the freedom to choose between the ROTC and CWTS components based on their interests, skills, and career aspirations. However, certain factors such as physical fitness requirements may influence their decision.</p>
    </div>
    <div className="FAQS-answers-container">
    <h3>8. Are there any exemptions from NSTP at CIT-U?</h3>
    <p>Exemptions from NSTP may be granted to students who meet specific criteria, such as those with physical disabilities or medical conditions that prevent them from participating fully in the program. Exemption guidelines are set by the Philippine government and implemented by CIT-U accordingly.</p>
    </div>
    <div className="FAQS-answers-container">
    <h3>9. How can students apply for NSTP at CIT-U?</h3>
    <p>Students can apply for NSTP during the enrollment period at CIT-U. The university provides information and guidance regarding the application process, including the selection of preferred components and scheduling of NSTP classes.</p>
    </div>
    <div className="FAQS-answers-container">
    <h3>10. Who can students contact for further inquiries about NSTP at CIT-U?</h3>
    <p>For further inquiries about NSTP at CIT-U, students can contact the university's NSTP office or department responsible for overseeing the program. Additionally, academic advisers and faculty members are available to provide guidance and assistance regarding NSTP requirements and participation.</p>
    </div>
        </div>
    </div>

  
    <div class="faqsteachertitle">
        <h1><strong>NSTP DEPARTMENT TEACHERS</strong></h1>
    </div>
           

    <div className="teacher-card-container-faqs">
  {teachers.map(teacher => (
    <div className="teacher-card-faqs" key={teacher.userid}> 
      <div className="teacher-image-faqs">
        <img src={`data:image/png;base64,${teacher.profile}`} alt={teacher.firstName} />
      </div>
      <p>{teacher.firstName} {teacher.lastName}</p>
      <p>{teacher.email} </p>
    </div>
  ))}
</div>


</div>
  )
}

export default StudentFaQs