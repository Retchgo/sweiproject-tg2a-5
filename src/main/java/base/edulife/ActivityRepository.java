package base.edulife;

import org.springframework.data.repository.CrudRepository;

import base.edulife.Activity;

public interface ActivityRepository extends CrudRepository<Activity, Long> {
}
