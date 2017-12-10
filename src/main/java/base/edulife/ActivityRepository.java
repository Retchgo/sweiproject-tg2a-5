package base.edulife;


import org.springframework.data.repository.CrudRepository;

/**
 * Repository to store activities.
 */
public interface ActivityRepository extends CrudRepository<Activity, Long> {
}
