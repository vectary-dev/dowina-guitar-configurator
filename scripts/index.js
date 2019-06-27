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
}

async function setVisibilityDeep(object, visibility) {
    Object.getOwnPropertyNames(object).forEach(async key => {
        await api.setVisibility(object[key], visibility);
    });
}

async function init() {

    await setVisibilityDeep(data.objects.guitar2, false);
    await setVisibilityDeep(data.objects.guitar1, true);

    await api.setCamera(data.cameras.rosetteCam);
    await api.setBackground(data.backgrounds.theater.path);
}

function executeStepWithOption(stepName, option) {
    switch (stepName) {
        case "step1":
            if (option === "option1") {
                currentBody = data.objects.guitar1;
                setVisibilityDeep(data.objects.guitar1, true);
                setVisibilityDeep(data.objects.guitar2, false);
            } else {
                currentBody = data.objects.guitar2;
                setVisibilityDeep(data.objects.guitar2, true);
                setVisibilityDeep(data.objects.guitar1, false);
            }
            api.setCamera(data.cameras.rosetteCam);
            break;
        case "step2":
            if (option === "option1") {
                api.setMaterial(currentBody.name, data.materials.whiteWood);
            } else {
                api.setMaterial(currentBody.name, data.materials.blueRosette);
            }
            api.setCamera(data.cameras.bodyCam);
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
    });
    backBtn.addEventListener("click", e => {
        e.preventDefault();
        paging.goToPreviousStep();
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