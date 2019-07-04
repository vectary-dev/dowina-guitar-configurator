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
        const mat = await api.createMaterial(materials[i]);
        if (mat) {
            console.log(`Material ${materials[i]} created`);
        } else {
            console.log(`Material ${materials[i]} cannot be created`);
        }
    }
}

async function init() {
    await api.setBackground(data.backgrounds.theater.path);
    executeStepWithOption("step1", "option1");
}

function executeStepWithOption(stepName, option) {
    switch (stepName) {
        case "step1":
            if (option) {
                if (option === "option1") {
                    currentBody = data.objects.guitar1;
                    // setVisibilityExclusive(data.objects.guitar1);
                    setVisibilityDeep(data.objects.guitar1, true);
                    setVisibilityDeep(data.objects.guitar2, false);
                } else {
                    currentBody = data.objects.guitar2;
                    setVisibilityDeep(data.objects.guitar1, false);
                    setVisibilityDeep(data.objects.guitar2, true);
                }
            } else {
                api.setCamera(data.cameras.backCam.name);
            }
            break;
        case "step2":
            if (option) {
                if (option === "option1") {
                    api.setMaterial("JC_Front", "White Wood");
                } else {
                    api.setMaterial(currentBody.front, data.materials.blueRosette.name);
                }
            } else {
                api.setCamera(data.cameras.sideCam.name);
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
        await init();
        console.log("All objects", await api.getObjects());

        await createMaterials(data.materials);

        const stepsConf = {
            next: "next",
            back: "back",
            steps: ["step1", "step2", "step3", "step4", "step5", "step6", "step7", "step8", "step9"]
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