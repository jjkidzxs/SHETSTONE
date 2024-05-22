package nstpcapstone1.sims.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import nstpcapstone1.sims.Entity.EventTeacherEntity;
import nstpcapstone1.sims.Entity.SectionEntity;
import nstpcapstone1.sims.Entity.TeacherSectionEntity;
import nstpcapstone1.sims.Repository.EventTeacherRepository;
import nstpcapstone1.sims.Repository.TeacherSectionRepository;

@Service
public class TeacherSectionService {
	private final TeacherSectionRepository teacherSectionRepository;

    @Autowired
    public TeacherSectionService(TeacherSectionRepository teacherSectionRepository) {
        this.teacherSectionRepository = teacherSectionRepository;
    }

    public void assignTeacherToSection(TeacherSectionEntity teacherSectionEntity) {
        teacherSectionRepository.save(teacherSectionEntity);
    }
    public List<TeacherSectionEntity> getAllTeacherSections() {
        return teacherSectionRepository.findAll();
    }
    public List<SectionEntity> getAllSectionsByTeacherId(String teacherID) {
        return teacherSectionRepository.findAllSectionsByTeacherTeacherID(teacherID);
    }
    @Transactional
	 public boolean deleteBySectionId(Long id) {
	        int deleted = teacherSectionRepository.deleteBySectionId(id);
	        return deleted > 0;
	    }
}