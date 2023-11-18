function displayDataInTable(data) {
  const tableBody = document.getElementById("log_table_body");

  // Clear existing table rows
  tableBody.innerHTML = "";

  // Loop through the data and create table rows
  data.forEach((item) => {
    const row = tableBody.insertRow();

    // Assuming the structure is fixed, you can access elements directly
    let i = 1;
    for (i = 1; i < item.length - 1; i++) {
      const cell = row.insertCell(i - 1);
      cell.textContent = item[i];
    }

    // If the last element is an object, you can access its properties
    const lastElement = item[item.length - 1];

    if (typeof lastElement === "object" && lastElement !== null) {
      const cell = row.insertCell(i - 1);
      // console.log(cell)
      cell.textContent = lastElement.parentResourceId || ""; // Adjust property name as needed
    }
  });
  console.log(data.length);
}

function changelimit(event) {
  event.preventDefault();
  getSearchResultsByOffset(1, event.target.value);
  // const pagelimit = document.getElementById("page-limit");
  // pagelimit.innerHTML = ""; // Clear existing pagination
  // pagelimit.innerHTML = `        <select id="page-limit" onchange="changelimit(event)">
  // <option value="10">10</option>
  // <option value="50">50</option>
  // <option value="100">100</option></select>`;
}

function changePage(newPage, totalPages) {
  // Replace this with your logic to load and display content based on the selected page
  // const contentContainer = document.getElementById("pagination_control");
  // contentContainer.innerHTML = `<p>Content for Page ${newPage}</p>`;
  getSearchResultsByOffset(newPage, 10);
}

function generatePagination(totalPages, currentPage) {
  const paginationContainer = document.getElementById("pagination_control");
  paginationContainer.innerHTML = ""; // Clear existing pagination

  // Add "Previous" button
  if (currentPage === 1) {
    paginationContainer.innerHTML += `<li class="page-item disabled"><a class="page-link" href="#" onclick="changePage(${
      currentPage - 1
    }, ${totalPages})">Previous</a></li>`;
  } else {
    paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${
      currentPage - 1
    }, ${totalPages})">Previous</a></li>`;
  }

  // Show the first three pages
  for (let page = 1; page <= Math.min(3, totalPages); page++) {
    paginationContainer.innerHTML += `<li class="page-item ${
      page === currentPage ? "active" : ""
    }"><a class="page-link" href="#" onclick="changePage(${page}, ${totalPages})">${page}</a></li>`;
  }

  // Show ellipsis if there are more than three pages
  if (totalPages > 3) {
    paginationContainer.innerHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
  }

  // Show the current page
  if (currentPage > 3 && currentPage < Math.max(totalPages - 2, 1)) {
    paginationContainer.innerHTML += `<li class="page-item active"><span class="page-link">${currentPage}</span></li>`;
    // Show ellipsis if there are more than three pages
    if (totalPages > 3) {
      paginationContainer.innerHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }

  // Show the last three pages
  for (let page = Math.max(totalPages - 2, 1); page <= totalPages; page++) {
    paginationContainer.innerHTML += `<li class="page-item ${
      page === currentPage ? "active" : ""
    }"><a class="page-link" href="#" onclick="changePage(${page}, ${totalPages})">${page}</a></li>`;
  }

  // Add "Next" button
  if (currentPage === totalPages) {
    paginationContainer.innerHTML += `<li class="page-item disabled"><a class="page-link" href="#" onclick="changePage(${
      currentPage + 1
    }, ${totalPages})">Next</a></li>`;
  } else {
    paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${
      currentPage + 1
    }, ${totalPages})">Next</a></li>`;
  }
}

function getSearchResults(event) {
  event.preventDefault();
  getSearchResultsByOffset(1, 10);
}

function getSearchResultsByOffset(offset, limit) {
  const level = document.getElementById("level")?.value;
  const message = document.getElementById("message")?.value;
  const resource_id = document.getElementById("resource_id")?.value;
  const start_date = document.getElementById("start_date")?.value;
  const end_date = document.getElementById("end_date")?.value;
  const trace_id = document.getElementById("trace_id")?.value;
  const span_id = document.getElementById("span_id")?.value;
  const commit = document.getElementById("commit")?.value;
  const metadata = document.getElementById("metadata")?.value;

  // alert(level)

  const data = {
    level: level,
    message: message,
    resource_id: resource_id,
    start_date: start_date,
    end_date: end_date,
    trace_id: trace_id,
    span_id: span_id,
    commit: commit,
    metadata: metadata,
    offset: offset - 1,
    limit: limit,
  };

  // Make a POST request using the fetch API
  fetch("http://localhost:3000/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      const temp = await response.json();
      if (!response.ok) {
        throw Error(temp.error);
      }
      return temp;
    })
    .then((data) => {
      // Handle the response from the server
      //   console.log("Response from server:", data);
      displayDataInTable(data.results);
      generatePagination(Math.ceil(data.count / limit), offset);
    })
    .catch((error) => {
      alert(error);
    });
}
