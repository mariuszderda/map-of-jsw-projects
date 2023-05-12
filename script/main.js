document.addEventListener("DOMContentLoaded", function () {
  const centerMap = [50.10134353379086, 18.672674953470707];

  const map = L.map("map").setView(centerMap, 11);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  const jswIcon = L.icon({
    iconUrl: "assets/map-pin.svg",
    shadowUrl: "assets/map-pin-shadow.svg",

    iconSize: [38, 95], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
  });

  const popupContent = (name) => {
    const content = document.createElement("div");

    content.classList.add("property");
    content.innerHTML = `
    <div class="icon">
        <div class="fa-building">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="434.000000pt" height="434.000000pt" viewBox="0 0 434.000000 434.000000" preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,434.000000) scale(0.100000,-0.100000)" fill="#fff" stroke="none">
        <path d="M2879 4193 c-155 -110 -277 -211 -408 -338 -339 -329 -551 -695 -639 -1104 -25 -117 -27 -143 -26 -356 0 -136 4 -240 11 -255 9 -22 11 -18 17 35 57 459 277 854 661 1184 126 108 197 161 291 215 97 55 126 82 143 133 8 23 16 125 21 253 5 157 11 226 23 258 9 23 13 42 8 42 -4 0 -50 -30 -102 -67z"/>
        <path d="M1402 3923 c-120 -249 -178 -416 -227 -658 -35 -175 -49 -337 -42 -510 16 -390 123 -720 342 -1050 74 -112 257 -335 275 -335 6 0 -12 44 -39 98 -101 201 -183 460 -213 671 -16 110 -15 372 1 476 35 223 113 448 219 625 86 144 106 196 100 255 -8 67 -65 176 -160 305 -99 134 -132 189 -149 248 -7 23 -15 42 -19 42 -3 0 -43 -75 -88 -167z"/>
        <path d="M3700 3643 c-204 -35 -515 -163 -754 -311 -220 -136 -457 -341 -574 -497 -60 -80 -139 -233 -148 -285 l-5 -35 43 50 c238 276 487 459 778 570 100 39 192 60 347 80 116 14 190 40 231 78 13 12 46 66 74 119 33 64 71 121 115 168 l65 70 -74 -1 c-40 -1 -84 -4 -98 -6z"/>
        <path d="M3235 3015 c-89 -14 -240 -51 -264 -65 -10 -6 33 -10 119 -10 221 0 397 -38 540 -117 78 -42 124 -77 207 -155 57 -54 65 -58 109 -58 26 0 82 12 125 26 65 22 93 25 159 22 44 -2 80 0 80 3 0 11 -103 104 -170 153 -131 97 -316 172 -490 201 -112 18 -303 18 -415 0z"/>
        <path d="M5 2384 c22 -122 118 -372 215 -564 137 -269 307 -500 534 -725 444 -440 996 -725 1621 -836 116 -21 161 -24 410 -24 203 0 286 3 300 12 18 11 17 12 -17 13 -78 0 -278 42 -406 85 -363 121 -685 327 -993 634 -258 259 -366 418 -538 793 -175 382 -158 369 -566 442 -228 41 -385 95 -524 182 l-44 27 8 -39z"/>
    </g>
        </svg>
        </div>
        <span class="fa-sr-only">${name}</span>
    </div>
    <div class="details">
        <h2 class="minor" data-mine="${name}">${name}</h2>
    
    </div>
    `;
    return content;
  };

  const projectsOnMap = (projects) => {
    const programsInUnit = [];
    projects.forEach((el) => {
      const programsIndex = programsInUnit.findIndex((el) => el.programs);
      if (el.program) {
        if (programsIndex >= 0) {
          const programIndex = programsInUnit[programsIndex].programs.findIndex(
            (element) => element.name === el.program
          );
          programIndex >= 0
            ? programsInUnit[programsIndex].programs[
                programIndex
              ].projects.push({
                name: el.name,
              })
            : programsInUnit[programsIndex].programs.push({
                name: el.program,
                projects: [
                  {
                    name: el.name,
                  },
                ],
              });
        } else {
          programsInUnit.unshift({
            programs: [
              {
                name: el.program,
                projects: [
                  {
                    name: el.name,
                  },
                ],
              },
            ],
          });
        }
      } else {
        const projectsIndex = programsInUnit.findIndex((el) => el.projects);
        !!!programsInUnit[projectsIndex]
          ? programsInUnit.push({ projects: [{ name: el.name }] })
          : programsInUnit[projectsIndex].projects.push({ name: el.name });
      }
    });
    return programsInUnit;
  };

  const createHTMLElement = (
    elementHTML,
    innerHTMLElement = "",
    className = ""
  ) => {
    const element = document.createElement(elementHTML);
    if (className) {
      element.classList.add(className);
    }
    if (innerHTMLElement) {
      element.innerHTML = innerHTMLElement;
    }
    return element;
  };

  const createCloseCross = (container) => {
    const cross = document.createElement("div");
    cross.classList.add("cross");
    container.appendChild(cross);
    cross.addEventListener("click", () => {
      cross.parentNode.remove();
    });
  };
  const createProgramsListSidebar = (programName) => {
    const projectList = properties.reduce((acc, item) => {
      const filter = item.projects.filter((prj) => prj.program === programName);
      if (filter.length > 0) {
        return [
          ...acc,
          {
            mine: item.mine,
            projects: filter,
          },
        ];
      }
      return [...acc];
    }, []);
    for (const element of projectList) {
      const img = document.querySelector(`img[alt="${element.mine}"]`);
      img.setAttribute("src", "assets/map-pin-selected.svg");
    }

    const container = createHTMLElement("div", "", "programs__list__container");
    const titleHTML = createHTMLElement("h2", programName);
    container.appendChild(titleHTML);

    const programsList = createHTMLElement("ul", "", "program_list");

    for (const element of projectList) {
      console.log("elemrnt", element);
      // const mineName = createHTMLElement("h3", element.mine);
      // programsList.appendChild(mineName);
      const projectList = createHTMLElement("ul", "", "project__list");
      element.projects.forEach((el) => {
        const projectItem = createHTMLElement("li", el.name, "project__item");
        projectList.appendChild(projectItem);
      });
      programsList.appendChild(projectList);
    }

    container.appendChild(programsList);
    document.body.appendChild(container);
  };

  const removeProgramsListSidebar = () => {
    const imgNodeList = document.querySelectorAll("img.leaflet-marker-icon");
    imgNodeList.forEach((img) => img.setAttribute("src", "assets/map-pin.svg"));
    document.querySelector(".programs__list__container").remove();
  };

  const createMineSidebar = (name) => {
    console.time("sidebar");
    const programsRaw = properties.find((item) => item.mine === name);
    const programsSort = projectsOnMap(programsRaw.projects);

    const oldContainer = document.querySelector(".container");
    if (oldContainer) {
      oldContainer.remove();
    }

    const titleWithLogo = (name) => {
      return `
        <div class="title__container">
            <div class="logo">
              <svg class="logo" xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 434.000000 434.000000" preserveAspectRatio="xMidYMid meet">
                <metadata>
                    Created by potrace 1.14, written by Peter Selinger 2001-2017
                </metadata>
                <g transform="translate(0.000000,434.000000) scale(0.100000,-0.100000)" fill="#fff" stroke="none">
                    <path d="M2879 4193 c-155 -110 -277 -211 -408 -338 -339 -329 -551 -695 -639 -1104 -25 -117 -27 -143 -26 -356 0 -136 4 -240 11 -255 9 -22 11 -18 17 35 57 459 277 854 661 1184 126 108 197 161 291 215 97 55 126 82 143 133 8 23 16 125 21 253 5 157 11 226 23 258 9 23 13 42 8 42 -4 0 -50 -30 -102 -67z"/>
                    <path d="M1402 3923 c-120 -249 -178 -416 -227 -658 -35 -175 -49 -337 -42 -510 16 -390 123 -720 342 -1050 74 -112 257 -335 275 -335 6 0 -12 44 -39 98 -101 201 -183 460 -213 671 -16 110 -15 372 1 476 35 223 113 448 219 625 86 144 106 196 100 255 -8 67 -65 176 -160 305 -99 134 -132 189 -149 248 -7 23 -15 42 -19 42 -3 0 -43 -75 -88 -167z"/>
                    <path d="M3700 3643 c-204 -35 -515 -163 -754 -311 -220 -136 -457 -341 -574 -497 -60 -80 -139 -233 -148 -285 l-5 -35 43 50 c238 276 487 459 778 570 100 39 192 60 347 80 116 14 190 40 231 78 13 12 46 66 74 119 33 64 71 121 115 168 l65 70 -74 -1 c-40 -1 -84 -4 -98 -6z"/>
                    <path d="M3235 3015 c-89 -14 -240 -51 -264 -65 -10 -6 33 -10 119 -10 221 0 397 -38 540 -117 78 -42 124 -77 207 -155 57 -54 65 -58 109 -58 26 0 82 12 125 26 65 22 93 25 159 22 44 -2 80 0 80 3 0 11 -103 104 -170 153 -131 97 -316 172 -490 201 -112 18 -303 18 -415 0z"/>
                    <path d="M5 2384 c22 -122 118 -372 215 -564 137 -269 307 -500 534 -725 444 -440 996 -725 1621 -836 116 -21 161 -24 410 -24 203 0 286 3 300 12 18 11 17 12 -17 13 -78 0 -278 42 -406 85 -363 121 -685 327 -993 634 -258 259 -366 418 -538 793 -175 382 -158 369 -566 442 -228 41 -385 95 -524 182 l-44 27 8 -39z"/>
                </g>
              </svg>
            </div>
            <h2>${name}</h2>
        </div>    
`;
    };

    const titleHTML = createHTMLElement(
      "div",
      titleWithLogo(programsRaw.mine),
      ""
    );
    const container = createHTMLElement("div", "", "container");
    container.appendChild(titleHTML);

    programsSort.forEach((el) => {
      if (el.programs) {
        const title = createHTMLElement("h3", "Programy:", "");
        container.appendChild(title);
        const programList = createHTMLElement("ul", "", "program__list");

        el.programs.forEach((pr) => {
          const projectList = createHTMLElement("ul", "", "project__list");
          const programTitle = createHTMLElement(
            "h5",
            pr.name,
            "program__title"
          );
          const programItem = createHTMLElement("li", "", "program__item");

          programTitle.addEventListener(
            "mouseenter",
            createProgramsListSidebar.bind(null, pr.name)
          );
          programTitle.addEventListener(
            "mouseleave",
            removeProgramsListSidebar
          );

          programItem.appendChild(programList);
          programList.appendChild(programTitle);

          pr.projects.forEach((project) => {
            const projectItem = createHTMLElement(
              "li",
              project.name,
              "project__item"
            );
            projectList.appendChild(projectItem);
          });
          programList.appendChild(projectList);
        });
        container.appendChild(programList);
      } else if (el.projects) {
        const projectList = createHTMLElement("ul", "", "project__list");
        const title = createHTMLElement("h3", "Projekty:", "");
        container.appendChild(title);
        el.projects.forEach((project) => {
          const projectItem = createHTMLElement(
            "li",
            project.name,
            "project__item"
          );
          projectList.appendChild(projectItem);
        });
        container.appendChild(projectList);
      }
    });
    console.log(container);

    createCloseCross(container);

    document.body.appendChild(container);
    console.timeEnd("sidebar");
  };

  for (const element of properties) {
    const marker = L.marker([element.position.lat, element.position.lng], {
      icon: jswIcon,
      alt: element.mine,
    }).addTo(map);

    marker.setLatLng([element.position.lat, element.position.lng]);
    marker.bindPopup(popupContent(element.mine));

    marker.on("mouseover", function (e) {
      this._popup._content.classList.add("highlight");
      createMineSidebar(element.mine);
      this.openPopup();
    });

    // TODO close popup if mouse not enter on popup
    marker.on("mouseout", function (e) {
      this.closePopup();
    });
  }
});
