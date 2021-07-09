const isHomeUrl = (url) => url.slice(-4) === "home";
const isComposeUrl = (url) => url.slice(-13) === "compose/tweet";
const timeOut = 2;

const homeTweetSelector =
  "#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div.css-1dbjc4n.r-kemksi.r-184en5c > div > div.css-1dbjc4n.r-kemksi.r-oyd9sg > div:nth-child(1) > div > div > div > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t > div:nth-child(3) > div > div > div:nth-child(2) > div";
const composeTweetSelector =
  "#layers > div:nth-child(2) > div > div > div > div > div > div.css-1dbjc4n.r-1habvwh.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-1867qdf.r-1wbh5a2.r-rsyp9y.r-1pjcn9w.r-htvplk.r-1udh08x.r-1potc6q > div > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1jgb5lz.r-1ye8kvj.r-13qz1uu > div > div > div > div:nth-child(1) > div > div > div > div > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t > div:nth-child(3) > div > div > div:nth-child(2) > div";
const tweetInputSelector =
  "#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-kemksi.r-1kqtdi0.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > div.css-1dbjc4n.r-kemksi.r-184en5c > div > div.css-1dbjc4n.r-kemksi.r-oyd9sg > div:nth-child(1) > div > div > div > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t > div.css-1dbjc4n.r-184en5c > div > div > div > div > div > div > div > div > label > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2 > div > div > div > div > div > div > div > div > div > span > span";

const elementReady = (selector) => {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) {
      resolve(el);
    }
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach((element) => {
        resolve(element);
        //Once we have resolved we don't need the observer anymore.
        observer.disconnect();
      });
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
};

const getInputSpanElement = () =>
  document.querySelector(
    "#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div.css-1dbjc4n.r-kemksi.r-184en5c > div > div.css-1dbjc4n.r-kemksi.r-oyd9sg > div:nth-child(1) > div > div > div > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t > div.css-1dbjc4n.r-184en5c > div > div > div > div > div > div > div > div > label > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2 > div > div > div > div > div > div > div > div > div > span > span"
  );

const createCloneElem = (element) => {
  let newClonedElem = element.cloneNode(true);
  newClonedElem.id = "clone";
  newClonedElem.style.opacity = 1;
  return newClonedElem;
};

const handle = (element, selector) => {
  let newClonedElem = createCloneElem(element);
  let spanElement = newClonedElem.children[0].children[0].children[0];

  element.style.display = "none";

  const firstClickHandler = () => {
    const cancelClickHandler = () => {
      spanElement.innerText = "Cancelled!";
      newClonedElem.style.backgroundColor = "red";
      clearInterval(interval);
      setTimeout(() => {
        newClonedElem.style.backgroundColor = originalBackgroundColor;
        spanElement.innerText = originalButtonText;
        newClonedElem.addEventListener("click", firstClickHandler, {
          once: true,
        });
      }, 500);
    };
    newClonedElem.addEventListener("click", cancelClickHandler, { once: true });

    const originalButtonText = spanElement.innerText;
    const originalBackgroundColor = newClonedElem.style.backgroundColor;

    let secondsLeft = timeOut;

    spanElement.innerText = `${secondsLeft.toString()}s (Click to cancel)`;
    secondsLeft = secondsLeft - 1;

    const interval = setInterval(() => {
      spanElement.innerText = `${secondsLeft.toString()}s (Click to cancel)`;
      secondsLeft = secondsLeft - 1;
      if (secondsLeft === -1) {
        clearInterval(interval);
        element.click();
        setTimeout(() => {
          elementReady(selector).then((el) => handle(el, selector));
        }, 1000);
      }
    }, 1000);
  };
  newClonedElem.addEventListener("click", firstClickHandler, { once: true });

  element.parentNode.appendChild(newClonedElem, element);
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.message == "toggleOnOff") {
    console.log("New Value onOff = ", request.value);
  }
  if (request.message == "changeSeconds") {
    console.log("New Value seconds = ", request.value);
  }
  if (request.message === "TabUpdated") {
    if (isHomeUrl(request.url))
      return elementReady(homeTweetSelector).then((el) => {
        return handle(el, homeTweetSelector);
      });
    if (isComposeUrl(request.url))
      return elementReady(composeTweetSelector).then((el) => {
        return handle(el, composeTweetSelector);
      });
  }
});
