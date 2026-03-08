const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

let allIssues = [];

async function loadIssues() {
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

    container.appendChild(card);
  });
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

document.getElementById("allBtn").onclick = function () {
  setActive(this);

  const issueCountElement = document.querySelector(".issuCount");
  issueCountElement.innerText = allIssues.length + " Issues";

  displayIssues(allIssues);
};

document.getElementById("openBtn").onclick = function () {
  setActive(this);

  const openIssues = allIssues.filter((issue) => issue.status === "open");

  const issueCountElement = document.querySelector(".issuCount");
  issueCountElement.innerText = openIssues.length + " Issues";

  displayIssues(openIssues);
};

document.getElementById("closedBtn").onclick = function () {
  setActive(this);

  const closedIssues = allIssues.filter((issue) => issue.status === "closed");

  const issueCountElement = document.querySelector(".issuCount");
  issueCountElement.innerText = closedIssues.length + " Issues";

  displayIssues(closedIssues);
};

loadIssues();
