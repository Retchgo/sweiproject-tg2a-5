package base;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/")
public class EduLifeController {

    /**
     * The default page is index.html. So if no page is specified
     * index.html will be displayed in the browser.
     * @return index.html
     */
	@GetMapping
    public String index() {
    	return "index.html";
    }
}