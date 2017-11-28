package base;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class ActivityControlerTests {
	
	
	@Autowired
	private MockMvc mockMvc;
	
	@Test
	public void Test1_noActivitys() throws Exception {
		this.mockMvc.perform(get("/activity")).andDo(print())
			.andExpect(status().isOk()).andExpect(content().json("[]"));
	}
	
	@Test
	public void Test2_createActivity() throws Exception {
		this.mockMvc.perform(post("/activity").contentType(MediaType.APPLICATION_JSON).
			content("{ \"title\": \"Testactivity\", \"text\": \"Test zur Erstellung einer Activity\", \"tags\": \"#test #probieren\"}")).
			andExpect(status().isOk()).andExpect(content().
			json("{ \"id\": 1, \"title\": \"Testactivity\", \"text\": \"Test zur Erstellung einer Activity\", \"tags\": \"#test #probieren\"}" ));
	}
}
