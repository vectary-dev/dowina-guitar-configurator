// VIEWER API
async function vectaryViewer() {
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

      ////////////////////////////////////////////
      // APP
      ////////////////////////////////////////////

      var stepIndex = 1;
      showSteps(stepIndex);

      function changeSteps(n) {
        showSteps(stepIndex += n);
      }

      function goToStep(n) {
        showSteps(stepIndex = n);
      }

      function showSteps(n) {
        var i;
        var steps = document.getElementsByClassName("step");
        var dots = document.getElementsByClassName("dot");
        if (n > steps.length) {stepIndex = 1}    
        if (n < 1) {stepIndex = steps.length}
        for (i = 0; i < steps.length; i++) {
            steps[i].style.display = "none";  
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        steps[stepIndex-1].style.display = "block";  
        dots[stepIndex-1].className += " active";

        //console.log(stepIndex);
      }
      //Paging
      document.getElementById("next").addEventListener("click", function(event){
        changeSteps(1);
        dowina.setCamera(camera[stepIndex]);
        event.preventDefault();
      });
      document.getElementById("back").addEventListener("click", function(event){
        changeSteps(-1);
        dowina.setCamera(camera[stepIndex]);
        event.preventDefault();
      });

      ////////////////////////////////////////////
      // API 
      ////////////////////////////////////////////

      const objects = await dowina.getObjects();
      console.log("Objects", objects);

      const cameras = await dowina.getCameras();
      console.log("Cameras", cameras);

      const isLocalHost = (url) => {
        url.includes("localhost") ? true : false;
      }

      const setVisibilityMultiple = (arr, visible) => {
        arr.forEach(element => {
          dowina.setVisibility(element, visible);
        });
      };
      
      dowina.setBackground('files/theaterBG.hdr');


      //Switch body
      const changeBody = (body) => {
        currentBody = body;
        bodyTop = body[0];
        bodyBack = body[1];
        bodySide = body[2];
        console.log(currentBody);
      };

      const material1 = {
        name: "Wood",
        roughness: 0.8,
        metalness: 0.2,
        map: 'files/wood.jpg'
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

      //Find UUIDs of objects by their name
      const body1Top = objects.find( obj => obj.name === 'Clone_of_"Top1"' );
      const body1Back = objects.find( obj => obj.name === 'Clone_of_"Back1"' );
      const body1Side = objects.find( obj => obj.name === 'Clone_of_"Side1"' );
      const body2Top = objects.find( obj => obj.name === 'Clone_of_"Top2"' );
      const body2Back = objects.find( obj => obj.name === 'Clone_of_"Back2"' );
      const body2Side = objects.find( obj => obj.name === 'Clone_of_"Side2"' );
      const body3Top = objects.find( obj => obj.name === 'Clone_of_"Top3"' );
      const body3Back = objects.find( obj => obj.name === 'Clone_of_"Back3"' );
      const body3Side = objects.find( obj => obj.name === 'Clone_of_"Side3"' );



      //Groupping body objects (Top + back + side)
      const body1 = [body1Top.uuid, body1Back.uuid, body1Side.uuid];
      const body2 = [body2Top.uuid, body2Back.uuid, body2Side.uuid];
      const body3 = [body3Top.uuid, body3Back.uuid, body3Side.uuid];

      //var testObject = { 'one': 1, 'two': 2, 'three': 3 };

      
      //var retrievedObject = localStorage.getItem('body1');
      //console.log('retrievedObject: ', JSON.parse(retrievedObject));




      //Identify separate body parts
      let bodyTop = body1[0];
      let bodyBack = body1[1];
      let bodySide = body1[2];

      //Set default body and Top element
      let currentBody = body1;
      let currentElement = body1[0];
      
      let camera = [
        cameras[1].uuid, //Camera 0 for Step 0
        cameras[1].uuid, //Camera 1 for Step 1 Default
        cameras[2].uuid, //Camera 2 for Step 2 Top
        cameras[4].uuid, //Camera 3 for Step 3 Back
        cameras[3].uuid, //Camera 4 for Step 4 Side
        cameras[5].uuid, //Camera 5 for Step 5 Rosette
        cameras[1].uuid, //Camera 6 for Step 6
        cameras[1].uuid,  //Camera 7 for Step 7
        cameras[1].uuid  //Camera 7 for Step 8
      ];


      //Camera for Step 1
      dowina.setCamera(camera[1]);

      //Hide all but the first body
      setVisibilityMultiple(body1, true);
      setVisibilityMultiple(body2, false);
      setVisibilityMultiple(body3, false);
      
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

      
      $("#guitar1").on('click', () => {
        changeBody(body1);
        currentElement = currentBody[0];        
        setVisibilityMultiple(body1, true);
        setVisibilityMultiple(body2, false);
        setVisibilityMultiple(body3, false);
        // LocalStorage
        localStorage.setItem('step1', currentElement);
      });

      $("#guitar2").on('click', () => {
        changeBody(body2);
        currentElement = currentBody[0];
        setVisibilityMultiple(body1, false);
        setVisibilityMultiple(body2, true);
        setVisibilityMultiple(body3, false);
        localStorage.setItem('step1', currentElement);
      });

      $("#guitar3").on('click', () => {
        changeBody(body3);
        currentElement = currentBody[0];
        setVisibilityMultiple(body1, false);
        setVisibilityMultiple(body2, false);
        setVisibilityMultiple(body3, true);
        localStorage.setItem('step1', currentElement);
      });


      $("#material1f").on('click', () => {
        currentElement = currentBody[0];
        dowina.setMaterial(currentElement, mat1Id);
        localStorage.setItem('step2', mat1Id);
      });

      $("#material2f").on('click', () => {
        currentElement = currentBody[0];
        dowina.setMaterial(currentElement, mat2Id);
        localStorage.setItem('step2', mat2Id);
      });

      $("#material3f").on('click', () => {
        currentElement = currentBody[0];
        dowina.setMaterial(currentElement, mat3Id);
        localStorage.setItem('step2', mat3Id);
      });


      $("#material1b").on('click', () => {
        currentElement = currentBody[1];        
        dowina.setMaterial(currentElement, mat1Id);
        localStorage.setItem('step3', mat1Id);
      });

      $("#material2b").on('click', () => {              
        dowina.setMaterial(currentElement, mat2Id);
        localStorage.setItem('step3', mat2Id);
      });

      $("#material3b").on('click', () => {
        currentElement = currentBody[1];        
        dowina.setMaterial(currentElement, mat3Id);
        localStorage.setItem('step3', mat3Id);
      });


      $("#material1s").on('click', () => {
        currentElement = currentBody[2];        
        dowina.setMaterial(currentElement, mat1Id);
        localStorage.setItem('step4', mat1Id);
      });

      $("#material2s").on('click', () => {
        currentElement = currentBody[2];
        dowina.setMaterial(currentElement, mat2Id);
        localStorage.setItem('step4', mat2Id);
      });

      $("#material3s").on('click', () => {
        currentElement = currentBody[2];      
        dowina.setMaterial(currentElement, mat3Id);
        localStorage.setItem('step4', mat3Id);
      });








      


      testHandler(objects);
    } catch (e) {
      testErrHandler(e)
    }
  }

  let dowina = new vctr.VctrApi("dowina", testGlobalErrHandler);

  try {
    await dowina.init();
    onReadyTest();
  } catch (e) {
    testGlobalErrHandler(e);
  }
}

