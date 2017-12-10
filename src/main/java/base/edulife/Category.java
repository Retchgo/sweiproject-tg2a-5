package base.edulife;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Every Activity can be marked with one Categorie.
 * @author Kristin
 *
 */

@Entity
@Table(name = "category")
public class Category {

  @Id
  private String name;

  public Category(){}

  public Category(String name) {
    this.name = name;
  }
  
  /**
   * Getter for the name.
   * @return the name of the category.
   */
  public String getName() {
    return name;
  }

  /**
   * Setter for the name.
   * @param name for the category.
   */
  
  public void setName(String name) {
    this.name = name;
  }

}
