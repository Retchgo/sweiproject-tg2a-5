package base.edulife;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

/**
 * Rest controller to provide or receipt informations about activities 
 * beween Munich university of applied science and Carl Poly university.
 */
@RestController
@RequestMapping("/activity")
public class ActivityController {
  
  @Autowired
  private ActivityRepository activityRepository;
  
  
  /**
   * Returns a list of all activities stored.
   * @return list of all stored activities
   */
  @GetMapping
  public ArrayList<Activity> listAll() {
      ArrayList<Activity> activities = new ArrayList<>();
      activityRepository.findAll().forEach(activity -> activities.add(activity));
      return activities;
  }

  /**
   * Returns the activity with the given id.
   * @param id of the activity
   * @return activity with the given id
   */
  @GetMapping("{id}")
  public Activity find(@PathVariable Long id) {
      return activityRepository.findOne(id);
  }

  /**
   * Creats a new activity.
   * @param input Data of the new activity
   * @return the new created activity
   */
  @PostMapping
  public Activity create(@RequestBody Activity input) {
      return activityRepository.save(new Activity(input.getText(), input.getTags(), input.getTitle()));
  }

  /**
   * Deletes the activity with the given id.
   * @param id of the activity
   */
  @DeleteMapping("{id}")
  public void delete(@PathVariable Long id) {
      activityRepository.delete(id);
  }

  /**
   * Updates the activity with the given id.
   * @param id of the activity
   * @param input new data of the activity, including the unchanged data
   * @return the updated activity
   */
  @PutMapping("{id}")
  public Activity update(@PathVariable Long id, @RequestBody Activity input) {
      Activity activity = activityRepository.findOne(id);
      if (activity == null) {
          return null;
      } else {
          activity.setText(input.getText());
          activity.setTags(input.getTags());
          activity.setTitle(input.getTitle());
          return activityRepository.save(activity);
      }
  }

}
