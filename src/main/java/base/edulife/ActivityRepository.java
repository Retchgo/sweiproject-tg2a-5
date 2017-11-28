package base.edulife;

import org.springframework.data.repository.CrudRepository;

import base.edulife.Activity;

/**
 * Repository to store activities.
 */
public interface ActivityRepository extends CrudRepository<Activity, Long> {
}
