package base.edulife;

import org.springframework.data.repository.CrudRepository;

/**
 * Repository to store categories.
 */
public interface CategorieRespository extends CrudRepository<Category, String> {

}
