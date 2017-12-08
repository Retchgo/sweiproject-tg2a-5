package base.edulife;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

/**
 * Repository to store activities.
 */
public interface ActivityRepository extends CrudRepository<Activity, Long> {
	
	//public List<Activity> findByCategoryId(String categoryId);
	//public List<Activity> findByCreationDate(String date);
	//public List<Activity> findByTags(String tag);
}
