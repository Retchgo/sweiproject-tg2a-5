package base.edulife;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;


/**
 * Activity about the partnership between 
 * Munich university of applied science and Cal Poly university.
 */
@Entity
public class Activity {

   
  private Long id;
  private String title;
  private Category category;
  private String text;
  private Set<String> tags = new HashSet<>();
  private Date creationDate = new Date();

  public Activity(){}

  /**
   * Creates a new Activitiy.
   * @param text of the activity
   * @param category of the activity
   * @param tags of the activity
   * @param title of the activity
   */
  public Activity(String text, Category category,  String tags, String title) {
    this.title = title;
    this.category = category;
    this.text = text;
    setTags(tags);
  }

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  @ManyToOne
  @JoinColumn(name = "category_name")
  public Category getCategory() {
    return category;
  }

  public void setCategory(Category category) {
    this.category = category;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }
  
  /**
   * Returns the tags of the activity as a string.
   * @return tags of the activity
   */
  public String getTags() {
    StringBuilder tagStringBuilder = new StringBuilder();
    for (String tag : tags) {
      tagStringBuilder.append("#" + tag + " ");
    }
    return tagStringBuilder.toString().trim();
  }

  /**
   * Sets the tags of the activity.
   * Existing tags are replaced.
   * @param tags to set in the activity
   */
  public void setTags(String tags) {
    this.tags.clear();
    this.tags = new HashSet<>(Arrays.asList(tags.replace(' ', '#').replace("#+","#").split("#")));
    this.tags.remove("");
  }
    
  public String getCreationDate() {
    return new SimpleDateFormat("yyyy-MM-dd HH:mm").format(this.creationDate);
  }
      
  public void setCreationDate(String creationDate) {
    // Does nothing because creationDate is not changeable but the setter is necessary 
    // to build the application
  }
}