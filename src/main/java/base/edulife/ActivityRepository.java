package base.edulife;

import base.edulife.Activity;
import org.springframework.data.repository.CrudRepository;


/**
 * Repository to store activities.
 */
public interface ActivityRepository extends CrudRepository<Activity, Long> {
}
