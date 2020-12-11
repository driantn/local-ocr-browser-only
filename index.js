const RECONGNISE_TEXT = "recognizing text";

class OcrWeb {
  constructor() {
    this.wrapper = document.getElementsByClassName("container")[0];
    this.input = document.getElementById("uploadFile");
    this.progress = document.getElementById("progress-bar");
    this.status = document.getElementById("status");
  }

  init = () => {
    this.input.addEventListener("change", this.onSelectFile, false);
  };

  onSelectFile = (event) => {
    const [file] = event.target.files;
    this.analyze(file);
  };

  onShowData = (text) => {
    const newDiv = document.createElement("div");
    newDiv.innerText = text;
    this.wrapper.appendChild(newDiv);
  };

  updateStatusText = (text) => {
    this.status.innerText = text;
  };

  updateProgress = (value) => {
    if (value === 0) {
      this.progress.parentNode.style.display = "flex";
    }
    if (value === 1) {
      this.progress.parentNode.style.display = "none";
      this.status.style.display = "none";
      return;
    }
    this.progress.style.width = `${value * 100}%`;
  };

  analyze = async (file) => {
    var self = this;
    const worker = Tesseract.createWorker({
      logger: function (m) {
        self.updateStatusText(m.status);
        if (m.status === RECONGNISE_TEXT) {
          self.input.parentNode.style.display = "none";
          self.updateProgress(m.progress);
        }
      },
    });

    await worker.load();
    await worker.loadLanguage("deu");
    await worker.initialize("deu");
    const {
      data: { text },
    } = await worker.recognize(file);
    this.onShowData(text);
    await worker.terminate();
  };
}

window.addEventListener("load", function () {
  const ocr = new OcrWeb();
  ocr.init();
});
