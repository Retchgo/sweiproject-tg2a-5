package base;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.text.SimpleDateFormat;
import java.util.Date;

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
  public void test01_noActivitys() throws Exception {
    this.mockMvc.perform(get("/activity")).andDo(print())
      .andExpect(status().isOk()).andExpect(content().json("[]"));
  }
  
  @Test
  public void test02_createCategory() throws Exception {
    this.mockMvc.perform(post("/category").contentType(MediaType.APPLICATION_JSON)
        .content("{ \"name\": \"FirstCat\"}")).andExpect(status().isOk())
        .andExpect(content().json("{ \"name\": \"FirstCat\"}"));
  }
  
  @Test
  public void test03_createSecondCategory() throws Exception {
    this.mockMvc.perform(post("/category").contentType(MediaType.APPLICATION_JSON)
        .content("{ \"name\": \"SecondCat\"}")).andExpect(status().isOk())
        .andExpect(content().json("{ \"name\": \"SecondCat\"}"));
  }
  

  @Test
  public void test04_createActivity() throws Exception {
    String currentTime = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date());
    this.mockMvc.perform(post("/activity").contentType(MediaType.APPLICATION_JSON)
        .content("{ \"title\": \"Testactivity\", \"category\": {\"name\": \"FirstCat\"}, "
        + "\"text\": \"Test zur Erstellung einer Activity\", "
        + "\"tags\": \"#test #probieren\"}")).andExpect(status().isOk()).andExpect(content()
        .json("{ \"id\": 1, \"title\": \"Testactivity\", \"creationDate\": \"" + currentTime
        + "\", \"text\": \"Test zur Erstellung einer Activity\", \"tags\": \"#test #probieren\"}"
        + "\"category\": {\"name\": \"FirstCat\"}"));
  }

  @Test
  public void test04_deleteActivity() throws Exception {
    this.mockMvc.perform(delete("/activity/1")).andExpect(status().isOk());
  }

  @Test
  public void test05_createAndDeleteActivity() throws Exception {
    String currentTime = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date());
    this.mockMvc.perform(post("/activity").contentType(MediaType.APPLICATION_JSON)
        .content("{ \"title\": \"Testactivity\",  \"category\": {\"name\": \"SecondCat\"},"
        + "\"text\": \"Test zur Erstellung einer Activity\", "
        + "\"tags\": \"#test #probieren\"}")).andExpect(status().isOk()).andExpect(content()
        .json("{ \"id\": 2, \"title\": \"Testactivity\", \"creationDate\": \"" + currentTime 
        + "\", \"text\": \"Test zur Erstellung einer Activity\", \"tags\": \"#test #probieren\"}"
        + "\"category\": {\"name\": \"SecondCat\"}"));

    this.mockMvc.perform(delete("/activity/2")).andExpect(status().isOk());
  }

  @Test
  public void test06_editActivity() throws Exception {
    String currentTime = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date());
    this.mockMvc.perform(post("/activity").contentType(MediaType.APPLICATION_JSON)
        .content("{ \"title\": \"Testactivity\", \"category\": {\"name\": \"FirstCat\"}, "
        + "\"text\": \"Test zur Erstellung einer Activity\", "
        + "\"tags\": \"#test #probieren\"}")).andExpect(status().isOk()).andExpect(content()
        .json("{ \"id\": 3, \"title\": \"Testactivity\", \"creationDate\": \"" + currentTime 
        + "\", \"text\": \"Test zur Erstellung einer Activity\", "
        + "\"tags\": \"#test #probieren\"} \"category\": {\"name\": \"FirstCat\"}"));

    String newcurrentTime = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date());
    this.mockMvc.perform(put("/activity/3").contentType(MediaType.APPLICATION_JSON)
        .content("{ \"title\": \"Testactivity2\", \"text\": "
        + "\"Test zur Erstellung einer zweiten Activity\", \"category\": {\"name\": \"SecondCat\"},"
        + "\"tags\": \"#test #probieren #zwei\"}"))
        .andExpect(status().isOk()).andExpect(content()
        .json("{ \"id\": 3, \"title\": \"Testactivity2\", \"creationDate\": \"" + newcurrentTime
        + "\", \"text\": \"Test zur Erstellung einer zweiten Activity\", "
        + "\"tags\": \"#test #probieren #zwei\"} \"category\": {\"name\": \"SecondCat\"}"));
  }

  @Test
  public void test07_createActivityToHaveMoreThanOne() throws Exception {
    String currentTime = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date());
    this.mockMvc.perform(post("/activity").contentType(MediaType.APPLICATION_JSON)
        .content("{ \"title\": \"Activity 2\", \"category\": {\"name\": \"FirstCat\"}, \"text\": "
        + "\"Es wird noch eine weitere Activity benötigt\", \"tags\": \"#2 #weitere\"}"))
        .andExpect(status().isOk()).andExpect(content()
        .json("{ \"id\": 4, \"title\": \"Activity 2\", \"creationDate\": \"" + currentTime 
        + "\", \"text\": \"Es wird noch eine weitere Activity benötigt\", "
        + "\"tags\": \"#2 #weitere\"} \"category\": {\"name\": \"FirstCat\"}" ));
    this.mockMvc.perform(post("/activity").contentType(MediaType.APPLICATION_JSON)
        .content("{ \"title\": \"Activity 3\", \"category\": {\"name\": \"SecondCat\"}, \"text\": "
        + "\"Es wird noch eine weitere Activity benötigt\", \"tags\": \"#3 #weitere\"}"))
        .andExpect(status().isOk()).andExpect(content()
        .json("{ \"id\": 5, \"title\": \"Activity 3\", \"creationDate\": \"" + currentTime
        + "\", \"text\": \"Es wird noch eine weitere Activity benötigt\", "
        + "\"tags\": \"#3 #weitere\"} \"category\": {\"name\": \"SecondCat\"}" ));
  }

  @Test
  public void test08_getAllActivities() throws Exception {
    String currentTime = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date());
    this.mockMvc.perform(get("/activity")).andExpect(status().isOk()).andExpect(content()
        .json("[{ \"id\": 3, \"title\": \"Testactivity2\", \"creationDate\": \"" 
        + currentTime + "\", \"text\": \"Test zur Erstellung einer zweiten Activity\", "
        + "\"tags\": \"#test #probieren #zwei\", \"category\": {\"name\": \"SecondCat\"}},"
        + "{ \"id\": 4, \"title\": \"Activity 2\", \"creationDate\": \"" + currentTime
        + "\", \"text\": \"Es wird noch eine weitere Activity benötigt\", "
        + "\"tags\": \"#2 #weitere\", \"category\": {\"name\": \"FirstCat\"}},"
        + "{ \"id\": 5, \"title\": \"Activity 3\", \"creationDate\": \"" + currentTime
        + "\", \"text\": \"Es wird noch eine weitere Activity benötigt\", "
        + "\"tags\": \"#3 #weitere\", \"category\": {\"name\": \"SecondCat\"}}]"));
  }

  @Test
  public void test09_getOneActivity() throws Exception {
    String currentTime = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date());
    this.mockMvc.perform(get("/activity/4")).andExpect(status().isOk()).andExpect(content()
        .json("{ \"id\": 4, \"title\": \"Activity 2\", \"creationDate\": \"" + currentTime
        + "\", \"text\": \"Es wird noch eine weitere Activity benötigt\", "
        + "\"tags\": \"#2 #weitere\", \"category\": {\"name\": \"FirstCat\"}}"));
  }

  @Test
  public void test10_deleteNoneExistingActivity() throws Exception {
    this.mockMvc.perform(delete("/activity/10")).andExpect(status().isBadRequest());
  }

  @Test
  public void test11_editNotExistingActivity() throws Exception {
    this.mockMvc.perform(put("/activity/1").contentType(MediaType.APPLICATION_JSON)
        .content("{ \"title\": \"Testactivity2\", \"category\": {\"name\": \"FirstCat\"}, \"text\":"
        + "\"Test zur Erstellung einer zweiten Activity\", \"tags\": \"#test #probieren #zwei\"}"))
        .andExpect(status().isBadRequest());
  }

  @Test
  public void test12_createInvalidActivity() throws Exception {
    this.mockMvc.perform(post("/activity").contentType(MediaType.APPLICATION_JSON)
        .content("{ \"irgendwas\": \"Testactivity\",  \"category\": {\"name\": \"FirstCat\"}, "
        + "\"text\":\"Test zur Erstellung einer Activity\", \"tags\": \"#test #probieren\"}"))
        .andExpect(status().isBadRequest());
  }
}
