import { VctrApi } from "https://www.vectary.com/embed/viewer/v1/scripts/api/api.js";

let api, paging, data;

let currentBody;


function globalErrHandler(objects) {
    console.log("test api failed", objects);
}

async function fetchData(path) {
    return new Promise((resolve, reject) => {
        try {
            fetch(path)
                .then(file => file.json()
                    .then(json => resolve(json)));
        } catch (e) {
            reject(e);
        }
    });
}

class Paging {

    constructor() {
        this.stepNames = [];
        this.previousStepIndex = 0;
        this.activeStepIndex = 0;
    }

    setSteps(steps) {
        this.stepNames = steps;
        this.hideAllSteps();
    }

    goToNextStep() {
        if (this.activeStepIndex + 1 <= this.stepNames.length) {
            this.previousStepIndex = this.activeStepIndex;
            this.activeStepIndex = this.activeStepIndex + 1;
            this.showStep();
        }
    }

    goToPreviousStep() {
        if (this.activeStepIndex > 0) {
            this.previousStepIndex = this.activeStepIndex;
            this.activeStepIndex = this.activeStepIndex - 1;
            this.showStep();
        }
    }

    goToStep(stepName) {
        this.previousStepIndex = this.activeStepIndex;
        this.activeStepIndex = this.stepNames.indexOf(stepName);
        this.showStep();
    }

    showStep() {
        const oldActiveElem = document.getElementById(this.stepNames[this.previousStepIndex]);
        oldActiveElem.style.display = "none";
        oldActiveElem.classList.remove("selected");

        const newActiveElem = document.getElementById(this.stepNames[this.activeStepIndex]);
        newActiveElem.style.display = "";
        newActiveElem.classList.add("selected");

        const dots = document.getElementsByClassName("dot");
        dots[this.previousStepIndex].classList.remove("active");
        dots[this.activeStepIndex].classList.add("active");
    }

    hideAllSteps() {
        this.stepNames.forEach(stepName => {
            const elem = document.getElementById(stepName);
            if (elem) {
                elem.style.display = "none";
                elem.classList.remove("selected");
            }
        });
    }

    getActiveStepName() {
        return this.stepNames[this.activeStepIndex];
    }
}

async function setVisibilityDeep(object, visibility) {
    Object.getOwnPropertyNames(object).forEach(key => {
        api.setVisibility(object[key], visibility);
    });
}

// function setVisibilityExclusive(object) {
//     const arrOfNames = Object.getOwnPropertyNames(object).map(name => object[name]);
//     api.setVisibilityExclusive(arrOfNames, "mesh");
// }

async function createMaterials(dataMaterials) {
    const materials = Object.getOwnPropertyNames(dataMaterials);
    for (let i = 0; i < materials.length; i++) {
        const mat = await api.createMaterial(dataMaterials[materials[i]]);
        if (mat) {
            console.log(`Material ${materials[i]} created`, mat);
        } else {
            console.log(`Material ${materials[i]} cannot be created`);
        }
    }
}

function start() {
    if (localStorage.step1) {
        executeStepWithOption("step1", localStorage.getItem("step1"));
        elementExistsInLocalStorage("front");
        elementExistsInLocalStorage("back");
        elementExistsInLocalStorage("side");
        elementExistsInLocalStorage("rosette");
    } else {
        executeStepWithOption("step1", "option1");
    }
}

function elementExistsInLocalStorage(element) {
    if (localStorage[element]) {
        const materialName = localStorage.getItem(element);
        api.setMaterial(currentBody[element], materialName);
    }
}

async function init() {
    await api.setBackground(data.backgrounds.theater.path);
    start();
}

