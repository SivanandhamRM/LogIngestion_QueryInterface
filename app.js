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
}

function changePage(newPage, totalPages) {
  getSearchResultsByOffset(newPage, 10);
}

function generatePagination(totalPages, currentPage) {
  const paginationContainer = document.getElementById("pagination_control");
  paginationContainer.innerHTML = ""; // Clear existing pagination

  // Add "Previous" button
  if (currentPage === 1) {
    paginationContainer.innerHTML += `<li class="page-item disabled"><a class="page-link" href="#" onclick="changePage(${
      currentPage - 1
    }, ${totalPages})" style="background-color: #610c9f; color: #fff;">Previous</a></li>`;
  } else {
    paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${
      currentPage - 1
    }, ${totalPages})" style="background-color: #610c9f; color: #fff;">Previous</a></li>`;
  }

  // Show the first three pages
  for (let page = 1; page <= Math.min(3, totalPages); page++) {
    paginationContainer.innerHTML += `<li class="page-item ${
      page === currentPage ? "active" : ""
    }"><a class="page-link" href="#" onclick="changePage(${page}, ${totalPages})" style="background-color: #610c9f; color: #fff;">${page}</a></li>`;
  }

  // Show ellipsis if there are more than three pages
  if (totalPages > 3) {
    paginationContainer.innerHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
  }

  // Show the current page
  if (currentPage > 3 && currentPage < Math.max(totalPages - 2, 2)) {
    paginationContainer.innerHTML += `<li class="page-item active"><span class="page-link" style="background-color: #610c9f; color: #fff;">${currentPage}</span></li>`;
    // Show ellipsis if there are more than three pages
    if (totalPages > 3) {
      paginationContainer.innerHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }

  // Show the last three pages
  for (let page = Math.max(totalPages - 2, 2); page <= totalPages; page++) {
    paginationContainer.innerHTML += `<li class="page-item ${
      page === currentPage ? "active" : ""
    }"><a class="page-link" href="#" onclick="changePage(${page}, ${totalPages})" style="background-color: #610c9f; color: #fff;">${page}</a></li>`;
  }

  // Add "Next" button
  if (currentPage === totalPages) {
    paginationContainer.innerHTML += `<li class="page-item disabled"><a class="page-link" href="#" onclick="changePage(${
      currentPage + 1
    }, ${totalPages})" style="background-color: #610c9f; color: #fff;">Next</a></li>`;
  } else {
    paginationContainer.innerHTML += `<li class="page-item" ><a class="page-link" href="#" onclick="changePage(${
      currentPage + 1
    }, ${totalPages})" style="background-color: #610c9f; color: #fff;">Next</a></li>`;
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
      const tableBody = document.getElementById("log_table_body");
      const errorMessage = document.getElementById("error_message");
      const paginationContainer = document.getElementById("pagination_control");
      const pageLimitSelect = document.getElementById("page-limit");

      if (data.results.length === 0) {
        errorMessage.textContent =
          "No records found for the selected filter(s).";
        tableBody.innerHTML = "";
        paginationContainer.style.display = "none";
        pageLimitSelect.disabled = true;
      } else {
        errorMessage.textContent = "";
        displayDataInTable(data.results);
        generatePagination(Math.ceil(data.count / limit), offset);
        var selectElement = document.getElementById("page-limit");
        selectElement.style.display = "block";
        pageLimitSelect.disabled = false;
      }
    })
    .catch((error) => {
      alert(error);
    });
}

function removeFilters(event) {
  event.preventDefault();
  const filterInputs = document.querySelectorAll(".form-control");
  filterInputs.forEach((input) => {
    input.value = ""; // Clear all filter inputs
  });

  // Clear table body and hide pagination
  const tableBody = document.getElementById("log_table_body");
  const paginationContainer = document.getElementById("pagination_control");
  const errorMessage = document.getElementById("error_message");

  tableBody.innerHTML = ""; // Clear the table body
  paginationContainer.style.display = "none"; // Hide pagination
  errorMessage.textContent =
    "Select filter(s) and Click Search to view data records."; // Show initial message
}
