package base.edulife;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Rest controller to provide or receipt informations about categories that affects 
 * the Munich university of applied science and Cal Poly university.
 */
@RestController
@RequestMapping("/category")
public class CategoryController {

  @Autowired
  private CategoryRepository categoryRepository;

  /**
   * Returns a list of all categories stored.
   * @return list of all stored categories
   */
  @GetMapping
  public ArrayList<Category> listAll() {
    ArrayList<Category> cats = new ArrayList<>();
    categoryRepository.findAll().forEach(category -> cats.add(category));
    return cats;
  }

  /**
   * Creates a new category. If the category is not completely
   * available the BAD_REQUEST status code will be returned.
   * @param input Data (name) of the new category
   * @return status code that indicates if it was possible to created the category
   */
  @PostMapping
  public ResponseEntity<Category> create(@RequestBody Category input) {
    if (input == null || input.getName() == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
    return ResponseEntity.status(HttpStatus.OK).body(categoryRepository.save(
        new Category(input.getName())));
  }

}