function executeStepWithOption(stepName, option) {
    switch (stepName) {
        case "step1":
            if (option) {
                if (option === "option1") {
                    currentBody = data.objects.guitar1;
                    localStorage.setItem('step1', "option1");
                    // setVisibilityExclusive(data.objects.guitar1);
                    setVisibilityDeep(data.objects.guitar1, true);
                    setVisibilityDeep(data.objects.guitar2, false);
                } else {
                    currentBody = data.objects.guitar2;
                    localStorage.setItem('step1', "option2");
                    setVisibilityDeep(data.objects.guitar1, false);
                    setVisibilityDeep(data.objects.guitar2, true);
                }
            } else {
                api.setCamera(data.cameras.frontCam.name);
            }
            break;
        case "step2":
            if (option) {
                api.setMaterial(currentBody.front, localStorage.front);
                if (option === "option1") {
                    localStorage.setItem('front', data.materials.whiteWood.name);
                    api.setMaterial(currentBody.front, data.materials.whiteWood.name);
                } else {
                    localStorage.setItem('front', data.materials.original.name);
                    api.setMaterial(currentBody.front, data.materials.original.name);
                }
            } else {
                api.setCamera(data.cameras.bodyCam.name);
            }
            break;
        case "step3":
            if (option) {
                api.setMaterial(currentBody.back, localStorage.back);
                api.setMaterial(currentBody.side, localStorage.side);
                if (option === "option1") {
                    localStorage.setItem('back', data.materials.whiteWood.name);
                    api.setMaterial(currentBody.back, data.materials.whiteWood.name);
                    localStorage.setItem('side', data.materials.whiteWood.name);
                    api.setMaterial(currentBody.side, data.materials.whiteWood.name);
                } else {
                    localStorage.setItem('back', data.materials.original.name);
                    api.setMaterial(currentBody.back, data.materials.original.name);
                    localStorage.setItem('side', data.materials.original.name);
                    api.setMaterial(currentBody.side, data.materials.original.name);
                }
            } else {
                api.setCamera(data.cameras.backCam.name);
            }
            break;
        case "step4":
            if (option) {
                api.setMaterial(currentBody.rosette, localStorage.rosette);
                if (option === "option1") {
                    localStorage.setItem('rosette', data.materials.rosette1.name);
                    api.setMaterial(currentBody.rosette, data.materials.rosette1.name);
                } else if (option === "option2") {
                    localStorage.setItem('rosette', data.materials.rosette2.name);
                    api.setMaterial(currentBody.rosette, data.materials.rosette2.name);
                } else if (option === "option3") {
                    localStorage.setItem('rosette', data.materials.rosette3.name);
                    api.setMaterial(currentBody.rosette, data.materials.rosette3.name);
                } else {
                    localStorage.setItem('rosette', data.materials.rosette4.name);
                    api.setMaterial(currentBody.rosette, data.materials.rosette4.name);
                }
            } else {
                api.setCamera(data.cameras.rosetteCam.name);
            }
            break;
        case "step5":
            if (option) {
                if (option === "option1") {
                    console.log("Missing Materials");
                } else {
                    console.log("Missing Materials");
                }
            } else {
                api.setCamera(data.cameras.backDetailCam.name);
            }
            break;
        case "step6":
            if (option) {
                if (option === "option1") {
                    console.log("Missing Materials");
                } else {
                    console.log("Missing Materials");
                }
            } else {
                api.setCamera(data.cameras.frontDetailCam.name);
            }
            break;
        case "step7":
            if (option) {
                if (option === "option1") {
                    console.log("Missing Materials");
                } else {
                    console.log("Missing Materials");
                }
            } else {
                api.setCamera(data.cameras.sideDetailCam.name);
            }
            break;
        case "step8":
            if (option) {
                if (option === "option1") {
                    console.log("Missing Materials");
                }
            } else {
                api.setCamera(data.cameras.frontCam.name);
            }
            break;
    }
}

function setListeners(buttons) {
    const nextBtn = document.getElementById(buttons.next);
    const backBtn = document.getElementById(buttons.back);
    if (!nextBtn || !backBtn) {
        throw new Error("Cannot find next or back button.");
    }

    nextBtn.addEventListener("click", e => {
        e.preventDefault();
        paging.goToNextStep();
        executeStepWithOption(paging.getActiveStepName());
    });
    backBtn.addEventListener("click", e => {
        e.preventDefault();
        paging.goToPreviousStep();
        executeStepWithOption(paging.getActiveStepName());
    });

    for (let i = 0; i < buttons.steps.length; i++) {
        const stepName = buttons.steps[i];
        const step = document.getElementById(stepName);
        if (!step) {
            throw new Error(`Cannot find step, ${stepName}`);
        }

        const options = step.getElementsByTagName("li");
        for (let i = 0; i < options.length; i++) {
            options[i].addEventListener('click', () => {
                executeStepWithOption(stepName, `option${i + 1}`);
            });
        }
    }
}

async function run() {
    console.log("Example API running..");

    try {
        api = new VctrApi("dowina", globalErrHandler);
        paging = new Paging();

        await api.init();

        data = await fetchData("/files/resource.json");
        await createMaterials(data.materials);
        await init();
        console.log("All objects", await api.getObjects());

        const stepsConf = {
            next: "next",
            back: "back",
            steps: ["step1", "step2", "step3", "step4", "step5", "step6", "step7", "step8"]
        };

        paging.setSteps(stepsConf.steps);

        setListeners(stepsConf);

        paging.goToStep("step1");

        console.log("Ready..");

    } catch (e) {
        globalErrHandler(e);
    }
}

run();