

(function () {
    "use strict";


    var STEP = 3;

    var FILTER_CONFIG = {
        brightness: { min: 0, max: 200, defaultVal: 100, unit: "%" },
        saturation: { min: 0, max: 200, defaultVal: 100, unit: "%" },
        inversion:  { min: 0, max: 100, defaultVal: 0,   unit: "%" },
        grayscale:  { min: 0, max: 100, defaultVal: 0,   unit: "%" },
        sepia:      { min: 0, max: 100, defaultVal: 0,   unit: "%" },
        blur:       { min: 0, max: 30,  defaultVal: 0,   unit: "px" }
    };

    var DEFAULT_STATE = {
        brightness: 100,
        saturation: 100,
        inversion: 0,
        grayscale: 0,
        sepia: 0,
        blur: 0,
        rotate: 0,
        flipH: false,
        flipV: false
    };


    var currentState  = cloneState(DEFAULT_STATE); // Current filter values
    var activeFilter  = "brightness";              // Currently selected filter tab
    var originalImage = null;                       // Base64 of the loaded image

    var history      = [{ state: cloneState(DEFAULT_STATE), label: "Original" }];
    var historyIndex = 0;


    var previewImg      = document.getElementById("preview-img");
    var placeholderText = document.getElementById("placeholder-text");
    var imageContainer  = document.getElementById("image-container");
    var filterSlider    = document.getElementById("filter-slider");
    var filterNameEl    = document.getElementById("filter-name");
    var filterValueEl   = document.getElementById("filter-value");
    var rotateSlider    = document.getElementById("rotate-slider");
    var rotateValueEl   = document.getElementById("rotate-value");
    var fileInput       = document.getElementById("file-input");
    var chooseBtn       = document.getElementById("choose-btn");
    var saveBtn         = document.getElementById("save-btn");
    var resetBtn        = document.getElementById("reset-btn");
    var undoBtn         = document.getElementById("undo-btn");
    var redoBtn         = document.getElementById("redo-btn");
    var historyList     = document.getElementById("history-list");
    var filterBtns      = document.querySelectorAll(".filter-btn");


    function init() {
        attachEventListeners();
        updateSliderUI();
        updateSliderBackground(filterSlider);
        updateSliderBackground(rotateSlider);
        renderHistoryPanel();
    }


    function attachEventListeners() {

        for (var i = 0; i < filterBtns.length; i++) {
            filterBtns[i].addEventListener("click", onFilterBtnClick);
        }

        filterSlider.addEventListener("input", onFilterSliderInput);

        filterSlider.addEventListener("change", onFilterSliderChange);

        rotateSlider.addEventListener("input", onRotateSliderInput);

        rotateSlider.addEventListener("change", onRotateSliderChange);

        document.getElementById("rotate-left").addEventListener("click", function () {
            currentState.rotate = (currentState.rotate - 90 + 360) % 360;
            syncRotateUI();
            applyFilters();
            pushHistory("Rotate Left (-90\u00B0)");
        });

        document.getElementById("rotate-right").addEventListener("click", function () {
            currentState.rotate = (currentState.rotate + 90) % 360;
            syncRotateUI();
            applyFilters();
            pushHistory("Rotate Right (+90\u00B0)");
        });

        document.getElementById("flip-h").addEventListener("click", function () {
            currentState.flipH = !currentState.flipH;
            applyFilters();
            pushHistory("Flip Horizontal: " + (currentState.flipH ? "On" : "Off"));
        });

        document.getElementById("flip-v").addEventListener("click", function () {
            currentState.flipV = !currentState.flipV;
            applyFilters();
            pushHistory("Flip Vertical: " + (currentState.flipV ? "On" : "Off"));
        });

        resetBtn.addEventListener("click", onResetClick);

        chooseBtn.addEventListener("click", function () {
            fileInput.click();
        });

        fileInput.addEventListener("change", onFileSelected);

        saveBtn.addEventListener("click", saveImage);

        undoBtn.addEventListener("click", undo);
        redoBtn.addEventListener("click", redo);
    }


    function onFilterBtnClick() {
        activeFilter = this.id;         
        highlightActiveBtn(this);
        updateSliderUI();
    }


    function onFilterSliderInput() {
        currentState[activeFilter] = parseInt(this.value, 10);
        updateFilterDisplay();
        updateSliderBackground(this);
        applyFilters();
    }


    function onFilterSliderChange() {
        var config = FILTER_CONFIG[activeFilter];
        var label  = capitalize(activeFilter) + ": " + this.value + config.unit;
        pushHistory(label);
    }


    function onRotateSliderInput() {
        currentState.rotate = parseInt(this.value, 10);
        rotateValueEl.textContent = this.value + "\u00B0";
        updateSliderBackground(this);
        applyFilters();
    }


    function onRotateSliderChange() {
        pushHistory("Rotate: " + this.value + "\u00B0");
    }


    function onResetClick() {
        currentState = cloneState(DEFAULT_STATE);
        activeFilter = "brightness";
        highlightActiveBtn(document.getElementById("brightness"));
        updateSliderUI();
        syncRotateUI();
        applyFilters();

        pushHistory("Reset Filters");
    }


    function onFileSelected(e) {
        var file = e.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function (event) {
            originalImage   = event.target.result;
            previewImg.src  = originalImage;
            previewImg.style.display = "block";
            placeholderText.style.display = "none";
            imageContainer.classList.add("has-image");

            fullReset();
        };
        reader.readAsDataURL(file);

        fileInput.value = "";
    }


    function applyFilters() {
        if (!originalImage) return;

        var filterStr =
            "brightness(" + (currentState.brightness / 100) + ") " +
            "saturate("   + (currentState.saturation / 100) + ") " +
            "invert("     + (currentState.inversion  / 100) + ") " +
            "grayscale("  + (currentState.grayscale  / 100) + ") " +
            "sepia("      + (currentState.sepia      / 100) + ") " +
            "blur("       + currentState.blur + "px)";

        var transformStr =
            "rotate(" + currentState.rotate + "deg) " +
            "scaleX(" + (currentState.flipH ? -1 : 1) + ") " +
            "scaleY(" + (currentState.flipV ? -1 : 1) + ")";

        previewImg.style.filter    = filterStr;
        previewImg.style.transform = transformStr;
    }


    function buildFilterString() {
        return (
            "brightness(" + (currentState.brightness / 100) + ") " +
            "saturate("   + (currentState.saturation / 100) + ") " +
            "invert("     + (currentState.inversion  / 100) + ") " +
            "grayscale("  + (currentState.grayscale  / 100) + ") " +
            "sepia("      + (currentState.sepia      / 100) + ") " +
            "blur("       + currentState.blur + "px)"
        );
    }


    function saveImage() {
        if (!originalImage) {
            alert("Please choose an image first!");
            return;
        }

        var img = new Image();
        img.onload = function () {
            var w = img.naturalWidth;
            var h = img.naturalHeight;

            var radians = currentState.rotate * Math.PI / 180;
            var sinAbs  = Math.abs(Math.sin(radians));
            var cosAbs  = Math.abs(Math.cos(radians));
            var newW    = Math.ceil(w * cosAbs + h * sinAbs);
            var newH    = Math.ceil(w * sinAbs + h * cosAbs);

            var canvas = document.createElement("canvas");
            canvas.width  = newW;
            canvas.height = newH;

            var ctx = canvas.getContext("2d");

            ctx.filter = buildFilterString();

            ctx.translate(newW / 2, newH / 2);
            ctx.rotate(radians);
            ctx.scale(
                currentState.flipH ? -1 : 1,
                currentState.flipV ? -1 : 1
            );

            ctx.drawImage(img, -w / 2, -h / 2, w, h);

            var link = document.createElement("a");
            link.download = "edited-image.png";
            link.href     = canvas.toDataURL("image/png");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        img.src = originalImage;
    }


    function fullReset() {
        currentState = cloneState(DEFAULT_STATE);
        activeFilter = "brightness";

        highlightActiveBtn(document.getElementById("brightness"));
        updateSliderUI();
        syncRotateUI();
        applyFilters();

        history      = [{ state: cloneState(DEFAULT_STATE), label: "Original" }];
        historyIndex = 0;
        renderHistoryPanel();
        updateUndoRedoButtons();
    }


    function highlightActiveBtn(activeBtn) {
        for (var i = 0; i < filterBtns.length; i++) {
            filterBtns[i].classList.remove("active");
        }
        activeBtn.classList.add("active");
    }


    function updateSliderUI() {
        var config = FILTER_CONFIG[activeFilter];

        filterSlider.min   = config.min;
        filterSlider.max   = config.max;
        filterSlider.step  = STEP;
        filterSlider.value = currentState[activeFilter];

        updateFilterDisplay();
        updateSliderBackground(filterSlider);
    }


    function updateFilterDisplay() {
        var config = FILTER_CONFIG[activeFilter];
        filterNameEl.textContent  = capitalize(activeFilter);
        filterValueEl.textContent = currentState[activeFilter] + config.unit;
    }


    function syncRotateUI() {
        rotateSlider.value         = currentState.rotate;
        rotateValueEl.textContent  = currentState.rotate + "\u00B0";
        updateSliderBackground(rotateSlider);
    }


    function updateSliderBackground(slider) {
        var min     = parseFloat(slider.min);
        var max     = parseFloat(slider.max);
        var val     = parseFloat(slider.value);
        var percent = ((val - min) / (max - min)) * 100;

        slider.style.background =
            "linear-gradient(to right, #5372F0 0%, #5372F0 " +
            percent + "%, #ddd " + percent + "%, #ddd 100%)";
    }

    
    function pushHistory(label) {
        history = history.slice(0, historyIndex + 1);

        history.push({
            state: cloneState(currentState),
            label: label
        });
        historyIndex = history.length - 1;

        renderHistoryPanel();
        updateUndoRedoButtons();
    }


    function undo() {
        if (historyIndex <= 0) return;
        historyIndex--;
        restoreFromHistory(historyIndex);
    }


    function redo() {
        if (historyIndex >= history.length - 1) return;
        historyIndex++;
        restoreFromHistory(historyIndex);
    }

  
    function restoreFromHistory(idx) {
        var snapshot = history[idx].state;

        currentState.brightness = snapshot.brightness;
        currentState.saturation = snapshot.saturation;
        currentState.inversion  = snapshot.inversion;
        currentState.grayscale  = snapshot.grayscale;
        currentState.sepia      = snapshot.sepia;
        currentState.blur       = snapshot.blur;
        currentState.rotate     = snapshot.rotate;
        currentState.flipH      = snapshot.flipH;
        currentState.flipV      = snapshot.flipV;

        updateSliderUI();
        syncRotateUI();
        applyFilters();
        renderHistoryPanel();
        updateUndoRedoButtons();
    }


    function updateUndoRedoButtons() {
        undoBtn.disabled = (historyIndex <= 0);
        redoBtn.disabled = (historyIndex >= history.length - 1);
    }


    function renderHistoryPanel() {
        historyList.innerHTML = "";

        for (var i = 0; i < history.length; i++) {
            var item       = document.createElement("div");
            item.className = "history-item" + (i === historyIndex ? " active" : "");
            item.textContent = (i + 1) + ". " + history[i].label;
            item.setAttribute("data-index", i);

            item.addEventListener("click", onHistoryItemClick);

            historyList.appendChild(item);
        }

        historyList.scrollTop = historyList.scrollHeight;
    }


    function onHistoryItemClick() {
        var idx = parseInt(this.getAttribute("data-index"), 10);
        historyIndex = idx;
        restoreFromHistory(idx);
    }


    function cloneState(stateObj) {
        return {
            brightness: stateObj.brightness,
            saturation: stateObj.saturation,
            inversion:  stateObj.inversion,
            grayscale:  stateObj.grayscale,
            sepia:      stateObj.sepia,
            blur:       stateObj.blur,
            rotate:     stateObj.rotate,
            flipH:      stateObj.flipH,
            flipV:      stateObj.flipV
        };
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    init();

})();
