(() => {
  const slideshow = {
    items: [],
    stopSlideshow: 0,
    sildeshowDelay: 3000,
    startSlideshow: function () {
      //check for the slideshow container div
      if (document.querySelector(".slideshow")) {
        //create the content div - one with show names etc
        let contentDiv = document.createElement("div");
        contentDiv.className = "content";
        document.querySelector(".slideshow").appendChild(contentDiv);

        //here we can add another div for other separate content

        //load the Css file for the slideshow
        let slideshowStyleLink = document.createElement("link");
        slideshowStyleLink.rel = "stylesheet";
        slideshowStyleLink.href = "test_slideshow.css";
        document.head.appendChild(slideshowStyleLink);

        //get the slideshow content
        let url = "./slideshow.json";
        fetch(url)
          .then(response => {
            return response.json();
          })
          .then(slideshow.loadContents)
          .catch(err => {
            console.log("ERROR", err);
          });
      }
    },
    loadContents: function (slideshowContentData) {
      let docFragement = new DocumentFragment();

      slideshowContentData.items.forEach((item, idx) => {
        //add each item to the slideshow div
        let div = slideshow.createItem(item, idx);
        docFragement.appendChild(div);
      });

      //add the slideshow items to the page
      document.querySelector(".slideshow .content").appendChild(docFragement);

      //make the first one current
      document.querySelector(".slideshow-item").classList.add("current");

      //save the array of items
      slideshow.items = document.querySelectorAll(".slideshow-item");

      //start the slideshow moving
      slideshow.start();
    },
    createItem: function (item, index) {
      //container - item
      let div = document.createElement("div");

      div.classList.add("slideshow-item");

      div.setAttribute("data-index", index);

      //Item content Container
      //elements inside
      //channel container - type and name
      let channelContainer = document.createElement("div");
      let channelType = document.createElement("p");
      let channelName = document.createElement("p");

      channelType.id = "channel-type-color";

      channelType.textContent = item.channelType;
      channelName.textContent = item.channelName;

      channelContainer.appendChild(channelType);
      channelContainer.appendChild(channelName);

      //show container - show name ans show caption
      let showContainer = document.createElement("div");
      let showName = document.createElement("h2");
      let showCaption = document.createElement("h1");

      showName.textContent = item.showName;
      showCaption.textContent = item.showCaption;

      showContainer.appendChild(showName);
      showContainer.appendChild(showCaption);

      //Show Controls - Depends on channel type
      let showControlsContainer = document.createElement("div");

      var output = '';

      item.showControls.forEach(itemData => {
        let itemData1 = document.createElement("p");
        itemData1.classList.add("itemData");
        itemData1.innerHTML = itemData;

        //output.innerHTML = itemData;

        showControlsContainer.appendChild(itemData1);
      });

      channelContainer.classList.add("channel-container");
      showContainer.classList.add("show-container");
      showControlsContainer.classList.add("show-control-container");

      div.appendChild(channelContainer);
      div.appendChild(showContainer);
      div.appendChild(showControlsContainer);

      return div;
    },

    switchItem: function (index, ev) {
      if (ev) {
        ev.preventDefault();
      }

      let current = document.querySelector(".current");
      current.classList.remove(".current");
      current.classList.add("leaving");

      setTimeout(() => {
        current.classList.remove("leaving");
      }, 800);

      slideshow.items[index].classList.add("current");
    },

    start: function () {
      slideshow.stopSlideshow = setInterval(() => {
        let [first, ...rest] = slideshow.items;
        slideshow.items = [...rest, first];
        slideshow.switchItem(0);
      }, slideshow.sildeshowDelay);
    }
  };

  document.addEventListener("DOMContentLoaded", slideshow.startSlideshow);
})();