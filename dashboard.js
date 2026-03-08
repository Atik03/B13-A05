const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const API_SINGLE = "https://phi-lab-server.vercel.app/api/v1/lab/issue/";

let allIssues = [];

// Spinner Function
const loadSpinner = (status) => {
  const spinner = document.getElementById("spinnerId");
  const container = document.getElementById("issuesContainer");

  if (status) {
    spinner.classList.remove("hidden");
    container.classList.add("hidden");
  } else {
    spinner.classList.add("hidden");
    container.classList.remove("hidden");
  }
};

async function loadIssues() {
  loadSpinner(true);
  const res = await fetch(API);
  const data = await res.json();

  allIssues = data.data;

  displayIssues(allIssues);

  const issueCountElement = document.querySelector(".issuCount");
  issueCountElement.innerText = allIssues.length + " Issues";
}

// Display Cards
function displayIssues(issues) {
  const container = document.getElementById("issuesContainer");

  container.innerHTML = "";

  issues.forEach((issue) => {
    const borderColor =
      issue.status === "open" ? "border-green-500" : "border-purple-500";

    const card = document.createElement("div");

    card.className = `card bg-white border-t-4 ${borderColor} shadow`;

    card.innerHTML = `

<div class="card-body">

<div class="flex justify-between">

<span class="">

${issue.status === "open" ? `<img src="./assets/Open-Status.png" alt="Open">` : '<img src="./assets/Closed-Status.png" alt="Closed">'}

</span>

${
  issue.priority === "high"
    ? `<span class="badge badge-error">${issue.priority}</span>`
    : issue.priority === "medium"
      ? `<span class="badge badge-warning">${issue.priority}</span>`
      : `<span class="badge badge-secondary">${issue.priority}</span>`
}

</div>


<h2
class="font-semibold mt-2 cursor-pointer"

${issue.title}

</h2>


<p class="text-sm text-gray-500">

${issue.description}

</p>


<div class="flex gap-2 mt-2">



${
  issue.labels.length == 1
    ? `<span class="badge badge-outline badge-success">${issue.labels[0]}</span>`
    : `   <span class="badge badge-outline badge-error">

${issue.labels[0]}

</span>


${
  issue.labels[1]
    ? `<span class="badge badge-outline badge-warning">

${issue.labels[1]}</span>`
    : ""
} `
}

</div>


<p class="text-xs text-gray-400 mt-3">

#${issue.id} by ${issue.author}

<br>

${issue.createdAt}

</p>

</div>

`;

    // Modal Click
    card.addEventListener("click", async () => {
      try {
        const res = await fetch(`${API_SINGLE}${issue.id}`);
        const data = await res.json();

        const detail = data.data;

        const existingModal = document.getElementById("dynamic-issue-modal");

        if (existingModal) existingModal.remove();

        const modalDiv = document.createElement("div");

        modalDiv.id = "dynamic-issue-modal";

        modalDiv.innerHTML = `
        <input type="checkbox" id="issue-modal" class="modal-toggle" checked />

        <div class="modal">

          <div class="modal-box">

            <h3 class="text-xl font-bold">
              ${detail.title || "N/A"}
            </h3>

            <br>

            <div>

              ${
                !detail.status
                  ? `N/A`
                  : detail.status === "open"
                    ? `
                    <span class="badge bg-green-500 text-white">${detail.status}</span>
                    <span class="ml-2">Opened By ${detail.assignee || "N/A"}</span>
                    <span class="ml-2 text-gray-500 text-xs">${detail.updatedAt || ""}</span>
                  `
                    : `
                    <span class="badge bg-blue-500 text-white">${detail.status}</span>
                    <span class="ml-2">Closed By ${detail.assignee || "N/A"}</span>
                    <span class="ml-2 text-gray-500 text-xs">${detail.updatedAt || ""}</span>
                  `
              }

            </div>

            <p class="py-4 text-gray-600">
              ${detail.description || "No description"}
            </p>

            <div class="flex gap-2 mb-4">
              ${
                detail.labels && detail.labels.length
                  ? detail.labels
                      .map(
                        (l) =>
                          `<span class="badge badge-outline badge-error">${l}</span>`,
                      )
                      .join("")
                  : ""
              }
            </div>

            <hr class="opacity-10" />

            <div class="mt-4 flex justify-between text-sm bg-gray-100 p-3 rounded">

              <div>
                <p class="font-medium text-gray-500">Assignee:</p>

                <div class="flex items-center gap-2 mt-1">

                  <div class="avatar placeholder bg-neutral text-neutral-content rounded-full w-6">
                    <span>${detail.assignee ? detail.assignee[0] : "N"}</span>
                  </div>

                  <span class="font-bold">
                    ${detail.assignee || "N/A"}
                  </span>

                </div>

              </div>

              <div class="text-right">
                <p class="font-medium text-gray-500">Priority:</p>
                <span class="text-error font-bold uppercase">
                  ${detail.priority || "N/A"}
                </span>
              </div>

            </div>

            <div class="modal-action">
              <label for="issue-modal" class="btn btn-primary btn-sm text-white">
                Close
              </label>
            </div>

          </div>

        </div>
        `;

        document.body.appendChild(modalDiv);
      } catch (error) {
        console.error("Error fetching single issue:", error);
      }
    });

    container.appendChild(card);
  });

  loadSpinner(false);
}

