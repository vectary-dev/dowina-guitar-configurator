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

  async function onReady() {
    console.log("API ready");

    async function readTextFile(file) {
      return new Promise((resolve, reject) => {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = () => {
          if (rawFile.readyState === 4 && rawFile.status == "200") {
            resolve(rawFile.responseText);
          }
        }
        rawFile.send(null);
      });
    }

    try {
      const json = await readTextFile("files/resource.json");
      const resource = JSON.parse(json);

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

      function setSelected(className) {
        let elem = document.getElementsByClassName(className)[0].parentElement;
        elem.className = "selected";
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

      const meshes = await dowina.getMeshes();
      console.log("Meshes", meshes);

      const setVisibilityMultiple = (arr, visible) => {
        arr.forEach(name => {
          dowina.setVisibility(name, visible);
        });
      };

      let bodyPartsNames = [
        [resource.guitars[0].top, resource.guitars[0].back, resource.guitars[0].side], //Body 0
        [resource.guitars[1].top, resource.guitars[1].back, resource.guitars[1].side], //Body 1
        [resource.guitars[2].top, resource.guitars[2].back, resource.guitars[2].side],  //Body 2
      ];

      bodyPartsNames.forEach(body => {
        setVisibilityMultiple(body, false);
      })

      const getBody = (names) => {
        let body = [];
        names.forEach(async name => {
          const bodyParts = await dowina.getObjectsByName(name);
          body.push(bodyParts[0]);
        });
        return body;
      }

      const body1 = await getBody(bodyPartsNames[0]);
      const body2 = await getBody(bodyPartsNames[1]);
      const body3 = await getBody(bodyPartsNames[2]);

      console.log('body1', body1);

      //Set default body and Top element
      let currentBody = body1;
      let currentElement = body1[0];

      //Switch body
      const changeBody = (body) => {
        currentBody = body;
        bodyTop = body[0];
        bodyBack = body[1];
        bodySide = body[2];
      };

      //CAMERAS ////////////////////////////////////////////////////

      const cameras = await dowina.getCameras();
      console.log("Cameras", cameras);

      //Define cameras for each step, for easy switching
      let camera = [
        cameras[1].name, //Camera 0 for Step 1 Default
        cameras[1].name, //Camera 1 for Step 2 Top
        cameras[2].name, //Camera 2 for Step 3 Back
        cameras[4].name, //Camera 3 for Step 4 Side
        cameras[3].name, //Camera 4 for Step 5 Rosette
        cameras[5].name, //Camera 5 for Step 6 Electronics
        cameras[1].name, //Camera 6 for Step 7 Bag
        cameras[1].name  //Camera 7 for Step 8 Summary        
      ];

      //MATERIALS ////////////////////////////////////////////////////

      const material1 = resource.materials[0];
      const material2 = resource.materials[1];
      const material3 = resource.materials[2];

      //Create new materials
      dowina.createMaterial(material1);
      dowina.createMaterial(material2);
      dowina.createMaterial(material3);

      //Load all scene materials
      const allSceneMaterials = await dowina.getMaterials();
      console.log("Materials", allSceneMaterials);    

      //New materials
      let material = [
        allSceneMaterials[12].name, // Material 1 - Wood
        allSceneMaterials[13].name, // Material 2 - White
        allSceneMaterials[14].name  // Material 3 - Chocolate
      ];

      //Init values
    
      dowina.setCamera(camera[0]);
      dowina.setBackground('files/theaterBG.hdr');

      //IF EXISTS, LOAD VALUES FROM LOCAL STORAGE
      const loadFromLocalStorage = () => {
        let loadedNames = [];
        let loadedStep1 = loadData('step1');
        loadedStep1.forEach(data => {
          loadedNames.push(data.name)
        });
        setVisibilityMultiple(loadedNames, true);

        let loadedStep2 = loadData('step2');
        dowina.setMaterial(loadedNames[0], loadedStep2);

        let loadedStep3 = loadData('step3');
        dowina.setMaterial(loadedNames[1], loadedStep3);

        let loadedStep4 = loadData('step4');
        dowina.setMaterial(loadedNames[2], loadedStep4);
      }

      loadFromLocalStorage();

      goToStep(1);

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
          if ( event.target.classList.contains( 'body0' ) ) {
            changeBody(body1);   
            setVisibilityMultiple(bodyPartsNames[0], true);
            setVisibilityMultiple(bodyPartsNames[1], false);
            setVisibilityMultiple(bodyPartsNames[2], false);
            saveData ('step1', body1);
            setSelected("body0");
          }
          if ( event.target.classList.contains( 'body1' ) ) {
            changeBody(body2);                        
            setVisibilityMultiple(bodyPartsNames[0], false);
            setVisibilityMultiple(bodyPartsNames[1], true);
            setVisibilityMultiple(bodyPartsNames[2], false);
            saveData ('step1', body2);
            setSelected("body1");
          }
          if ( event.target.classList.contains( 'body2' ) ) {
            changeBody(body3);                        
            setVisibilityMultiple(bodyPartsNames[0], false);
            setVisibilityMultiple(bodyPartsNames[1], false);
            setVisibilityMultiple(bodyPartsNames[2], true);
            saveData ('step1', body3);
            setSelected("body2");
          }          
        }
        //Step2
        if ( event.target.classList.contains( 'step2' ) ) {
          currentElement = currentBody[0];
          if ( event.target.classList.contains( 'material0' ) ) {             
            dowina.setMaterial(currentElement.name, material[0]);
            saveData ('step2', material[0]);
            setSelected("step2 material0");
          }
          if ( event.target.classList.contains( 'material1' ) ) { 
            dowina.setMaterial(currentElement.name, material[1]);
            saveData ('step2', material[1]);
            setSelected("step2 material1");
          }
          if ( event.target.classList.contains( 'material2' ) ) {             
            dowina.setMaterial(currentElement.name, material[2]);
            saveData ('step2', material[2]);
            setSelected("step2 material2");
          }          
        }        
        //Step3
        if ( event.target.classList.contains( 'step3' ) ) {
          currentElement = currentBody[1];
          if ( event.target.classList.contains( 'material0' ) ) {            
            dowina.setMaterial(currentElement.name, material[0]);
            saveData ('step3', material[0]);
            setSelected("step3 material0");
          }
          if ( event.target.classList.contains( 'material1' ) ) {             
            dowina.setMaterial(currentElement.name, material[1]);
            saveData ('step3', material[1]);
            setSelected("step3 material1");
          }
          if ( event.target.classList.contains( 'material2' ) ) {
            dowina.setMaterial(currentElement.name, material[2]);
            saveData ('step3', material[2]);
            setSelected("step3 material2");
          }          
        }
        //Step4
        if ( event.target.classList.contains( 'step4' ) ) {
          currentElement = currentBody[2]; 
          if ( event.target.classList.contains( 'material0' ) ) { 
            dowina.setMaterial(currentElement.name, material[0]);
            saveData ('step4', material[0]);
            setSelected("step4 material0");
          }
          if ( event.target.classList.contains( 'material1' ) ) { 
            dowina.setMaterial(currentElement.name, material[1]);
            saveData ('step4', material[1]);
            setSelected("step4 material1");
          }
          if ( event.target.classList.contains( 'material2' ) ) { 
            dowina.setMaterial(currentElement.name, material[2]);
            saveData ('step4', material[2]);
            setSelected("step4 material2");
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

      testHandler(meshes);
    } catch (e) {
      testErrHandler(e)
    }
  }

  let dowina = new vctr.VctrApi("dowina", testGlobalErrHandler);

  try {
    await dowina.init();
    onReady();
  } catch (e) {
    testGlobalErrHandler(e);
  }
}

