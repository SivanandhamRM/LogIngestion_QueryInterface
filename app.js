function displayLogs(logs) {
    const logTableBody = document.getElementById('logTableBody');
  
    // Clear existing rows
    logTableBody.innerHTML = '';
  
    // Populate the table with log entries
    logs.forEach(log => {
      const row = logTableBody.insertRow();
      Object.values(log).forEach(value => {
        const cell = row.insertCell();
        cell.textContent = value;
      });
    });
  }


  