// Active Tab
function setActive(btn) {
  document.querySelectorAll(".btnColor").forEach((b) => {
    b.classList.remove("btn-primary");

    b.classList.add("btn-outline");
  });

  btn.classList.remove("btn-outline");
  btn.classList.add("btn-primary");
}

function setActiveColor(btn) {
  if (btn == false) {
    document.querySelectorAll(".btnColor").forEach((b) => {
      b.classList.remove("btn-primary");

      b.classList.add("btn-outline");
    });
  }
}

document.getElementById("allBtn").onclick = function () {
  setActive(this);
  loadSpinner(true);

  const issueCountElement = document.querySelector(".issuCount");
  issueCountElement.innerText = allIssues.length + " Issues";

  displayIssues(allIssues);
};

document.getElementById("openBtn").onclick = function () {
  setActive(this);
  loadSpinner(true);

  const openIssues = allIssues.filter((issue) => issue.status === "open");

  const issueCountElement = document.querySelector(".issuCount");
  issueCountElement.innerText = openIssues.length + " Issues";

  displayIssues(openIssues);
};

document.getElementById("closedBtn").onclick = function () {
  setActive(this);
  loadSpinner(true);

  const closedIssues = allIssues.filter((issue) => issue.status === "closed");

  const issueCountElement = document.querySelector(".issuCount");
  issueCountElement.innerText = closedIssues.length + " Issues";

  displayIssues(closedIssues);
};

loadIssues();

// search functionality
document.getElementById("btnSearch").addEventListener("click", () => {
  const inputValue = document.getElementById("inputSearch");
  const searchValue = inputValue.value.trim().toLowerCase();

  if (searchValue === "") {
    alert("Please enter something to search");
    return;
  }

  setActiveColor(false);

  loadSpinner(true);

  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      const issues = data.data;

      const filteredIssues = issues.filter((issue) => {
        const searchStr = searchValue.toLowerCase();

        return Object.values(issue).some((val) => {
          if (Array.isArray(val)) {
            return val.join(" ").toLowerCase().includes(searchStr);
          } else if (typeof val === "string") {
            return val.toLowerCase().includes(searchStr);
          } else {
            return false;
          }
        });
      });

      const issueCountElement = document.querySelector(".issuCount");
      issueCountElement.innerText = filteredIssues.length + " Issues";

      if (filteredIssues.length === 0) {
        const container = document.getElementById("noDataContainer");
        container.classList.remove("hidden");
        container.innerHTML = `
          <div class="w-full h-[300px] flex justify-center items-center">
            <div class="w-full h-40 flex justify-center items-center">
              <h1 class="text-xl font-bold text-gray-600 text-center">
                No issue found with this keyword!
              </h1>
            </div>
          </div>
        `;
      } else {
        const container = document.getElementById("noDataContainer");
        container.classList.add("hidden");
      }

      displayIssues(filteredIssues);
    });
  inputValue.value = "";
});
