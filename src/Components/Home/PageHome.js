import React,{useEffect} from 'react';
import VideoCarusol from '../VideoCarusol';
const PageHome = () => {

  useEffect(()=>{
    
    const readMore = document.querySelectorAll(".reveal-toggler");
    const readMoreLabel = document.querySelectorAll(".reveal-btn");
    const visibleText = document.querySelectorAll(".visible-text");
    const hiddenText = document.querySelectorAll(".hidden-text");
    
    readMore.forEach((el, index) => {
      el.onchange = () => {
        if (el.checked) {
          visibleText[index].style.display = "none";
          hiddenText[index].style.display = "block";
          readMoreLabel[index].innerHTML = "READ LESS";
        } else {
          hiddenText[index].style.display = "none";
          visibleText[index].style.display = "block";
          readMoreLabel[index].innerHTML = "READ MORE";
        }
      };
    })
    var VanillaTilt = (function () {


      class VanillaTilt {
        constructor(element, settings = {}) {
          if (!(element instanceof Node)) {
          }
      
          this.width = null;
          this.height = null;
          this.clientWidth = null;
          this.clientHeight = null;
          this.left = null;
          this.top = null;
      
          // for Gyroscope sampling
          this.gammazero = null;
          this.betazero = null;
          this.lastgammazero = null;
          this.lastbetazero = null;
      
          this.transitionTimeout = null;
          this.updateCall = null;
          this.event = null;
      
          this.updateBind = this.update.bind(this);
          this.resetBind = this.reset.bind(this);
      
          this.element = element;
          this.settings = this.extendSettings(settings);
      
          this.reverse = this.settings.reverse ? -1 : 1;
          this.glare = VanillaTilt.isSettingTrue(this.settings.glare);
          this.glarePrerender = VanillaTilt.isSettingTrue(this.settings["glare-prerender"]);
          this.fullPageListening = VanillaTilt.isSettingTrue(this.settings["full-page-listening"]);
          this.gyroscope = VanillaTilt.isSettingTrue(this.settings.gyroscope);
          this.gyroscopeSamples = this.settings.gyroscopeSamples;
      
          this.elementListener = this.getElementListener();
      
          if (this.glare) {
            this.prepareGlare();
          }
      
          if (this.fullPageListening) {
            this.updateClientSize();
          }
      
          this.addEventListeners();
          this.reset();
          this.updateInitialPosition();
        }
      
        static isSettingTrue(setting) {
          return setting === "" || setting === true || setting === 1;
        }
      
        /**
         * Method returns element what will be listen mouse events
         * @return {Node}
         */
        getElementListener() {
          if (this.fullPageListening) {
            return window.document;
          }
      
          if (typeof this.settings["mouse-event-element"] === "string") {
            const mouseEventElement = document.querySelector(this.settings["mouse-event-element"]);
      
            if (mouseEventElement) {
              return mouseEventElement;
            }
          }
      
          if (this.settings["mouse-event-element"] instanceof Node) {
            return this.settings["mouse-event-element"];
          }
      
          return this.element;
        }
      
        /**
         * Method set listen methods for this.elementListener
         * @return {Node}
         */
        addEventListeners() {
          this.onMouseEnterBind = this.onMouseEnter.bind(this);
          this.onMouseMoveBind = this.onMouseMove.bind(this);
          this.onMouseLeaveBind = this.onMouseLeave.bind(this);
          this.onWindowResizeBind = this.onWindowResize.bind(this);
          this.onDeviceOrientationBind = this.onDeviceOrientation.bind(this);
      
          this.elementListener.addEventListener("mouseenter", this.onMouseEnterBind);
          this.elementListener.addEventListener("mouseleave", this.onMouseLeaveBind);
          this.elementListener.addEventListener("mousemove", this.onMouseMoveBind);
      
          if (this.glare || this.fullPageListening) {
            window.addEventListener("resize", this.onWindowResizeBind);
          }
      
          if (this.gyroscope) {
            window.addEventListener("deviceorientation", this.onDeviceOrientationBind);
          }
        }
      
        /**
         * Method remove event listeners from current this.elementListener
         */
        removeEventListeners() {
          this.elementListener.removeEventListener("mouseenter", this.onMouseEnterBind);
          this.elementListener.removeEventListener("mouseleave", this.onMouseLeaveBind);
          this.elementListener.removeEventListener("mousemove", this.onMouseMoveBind);
      
          if (this.gyroscope) {
            window.removeEventListener("deviceorientation", this.onDeviceOrientationBind);
          }
      
          if (this.glare || this.fullPageListening) {
            window.removeEventListener("resize", this.onWindowResizeBind);
          }
        }
      
        destroy() {
          clearTimeout(this.transitionTimeout);
          if (this.updateCall !== null) {
            cancelAnimationFrame(this.updateCall);
          }
      
          this.reset();
      
          this.removeEventListeners();
          this.element.vanillaTilt = null;
          delete this.element.vanillaTilt;
      
          this.element = null;
        }
      
        onDeviceOrientation(event) {
          if (event.gamma === null || event.beta === null) {
            return;
          }
      
          this.updateElementPosition();
      
          if (this.gyroscopeSamples > 0) {
            this.lastgammazero = this.gammazero;
            this.lastbetazero = this.betazero;
      
            if (this.gammazero === null) {
              this.gammazero = event.gamma;
              this.betazero = event.beta;
            } else {
              this.gammazero = (event.gamma + this.lastgammazero) / 2;
              this.betazero = (event.beta + this.lastbetazero) / 2;
            }
      
            this.gyroscopeSamples -= 1;
          }
      
          const totalAngleX = this.settings.gyroscopeMaxAngleX - this.settings.gyroscopeMinAngleX;
          const totalAngleY = this.settings.gyroscopeMaxAngleY - this.settings.gyroscopeMinAngleY;
      
          const degreesPerPixelX = totalAngleX / this.width;
          const degreesPerPixelY = totalAngleY / this.height;
      
          const angleX = event.gamma - (this.settings.gyroscopeMinAngleX + this.gammazero);
          const angleY = event.beta - (this.settings.gyroscopeMinAngleY + this.betazero);
      
          const posX = angleX / degreesPerPixelX;
          const posY = angleY / degreesPerPixelY;
      
          if (this.updateCall !== null) {
            cancelAnimationFrame(this.updateCall);
          }
      
          this.event = {
            clientX: posX + this.left,
            clientY: posY + this.top,
          };
      
          this.updateCall = requestAnimationFrame(this.updateBind);
        }
      
        onMouseEnter() {
          this.updateElementPosition();
          this.element.style.willChange = "transform";
          this.setTransition();
        }
      
        onMouseMove(event) {
          if (this.updateCall !== null) {
            cancelAnimationFrame(this.updateCall);
          }
      
          this.event = event;
          this.updateCall = requestAnimationFrame(this.updateBind);
        }
      
        onMouseLeave() {
          this.setTransition();
      
          if (this.settings.reset) {
            requestAnimationFrame(this.resetBind);
          }
        }
      
        reset() {
          this.event = {
            clientX: this.left + this.width / 2,
            clientY: this.top + this.height / 2
          };
      
          if (this.element && this.element.style) {
            this.element.style.transform = `perspective(${this.settings.perspective}px) ` +
              `rotateX(0deg) ` +
              `rotateY(0deg) ` +
              `scale3d(1, 1, 1)`;
          }
      
          this.resetGlare();
        }
      
        resetGlare() {
          if (this.glare) {
            this.glareElement.style.transform = "rotate(180deg) translate(-50%, -50%)";
            this.glareElement.style.opacity = "0";
          }
        }
      
        updateInitialPosition() {
          if (this.settings.startX === 0 && this.settings.startY === 0) {
            return;
          }
      
          this.onMouseEnter();
      
          if (this.fullPageListening) {
            this.event = {
              clientX: (this.settings.startX + this.settings.max) / (2 * this.settings.max) * this.clientWidth,
              clientY: (this.settings.startY + this.settings.max) / (2 * this.settings.max) * this.clientHeight
            };
          } else {
            this.event = {
              clientX: this.left + ((this.settings.startX + this.settings.max) / (2 * this.settings.max) * this.width),
              clientY: this.top + ((this.settings.startY + this.settings.max) / (2 * this.settings.max) * this.height)
            };
          }
      
      
          let backupScale = this.settings.scale;
          this.settings.scale = 1;
          this.update();
          this.settings.scale = backupScale;
          this.resetGlare();
        }
      
        getValues() {
          let x, y;
      
          if (this.fullPageListening) {
            x = this.event.clientX / this.clientWidth;
            y = this.event.clientY / this.clientHeight;
          } else {
            x = (this.event.clientX - this.left) / this.width;
            y = (this.event.clientY - this.top) / this.height;
          }
      
          x = Math.min(Math.max(x, 0), 1);
          y = Math.min(Math.max(y, 0), 1);
      
          let tiltX = (this.reverse * (this.settings.max - x * this.settings.max * 2)).toFixed(2);
          let tiltY = (this.reverse * (y * this.settings.max * 2 - this.settings.max)).toFixed(2);
          let angle = Math.atan2(this.event.clientX - (this.left + this.width / 2), -(this.event.clientY - (this.top + this.height / 2))) * (180 / Math.PI);
      
          return {
            tiltX: tiltX,
            tiltY: tiltY,
            percentageX: x * 100,
            percentageY: y * 100,
            angle: angle
          };
        }
      
        updateElementPosition() {
          let rect = this.element.getBoundingClientRect();
      
          this.width = this.element.offsetWidth;
          this.height = this.element.offsetHeight;
          this.left = rect.left;
          this.top = rect.top;
        }
      
        update() {
          let values = this.getValues();
      
          this.element.style.transform = "perspective(" + this.settings.perspective + "px) " +
            "rotateX(" + (this.settings.axis === "x" ? 0 : values.tiltY) + "deg) " +
            "rotateY(" + (this.settings.axis === "y" ? 0 : values.tiltX) + "deg) " +
            "scale3d(" + this.settings.scale + ", " + this.settings.scale + ", " + this.settings.scale + ")";
      
          if (this.glare) {
            this.glareElement.style.transform = `rotate(${values.angle}deg) translate(-50%, -50%)`;
            this.glareElement.style.opacity = `${values.percentageY * this.settings["max-glare"] / 100}`;
          }
      
          this.element.dispatchEvent(new CustomEvent("tiltChange", {
            "detail": values
          }));
      
          this.updateCall = null;
        }
      
        /**
         * Appends the glare element (if glarePrerender equals false)
         * and sets the default style
         */
        prepareGlare() {
          // If option pre-render is enabled we assume all html/css is present for an optimal glare effect.
          if (!this.glarePrerender) {
            // Create glare element
            const jsTiltGlare = document.createElement("div");
            jsTiltGlare.classList.add("js-tilt-glare");
      
            const jsTiltGlareInner = document.createElement("div");
            jsTiltGlareInner.classList.add("js-tilt-glare-inner");
      
            jsTiltGlare.appendChild(jsTiltGlareInner);
            this.element.appendChild(jsTiltGlare);
          }
      
          this.glareElementWrapper = this.element.querySelector(".js-tilt-glare");
          this.glareElement = this.element.querySelector(".js-tilt-glare-inner");
      
          if (this.glarePrerender) {
            return;
          }
      
          Object.assign(this.glareElementWrapper.style, {
            "position": "absolute",
            "top": "0",
            "left": "0",
            "width": "100%",
            "height": "100%",
            "overflow": "hidden",
            "pointer-events": "none"
          });
      
          Object.assign(this.glareElement.style, {
            "position": "absolute",
            "top": "50%",
            "left": "50%",
            "pointer-events": "none",
            "background-image": `linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)`,
            "transform": "rotate(180deg) translate(-50%, -50%)",
            "transform-origin": "0% 0%",
            "opacity": "0",
          });
      
          this.updateGlareSize();
        }
      
        updateGlareSize() {
          if (this.glare) {
            const glareSize = (this.element.offsetWidth > this.element.offsetHeight ? this.element.offsetWidth : this.element.offsetHeight) * 2;
      
            Object.assign(this.glareElement.style, {
              "width": `${glareSize}px`,
              "height": `${glareSize}px`,
            });
          }
        }
      
        updateClientSize() {
          this.clientWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
      
          this.clientHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
        }
      
        onWindowResize() {
          this.updateGlareSize();
          this.updateClientSize();
        }
      
        setTransition() {
          clearTimeout(this.transitionTimeout);
          this.element.style.transition = this.settings.speed + "ms " + this.settings.easing;
          if (this.glare) this.glareElement.style.transition = `opacity ${this.settings.speed}ms ${this.settings.easing}`;
      
          this.transitionTimeout = setTimeout(() => {
            this.element.style.transition = "";
            if (this.glare) {
              this.glareElement.style.transition = "";
            }
          }, this.settings.speed);
      
        }
      
        /**
         * Method return patched settings of instance
         * @param {boolean} settings.reverse - reverse the tilt direction
         * @param {number} settings.max - max tilt rotation (degrees)
         * @param {startX} settings.startX - the starting tilt on the X axis, in degrees. Default: 0
         * @param {startY} settings.startY - the starting tilt on the Y axis, in degrees. Default: 0
         * @param {number} settings.perspective - Transform perspective, the lower the more extreme the tilt gets
         * @param {string} settings.easing - Easing on enter/exit
         * @param {number} settings.scale - 2 = 200%, 1.5 = 150%, etc..
         * @param {number} settings.speed - Speed of the enter/exit transition
         * @param {boolean} settings.transition - Set a transition on enter/exit
         * @param {string|null} settings.axis - What axis should be disabled. Can be X or Y
         * @param {boolean} settings.glare - What axis should be disabled. Can be X or Y
         * @param {number} settings.max-glare - the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
         * @param {boolean} settings.glare-prerender - false = VanillaTilt creates the glare elements for you, otherwise
         * @param {boolean} settings.full-page-listening - If true, parallax effect will listen to mouse move events on the whole document, not only the selected element
         * @param {string|object} settings.mouse-event-element - String selector or link to HTML-element what will be listen mouse events
         * @param {boolean} settings.reset - false = If the tilt effect has to be reset on exit
         * @param {gyroscope} settings.gyroscope - Enable tilting by deviceorientation events
         * @param {gyroscopeSensitivity} settings.gyroscopeSensitivity - Between 0 and 1 - The angle at which max tilt position is reached. 1 = 90deg, 0.5 = 45deg, etc..
         * @param {gyroscopeSamples} settings.gyroscopeSamples - How many gyroscope moves to decide the starting position.
         */
        extendSettings(settings) {
          let defaultSettings = {
            reverse: false,
            max: 15,
            startX: 0,
            startY: 0,
            perspective: 1000,
            easing: "cubic-bezier(.03,.98,.52,.99)",
            scale: 1,
            speed: 300,
            transition: true,
            axis: null,
            glare: false,
            "max-glare": 1,
            "glare-prerender": false,
            "full-page-listening": false,
            "mouse-event-element": null,
            reset: true,
            gyroscope: true,
            gyroscopeMinAngleX: -45,
            gyroscopeMaxAngleX: 45,
            gyroscopeMinAngleY: -45,
            gyroscopeMaxAngleY: 45,
            gyroscopeSamples: 10
          };
      
          let newSettings = {};
          for (var property in defaultSettings) {
            if (property in settings) {
              newSettings[property] = settings[property];
            } else if (this.element.hasAttribute("data-tilt-" + property)) {
              let attribute = this.element.getAttribute("data-tilt-" + property);
              try {
                newSettings[property] = JSON.parse(attribute);
              } catch (e) {
                newSettings[property] = attribute;
              }
      
            } else {
              newSettings[property] = defaultSettings[property];
            }
          }
      
          return newSettings;
        }
      
        static init(elements, settings) {
          if (elements instanceof Node) {
            elements = [elements];
          }
      
          if (elements instanceof NodeList) {
            elements = [].slice.call(elements);
          }
      
          if (!(elements instanceof Array)) {
            return;
          }
      
          elements.forEach((element) => {
            if (!("vanillaTilt" in element)) {
              element.vanillaTilt = new VanillaTilt(element, settings);
            }
          });
        }
      }
      
      if (typeof document !== "undefined") {
        /* expose the class to window */
        window.VanillaTilt = VanillaTilt;
      
        /**
         * Auto load
         */
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
      }
      
      return VanillaTilt;
      
      }());


  } )

    
    return (
        <div>
                <div className="container-fluid about">
      <div className="container">
        <div className="row">
          <div className="col-md-6 animate hook1">
            <h3>FUTURE IS NOW</h3>
            <h2>ABOUT US</h2>
            <p>
              At Roche Robots, we firmly believe robotics will improve societal
              well-being and solve common issues. Robotics can make a difference
              by working alongside people, helping with household chores, and
              improving industrial workflow efficiency. They help bridge the
              staff shortages gap and are capable of so much more than we can
              currently imagine. <br /><br />
              Roche Robots is dedicated to developing innovative robotics
              solutions that make a difference in the world.
            </p>
            <a href="mailto:steve@rocherobots.com">Contact Us</a>
          </div>
          <div className="col-md-6 animate hook2">
            <img src={require("../../assets/eset-robot-full.png")} alt="" />
          </div>
        </div>
      </div>
    </div>
    <div className="container-fluid services">
      <p className="bgtxt" data-speed="8" data-factor="800">OUR SERVICES</p>
      <div className="container">
        <h2>OUR SERVICES</h2>
        <h3>SOLUTION & FOCUS AREA</h3>
        <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1">
          <div data-tilt data-tilt-glare data-tilt-max-glare="0.3" className="col">
            <div className="card animate hook3">
              <img src={require("../../assets/1333669-200 1.png")} alt="" />
              <h4>Setup and Delivery</h4>
              <p className="visible-text">
                When you receive your robot, the first thing you'll need to do
                is set it up. Depending on your chosen model ...
              </p>
              <p className="hidden-text">
                When you receive your robot, the first thing you'll need to do
                is set it up. Depending on your chosen model, this could be a
                simple or more complex process. We'll provide you with all the
                instructions you need and online support if you have any
                questions. Once your robot is up and running, we'll give you
                comprehensive training on all its features. This will help you
                to get the most out of your new companion. You'll learn to use
                its basic functions and more advanced features such as
                programming and customizing its behavior. <br /><br />
                We want you to be comfortable with your robot, so we'll take the
                time to make sure you understand everything. By the end of the
                training, you'll be an expert on your new robot and ready to
                start enjoying all its benefits. Most robots will come with an
                android screen, so getting to know this menu will be a must. The
                first thing you'll want to do is navigate to the settings menu.
                From here, you can adjust various aspects of your robot's
                behavior. <br /><br />
                You can choose which programs to install on your robot. If
                you're adventurous, you can explore the wide world of android
                apps. There are thousands of apps available, many designed
                specifically for robots. Read the reviews before downloading
                anything.
              </p>
              <input type="checkbox" id="read1" className="reveal-toggler" />
              <label for="read1" className="reveal-btn">READ MORE</label>
            </div>
          </div>
          <div  data-tilt data-tilt-glare data-tilt-max-glare="0.3" className="col">
            <div className="card animate hook3">
              <img src={require("../../assets/1333669-200 2.png")} alt="" />
              <h4>Program Coding</h4>
              <p className="visible-text">
                Before you buy a robot, it is important to consider what tasks
                you need it to perform and how much space you ...
              </p>
              <p className="hidden-text">
                Before you buy a robot, it is important to consider what tasks
                you need it to perform and howimport YouTubeVideo from './../Body/YouTubeVideo';
 much space you have available.
                You also want to think about whether you need a robot that can
                move around freely or one that is stationary. Our team can help
                you to assess your needs and choose the right model for your
                home or office. We also offer a comprehensive set-up service, so
                you can be sure your new robot will be up and running smoothly.
                <br />
                <br />
                We provide ongoing support and maintenance, so you can always
                keep your robot in peak condition. Whether you're looking for a
                basic model or a top-of-the-line machine, our team can help you
                to find the perfect solution for your needs. That’s why we
                provide programming and repair services for our clients. Our
                team is well-versed in several coding languages, so we can help
                with whatever robot you might need. We're also updating our
                services to ensure we provide the best care for your robot.
              </p>
              <input type="checkbox" id="read2" className="reveal-toggler" />
              <label for="read2" className="reveal-btn">READ MORE</label>
            </div>
          </div>
          <div data-tilt data-tilt-glare data-tilt-max-glare="0.3" className="col">
            <div className="card animate hook3">
              <img src={require("../../assets/1333669-200 3.png")} alt="" />
              <h4>Repairs and Maintenance</h4>
              <p className="visible-text">
                When your robot needs repairs, don't worry. Roche Robots has you
                covered. We offer high-quality services to our ...
              </p>
              <p className="hidden-text">
                When your robot needs repairs, don't worry. Roche Robots has you
                covered. We offer high-quality services to our customers in
                preventive and corrective maintenance, diagnosis, and equipment
                repair. We want to ensure your robot is always up and running so
                you can continue benefiting from all it offers. We know you're
                busy, so we make it easy for you. You can either bring your
                robot to us, or we can come to you. Our team is dedicated to
                providing you with the best possible experience.
              </p>
              <input type="checkbox" id="read3" className="reveal-toggler" />
              <label for="read3" className="reveal-btn">READ MORE</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="container-fluid video2">
      {/* <i className="fa-solid fa-angle-left" id="player-prev"></i>
      <i className="fa-solid fa-angle-right" id="player-next"></i> */}
      <div className="container">
        {/* <h3> </h3>
        <div id="player"></div>
        <div className="pagination"></div>
        <p></p> */}
        <VideoCarusol></VideoCarusol>
      </div>
    </div>
    <div className="container-fluid robotics py-5">
      <div className="container">
        <h2>ROBOTICS</h2>
        <h3>PROFESSIONAL AND BUSINESS ROBOTS</h3>
        <div className="row">
          <div className="col-md-6 image-deck">
            <div className="img animate hook4">
              <img src={require("../../assets/Picture1.png")} alt="" />
            </div>
            <div className="img animate hook4">
              <img src={require("../../assets/Picture2.png")} alt="" />
            </div>
            <div className="img animate hook4">
              <img src={require("../../assets/Picture3.png")} alt="" />
            </div>
            <div className="img animate hook4">
              <img src={require("../../assets/Picture4.png")} alt="" />
            </div>
          </div>
          <div className="col-md-6 animate hook2">
            <h4>Medical robots</h4>
            <p className="visible-text">
              One of the most promising applications of medical robots we
              specialize in is in the field of surgery. Traditionally, surgery
              has been highly invasive, requiring large incisions and long
              recovery times. However, surgical robots are changing all that.
              These machines can help doctors accurately perform delicate
              operations, resulting in shorter incisions and recovery periods.
              In addition, surgical robots can often ...
            </p>
            <p className="hidden-text">
              One of the most promising applications of medical robots we
              specialize in is in the field of surgery. Traditionally, surgery
              has been highly invasive, requiring large incisions and long
              recovery times. However, surgical robots are changing all that.
              These machines can help doctors accurately perform delicate
              operations, resulting in shorter incisions and recovery periods.
              In addition, surgical robots can often reach areas of the body
              that would be otherwise inaccessible to human surgeons. As a
              result, they are opening up new frontiers in medicine.
              <br /><br />
              Medical robots are also being used in other areas of medicine. For
              example, robots are now being used to dispense medication in
              hospitals and clinics. These machines can accurately measure and
              dispense medications, which can help reduce errors and improve
              patient safety. In addition, medical robots are being used to
              assist in physical therapy and rehabilitation. These machines can
              help patients regain strength and mobility after an injury or
              illness.
            </p>
            <input type="checkbox" id="read4" className="reveal-toggler" />
            <label for="read4" className="reveal-btn">READ MORE</label>
          </div>
        </div>
        <div className="row flex-wrap-reverse">
          <div className="col-md-6 animate hook1">
            <h4>Delivery Robots</h4>
            <p className="visible-text">
              Delivery robots will revolutionize the way we have done things for
              thousands of years. A doctor will never be out of reach of his
              equipment when the cabinet of medical equipment will come to him
              when he calls to the cabinet. Restaurants will be able to set and
              clear tables with the use of robots. They will take orders, run
              errands, seat people at tables and even take payment. Airlines
              robots will greet you exiting the ...
            </p>
            <p className="hidden-text">
              Delivery robots will revolutionize the way we have done things for
              thousands of years. A doctor will never be out of reach of his
              equipment when the cabinet of medical equipment will come to him
              when he calls to the cabinet. Restaurants will be able to set and
              clear tables with the use of robots. They will take orders, run
              errands, seat people at tables and even take payment. Airlines
              robots will greet you exiting the plane and carry your baggage to
              the pickup zone. Now, with a combination of sensors, cameras,
              facial recognition, and mobile technology, delivery robots will
              make business more cost-efficient, while working tirelessly,
              faster and smarter.
            </p>
            <input type="checkbox" id="read5" className="reveal-toggler" />
            <label for="read5" className="reveal-btn">READ MORE</label>
          </div>
          <div className="col-md-6 image-deck">
            <div className="img animate hook4">
              <img src={require("../../assets/Picture5.png")} alt="" />
            </div>
            <div className="img animate hook4">
              <img src={require("../../assets/Picture6.jpg")} alt="" />
            </div>
            <div className="img animate hook4">
              <img src={require("../../assets/Picture7.png")} alt="" />
            </div>
            <div className="img animate hook4">
              <img src={require("../../assets/Picture8.png")} alt="" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 image-deck">
            <div className="img animate hook4">
              <img src={require("../../assets/Picture9.png")} alt="" />
            </div>
            <div className="img animate hook4">
              <img src={require("../../assets/Picture10.png")} alt="" />
            </div>
            <div className="img animate hook4">
              <img src={require("../../assets/Picture11.png")} alt="" />
            </div>
            <div className="img animate hook4">
              <img src={require("../../assets/Picture12.jpg")} alt="" />
            </div>
          </div>
          <div className="col-md-6 animate hook2">
            <h4>Commercial Robots</h4>
            <p className="visible-text">
              A commercial robot is a robot that helps simplify or automate a
              task without physically interacting with it. For example, you may
              have seen airport commercial robots that help guide passengers to
              their gates. Other common examples include self-checkout machines
              in grocery stores and automated teller machines (ATMs). Many
              commercial robots are designed to interact ...
            </p>
            <p className="hidden-text">
              A commercial robot is a robot that helps simplify or automate a
              task without physically interacting with it. For example, you may
              have seen airport commercial robots that help guide passengers to
              their gates. Other common examples include self-checkout machines
              in grocery stores and automated teller machines (ATMs). Many
              commercial robots are designed to interact with people. This
              requires them to have sensors and cameras to detect people and
              objects around them. <br /><br />
              They also need software algorithms to interpret this data and
              decide how to react. For example, our company's commercial robots
              are equipped with these features to help them navigate crowded
              areas and avoid obstacles. The benefits of commercial robots
              include increased efficiency, safety, and accuracy. For instance,
              they can reduce wait times in airports by quickly directing
              passengers to open gates. They can also help reduce factory
              accidents by replacing humans in dangerous tasks. <br /><br />
              In many cases, commercial robots can do things better than humans.
              For instance, they can work longer hours without getting tired and
              make fewer mistakes. This is why commercial robots are
              increasingly being used in a variety of industries around the
              world.
            </p>
            <input type="checkbox" id="read6" className="reveal-toggler" />
            <label for="read6" className="reveal-btn">READ MORE</label>
          </div>
        </div>
        <div className="row flex-wrap-reverse">
          <div className="col-md-6 animate hook1">
            <h4>Telepresence robots</h4>
            <p className="visible-text">
              Telepresence robots are designed to provide a remote presence for
              workers who cannot be on site. These robots are equipped with
              cameras and sensors to navigate their environment and interact
              with people. One benefit of telepresence robots is that they can
              help to reduce travel costs by allowing workers to participate in
              meetings and events from anywhere in the world ...
            </p>
            <p className="hidden-text">
              Telepresence robots are designed to provide a remote presence for
              workers who cannot be on site. These robots are equipped with
              cameras and sensors to navigate their environment and interact
              with people. One benefit of telepresence robots is that they can
              help to reduce travel costs by allowing workers to participate in
              meetings and events from anywhere in the world. <br /><br />
              Additionally, telepresence robots can increase productivity by
              allowing employees to work from home or other remote locations.
              Telepresence robots are also becoming increasingly popular in
              healthcare as they can provide patients with remote access to
              doctors and nurses. Telepresence robots will likely play an even
              more significant role in the workplace and healthcare industry.
            </p>
            <input type="checkbox" id="read7" className="reveal-toggler" />
            <label for="read7" className="reveal-btn">READ MORE</label>
          </div>
          <div className="col-md-6 image-deck">
            <div className="img animate hook4">
              <img src={require("../../assets/Picture13.png")} alt="" />
            </div>
            <div className="img animate hook4">
              <img src={require("../../assets/Picture14.png")} alt="" />
            </div>
            <div className="img animate hook4">
              <img src={require("../../assets/Picture15.png")} alt="" />
            </div>
            <div className="img animate hook4">
              <img src={require("../../assets/Picture16.png")} alt="" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 image-deck">
            <div className="img animate hook4">
              <img src={require("../../assets/Picture17.png")} alt="" />
            </div>
            <div className="img animate hook4">
              <img src={require("../../assets/Picture18.png")} alt="" />
            </div>
            <div className="img animate hook4">
              <img src={require("../../assets/Picture19.png")} alt="" />
            </div>
            <div className="img animate hook4">
              <img src={require("../../assets/Picture20.png")} alt="" />
            </div>
          </div>
          <div className="col-md-6 animate hook2">
            <h4>Service robots</h4>
            <p className="visible-text">
              Service robots are becoming increasingly popular in various
              settings, from hospitals and schools to offices and factories. At
              our company, we specialize in creating customized service robots
              designed to meet our client's specific needs. For example, we have
              created robots that can assist patients in hospitals, deliver
              items to classNamerooms, and even help with factory tasks ...
            </p>
            <p className="hidden-text">
              Service robots are becoming increasingly popular in various
              settings, from hospitals and schools to offices and factories. At
              our company, we specialize in creating customized service robots
              designed to meet our client's specific needs. For example, we have
              created robots that can assist patients in hospitals, deliver
              items to classNamerooms, and even help with factory tasks.
              <br /><br />
              Each service robot is equipped with a range of sensors and cameras
              that allow it to navigate its environment and complete its tasks
              efficiently. In addition, our service robots can communicate with
              humans, providing necessary instructions and information. As the
              demand for service robots continues to grow, we are proud to be at
              the forefront of this rapidly evolving industry.
            </p>
            <input type="checkbox" id="read8" className="reveal-toggler" />
            <label for="read8" className="reveal-btn">READ MORE</label>
          </div>
        </div>
      </div>
    </div>
    <div className="container-fluid news">
      <div className="container">
        <h2>OUR ROBOT PETS</h2>
        <div className="row row-cols-lg-4 row-cols-md-2 row-cols-1">
          <div  data-tilt data-tilt-glare data-tilt-max-glare="0.3"  className="col">

            <div  className="card animate hook3">
              <img src={require("../../assets/image.png")} alt="" />
              <h4>Unitree Z1 and Go1</h4>
              <p>
                Unitree has launched the robotic arm Z1, which it mounted on its
                AlienGo or B1 robot, and works with actuator tools such as a
                dual-suction-cup attachment, two-fingered pincer, a
                three-fingered soft grasper, that allow it to do things like
                picking up objects, opening doors, and installing or removing
                screw
              </p>
            </div>
          </div>
          <div data-tilt data-tilt-glare data-tilt-max-glare="0.3" className="col">
            <div  className="card animate hook3">
              <img src={require("../../assets/image (1).png")} alt="" />
              <h4>Unitree Go 1</h4>
              <p>
                Dustproof and waterproof Robot dog that can inspect in all kinds
                of weather. It function as a pet, or work in firefighting and
                investigation. Unitree Go1 is able to run at 4.7m/s.
              </p>
            </div>
          </div>
          <div data-tilt data-tilt-glare data-tilt-max-glare="0.3" className="col">
            <div className="card animate hook3">
              <img src={require("../../assets//image (2).png")} alt="" />
              <h4>Xiaomi Cyberdog By Xiaomi</h4>
              <p>
                A robotic pet for everyone. CyberDog can be personally
                customized. Xiaomi Cyberdog can run at a speed of 11.52 km / h.
                It can jump and do backflips.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

        </div>
    );
};

export default PageHome;
