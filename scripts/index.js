//jQuery
$(document).ready(function(){

  //Disable clicks for href=# 
  $('a[href="#"]').click(function(e) {
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
  });

  //Next/Back paging
  $(".steps .step").each(function(e) {
      if (e != 0)
          $(this).hide();
  });
  
  $(".next").click(function(){
      if ($(".steps .step:visible").next().length != 0)
          $(".steps .step:visible").next().show().prev().hide();
      else {
          $(".steps .step:visible").hide();
          $(".steps .step:first").show();
      }
      return false;
  });

  $(".back").click(function(){
      if ($(".steps .step:visible").prev().length != 0)
          $(".steps .step:visible").prev().show().next().hide();
      else {
          $(".steps .step:visible").hide();
          $(".steps .step:last").show();
      }
      return false;
  });
});









//API
async function apiLogic() {
  console.log("Example client script running..");

  function testGlobalErrHandler(objects) {
    console.log("test api failed", objects);
  }

  function testHandler(objects) {
    console.log("testHandler replied with", objects);
  }

  function testHitHandler(objects) {
    console.log("testHitHandler replied with", objects);
  }

  function testErrHandler(objects) {
    console.log("testErrHandler failed with", objects);
  }

  async function onReadyTest() {
    console.log("API ready");
    try {
      const objects = await dowina.getObjects();
      console.log("Objects", objects);

      const cameras = await dowina.getCameras();
      console.log("Cameras", cameras);

      const isLocalHost = (url) => {
        url.includes("localhost") ? true : false;
      }

      const material1 = {
        name: "Wood",
        roughness: 0.8,
        metalness: 0.2,
        map: isLocalHost(window.location.origin) ? `${window.location.origin}/demo/demo5/wood.jpg` : `${window.location.origin}/embed/demo/demo5/wood.jpg`
      }
      const material2 = {
        name: "Black",
        color: "#FFFFFF",
        roughness: 0.9,
        metalness: 0.1,
      }

      const material3 = {
        name: "Chocolate",
        color: "#564327",
        roughness: 0.9,
        metalness: 0.1,
      }

      //Initial values
      
      //Groupping body objects (front + back + side)
      const body1 = [objects[0].uuid, objects[1].uuid, objects[2].uuid];
      const body2 = [objects[4].uuid, objects[5].uuid, objects[6].uuid];
      const body3 = [objects[7].uuid, objects[8].uuid, objects[9].uuid];

      //Identify separate body parts
      let bodyFront = body1[0].uuid;
      let bodyBack = body1[1].uuid;
      let bodySide = body1[2].uuid;

      //Set default body and front element
      let currentBody = body1;
      let currentElement = body1[0];

      dowina.setCamera(cameras[2].uuid);

      const setVisibilityMultiple = (arr, visible) => {
        arr.forEach(element => {
          dowina.setVisibility(element, visible);
        });
      };
      
      //Switch body
      const changeBody = (body) => {
        currentBody = body;
        bodyFront = body[0].uuid;
        bodyBack = body[1].uuid;
        bodySide = body[2].uuid;
      };

      
      
      //Create new materials
      dowina.createMaterial(material1);
      dowina.createMaterial(material2);
      dowina.createMaterial(material3);

      //Load all scene materials
      const allSceneMaterials = await dowina.getMaterials();
      console.log("Materials", allSceneMaterials);

      //Choose 3 new materials we want to work with, can we do it with name, not key?
      const mat1Id = allSceneMaterials[11].uuid;
      const mat2Id = allSceneMaterials[12].uuid;
      const mat3Id = allSceneMaterials[13].uuid;

      //Hide all but the first shape
      setVisibilityMultiple(body1, true);
      setVisibilityMultiple(body2, false);
      setVisibilityMultiple(body3, false);

      const body1Button = document.getElementById("guitar1");
      const body2Button = document.getElementById("guitar2");
      const body3Button = document.getElementById("guitar3");

      const bodyButtons = [body1Button, body2Button, body3Button];

      // const hideButtons = (buttons, hide) => {
      //   buttons.forEach(btn => {
      //     btn.hidden = hide;
      //   });
      // }

      //hideButtons(bodyButtons, true);

      //hideButtons(frontMaterialButtons, true);
      //hideButtons(backMaterialButtons, true);
      //hideButtons(sideMaterialButtons, true);
      
      $("#guitar1").on('click', () => {
        changeBody(body1);
        currentElement = currentBody[0];
        dowina.setCamera(cameras[2].uuid);
        setVisibilityMultiple(body1, true);
        setVisibilityMultiple(body2, false);
        setVisibilityMultiple(body3, false);
        //hideButtons(bodyButtons, true);
      });

      $("#guitar2").on('click', () => {
        changeBody(body2);
        currentElement = currentBody[0];
        dowina.setCamera(cameras[2].uuid);
        setVisibilityMultiple(body2, true);
        setVisibilityMultiple(body1, false);
        setVisibilityMultiple(body3, false);
        //hideButtons(bodyButtons, true);
      });

      $("#guitar3").on('click', () => {
        changeBody(body3);
        currentElement = currentBody[0];
        dowina.setCamera(cameras[2].uuid);
        setVisibilityMultiple(body3, true);
        setVisibilityMultiple(body1, false);
        setVisibilityMultiple(body2, false);
        //hideButtons(bodyButtons, true);
      });


      $("#material1f").on('click', () => {
        currentElement = currentBody[0];
        dowina.setCamera(cameras[0].uuid);
        dowina.setMaterial(currentElement, mat1Id);
      });

      $("#material2f").on('click', () => {
        currentElement = currentBody[0];
        dowina.setCamera(cameras[0].uuid);
        dowina.setMaterial(currentElement, mat2Id);
      });

      $("#material3f").on('click', () => {
        currentElement = currentBody[0];
        dowina.setCamera(cameras[0].uuid);
        dowina.setMaterial(currentElement, mat3Id);
      });


      $("#material1b").on('click', () => {
        currentElement = currentBody[1];
        dowina.setCamera(cameras[1].uuid);
        dowina.setMaterial(currentElement, mat1Id);
      });

      $("#material2b").on('click', () => {
        currentElement = currentBody[1];
        dowina.setCamera(cameras[1].uuid);
        dowina.setMaterial(currentElement, mat2Id);
      });

      $("#material3b").on('click', () => {
        currentElement = currentBody[1];
        dowina.setCamera(cameras[1].uuid);
        dowina.setMaterial(currentElement, mat3Id);
      });


      $("#material1s").on('click', () => {
        dowina.setCamera(cameras[2].uuid);
        console.log("currentElement", currentElement);
        dowina.setMaterial(currentElement, mat1Id);
      });

      $("#material2s").on('click', () => {
        dowina.setCamera(cameras[2].uuid);
        console.log("currentElement", currentElement);
        dowina.setMaterial(currentElement, mat2Id);
      });

      $("#material3s").on('click', () => {
        dowina.setCamera(cameras[2].uuid);
        console.log("currentElement", currentElement);
        dowina.setMaterial(currentElement, mat3Id);
      });

      testHandler(objects);
    } catch (e) {
      testErrHandler(e)
    }
  }

  let dowina = new VctrApi("dowina", testGlobalErrHandler);

  try {
    await dowina.init();
    onReadyTest();
  } catch (e) {
    testGlobalErrHandler(e);
  }
}