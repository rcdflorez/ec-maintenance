/**
 * Stepper class to manage from steps
 **/
class Stepper {

  constructor() {
    this.step = 0;
    this.listeners = [];
  }

  addListener(fn) {
    this.listeners.push(fn);
  }

  update(step) {
    this.listeners.forEach(listener => listener(step));
  }

  nextStep() {
    this.step = this.step + 1;
    this.update(this.step);
    return this.step;
  }

  prevStep() {
    if (this.step > 0) {
      this.step = this.step - 1;
      console.log(this);
      $("div.side-bar-menu .navbar-nav li.nb-stp-" + (this.step)).removeClass("completed");
      this.update(this.step);
    }
    return this.step;
  }

  getCurrentStep() {
    return this.step;
  }
}

