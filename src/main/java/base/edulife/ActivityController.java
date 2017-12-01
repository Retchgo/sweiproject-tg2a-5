package base.edulife;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

/**
 * Rest controller to provide or receipt informations about activities 
 * beween Munich university of applied science and Cal Poly university.
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
   * Creates a new activity. If the activity is not completely
   * available the BAD_REQUEST status code will be returned.
   * @param input Data of the new activity
   * @return status code that indicates if it was possible to created the activity
   */
  @PostMapping
  public ResponseEntity<Activity> create(@RequestBody Activity input) {
	  if (input == null || input.getText() == null || input.getTitle() == null || input.getTags() == null) {
		  return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
	  }
      return ResponseEntity.status(HttpStatus.OK).body(activityRepository.save(new Activity(input.getText(), input.getTags(), input.getTitle())));
  }

  /**
   * Deletes the activity with the given id.
   * @param id of the activity
   * @return status code that indicates if it was possible to delete the post.
   */
  @DeleteMapping("{id}")
  public ResponseEntity<Activity> delete(@PathVariable Long id) {
	  if (!activityRepository.exists(id)) {
		  return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
	  }
	  activityRepository.delete(id);
	  return ResponseEntity.status(HttpStatus.OK).body(null); 
  }

  /**
   * Updates the activity with the given id if available. If the activity is
   * not completely available the BAD_REQUEST status code will be returned.
   * @param id of the activity
   * @param input new data of the activity, including the unchanged data
   * @return the status code and the updated activity
   */
  @PutMapping("{id}")
  public ResponseEntity<Activity> update(@PathVariable Long id, @RequestBody Activity input) {
      if (!activityRepository.exists(id) || input == null || input.getText() == null || input.getTitle() == null || input.getTags() == null) {
    	  return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
      }
      Activity activity = activityRepository.findOne(id);
      activity.setText(input.getText());
      activity.setTags(input.getTags());
      activity.setTitle(input.getTitle());
      activityRepository.save(activity);
      return ResponseEntity.status(HttpStatus.OK).body(activity);
  }
}