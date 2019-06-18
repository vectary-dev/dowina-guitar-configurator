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
      // PAGING ////////////////////////////////////////////////////
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
      } 
      
      function saveData (step, value) {
        localStorage.setItem(step, JSON.stringify(value));
      }

      function loadData (step) {
        if(localStorage.getItem(step)===null) {
          return false;
        }
        return JSON.parse(localStorage.getItem(step));
      }


      
      //OBJECTS ////////////////////////////////////////////////////

      const objects = await dowina.getObjects();
      console.log("Objects", objects);

      const setVisibilityMultiple = (arr, visible) => {
        arr.forEach(element => {
          //const elementObject = dowina.getObjectByName(element);
          console.log('element', element);
          dowina.setVisibility(element, visible);
        });
      };
      
      //Switch body
      const changeBody = (body) => {
        currentBody = body;
        bodyTop = body[0];
        bodyBack = body[1];
        bodySide = body[2];
        //console.log(currentBody);
      };

      //Find UUIDs of objects by their name      
      // const body1Top = await dowina.getObjectByName('Clone_of_"Top1"');
      // const body1Back = await dowina.getObjectByName('Clone_of_"Back1"' );
      // const body1Side = await dowina.getObjectByName('Clone_of_"Side1"' );
      // const body2Top = await dowina.getObjectByName('Clone_of_"Top2"' );
      // const body2Back = await dowina.getObjectByName('Clone_of_"Back2"' );
      // const body2Side = await dowina.getObjectByName('Clone_of_"Side2"' );
      // const body3Top = await dowina.getObjectByName('Clone_of_"Top3"' );
      // const body3Back = await dowina.getObjectByName('Clone_of_"Back3"' );
      // const body3Side = await dowina.getObjectByName('Clone_of_"Side3"' );
     
      //console.log('body1Back', body1Back);

      let body = [
        ['Clone_of_"Top1"', 'Clone_of_"Back1"', 'Clone_of_"Side1"'], //Body 0
        ['Clone_of_"Top2"', 'Clone_of_"Back2"', 'Clone_of_"Side2'], //Body 1
        ['Clone_of_"Top3"', 'Clone_of_"Back3"', 'Clone_of_"Side3"'],  //Body 2
      ];

      console.log('body', body);

      //Identify separate body parts
      let bodyTop = body[0][0];
      let bodyBack = body[0][1];
      let bodySide = body[0][2];

      //Set default body and Top element
      let currentBody = body[0];
      let currentElement = body[0][0];
      

      //CAMERAS ////////////////////////////////////////////////////

      const cameras = await dowina.getCameras();
      console.log("Cameras", cameras);

      //Define cameras for each step, for easy switching
      let camera = [
        cameras[1].uuid, //Camera 0 for Step 1 Default
        cameras[1].uuid, //Camera 1 for Step 2 Top
        cameras[2].uuid, //Camera 2 for Step 3 Back
        cameras[4].uuid, //Camera 3 for Step 4 Side
        cameras[3].uuid, //Camera 4 for Step 5 Rosette
        cameras[5].uuid, //Camera 5 for Step 6 Electronics
        cameras[1].uuid, //Camera 6 for Step 7 Bag
        cameras[1].uuid  //Camera 7 for Step 8 Summary        
      ];

      //MATERIALS ////////////////////////////////////////////////////

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

      //Create new materials
      dowina.createMaterial(material1);
      dowina.createMaterial(material2);
      dowina.createMaterial(material3);

      //Load all scene materials
      const allSceneMaterials = await dowina.getMaterials();
      console.log("Materials", allSceneMaterials);    

      //New materials
      let material = [
        allSceneMaterials[11].uuid, //Material 0 - Wood
        allSceneMaterials[12].uuid, //Material 0 - Wood
        allSceneMaterials[13].uuid  //Material 0 - Wood
      ];



      //Init values
    
      dowina.setCamera(camera[0]);
      dowina.setBackground('files/theaterBG.hdr');
      //IF EXISTS, LOAD VALUES FROM LOCAL STORAGE
      let loaded = '';
      if (loadData('step1')) {
        let loaded = loadData('step1');
        setVisibilityMultiple(loaded, true);  
      }
      else {
        setVisibilityMultiple(body[0], true);
        saveData ('step1', body[0]);
      }
      

      console.log('loaded', loaded);
      console.log('body1', body[0]);
      //setVisibilityMultiple(body[0], false);
      //setVisibilityMultiple(body[1], false);
      //setVisibilityMultiple(body[2], false);
      // setVisibilityMultiple(loaded, true);
      //goToStep(1);

      document.getElementById("next").addEventListener("click", function(event){
        changeSteps(1);
        dowina.setCamera(camera[stepIndex]);
        //IF EXISTS, LOAD VALUES FROM LOCAL STORAGE
        event.preventDefault();
      });
      document.getElementById("back").addEventListener("click", function(event){
        changeSteps(-1);
        dowina.setCamera(camera[stepIndex]);
        //IF EXISTS, LOAD VALUES FROM LOCAL STORAGE
        event.preventDefault();
      });


      //Document click actions
      document.addEventListener('click', function (event) {
        //Step1
        if ( event.target.classList.contains( 'step1' ) ) {
          currentElement = currentBody[0];
          if ( event.target.classList.contains( 'body0' ) ) {
            changeBody(body[0]);   
            setVisibilityMultiple(body[0], true);
            setVisibilityMultiple(body[1], false);
            setVisibilityMultiple(body[2], false);
            saveData ('step1', body[0]);
          }
          if ( event.target.classList.contains( 'body1' ) ) {
            changeBody(body[1]);                        
            setVisibilityMultiple(body[0], false);
            setVisibilityMultiple(body[1], true);
            setVisibilityMultiple(body[2], false);
            saveData ('step1', body[1]);
          }
          if ( event.target.classList.contains( 'body2' ) ) {
            changeBody(body[2]);                        
            setVisibilityMultiple(body[0], false);
            setVisibilityMultiple(body[1], false);
            setVisibilityMultiple(body[2], true);
            saveData ('step1', body[2]);                            
          }          
        }
        //Step2
        if ( event.target.classList.contains( 'step2' ) ) {
          currentElement = currentBody[0];
          if ( event.target.classList.contains( 'material0' ) ) {             
            dowina.setMaterial(currentElement, material[0]);
            saveData ('step2', material[0]);
          }
          if ( event.target.classList.contains( 'material1' ) ) { 
            dowina.setMaterial(currentElement, material[1]);
            saveData ('step2', material[1]);
          }
          if ( event.target.classList.contains( 'material2' ) ) {             
            dowina.setMaterial(currentElement, material[2]);
            saveData ('step2', material[2]);
          }          
        }        
        //Step3
        if ( event.target.classList.contains( 'step3' ) ) {
          currentElement = currentBody[1];
          if ( event.target.classList.contains( 'material0' ) ) {            
            dowina.setMaterial(currentElement, material[0]);
            saveData ('step3', material[0]);
          }
          if ( event.target.classList.contains( 'material1' ) ) {             
            dowina.setMaterial(currentElement, material[1]);
            saveData ('step3', material[1]);
          }
          if ( event.target.classList.contains( 'material2' ) ) {
            dowina.setMaterial(currentElement, material[2]);
            saveData ('step3', material[2]);
          }          
        }
        //Step4
        if ( event.target.classList.contains( 'step4' ) ) {
          currentElement = currentBody[2]; 
          if ( event.target.classList.contains( 'material0' ) ) { 
            dowina.setMaterial(currentElement, material[0]);
            saveData ('step4', material[0]);
          }
          if ( event.target.classList.contains( 'material1' ) ) { 
            dowina.setMaterial(currentElement, material[1]);
            saveData ('step4', material[1]);
          }
          if ( event.target.classList.contains( 'material2' ) ) { 
            dowina.setMaterial(currentElement, material[2]);
            saveData ('step4', material[2]);
          }          
        }
        //Step5
        if ( event.target.classList.contains( 'step5' ) ) {

        }
        //Step6
        if ( event.target.classList.contains( 'step6' ) ) {

        }
        //Step7
        if ( event.target.classList.contains( 'step7' ) ) {

        }
        //Step8
        if ( event.target.classList.contains( 'step8' ) ) {

        }

      }, false);

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

