function generatePDF(table) {
    const printWindow = window.open('', '_blank');
            printWindow.document.open();
            printWindow.document.write(`
            <html>
                <head>
                <title>Account Statement</title>
                <style>
                    .ownAccDetails {
                        color: black;
                        border: none;
                        background-color: inherit;
                        padding: 14px 28px;
                        font-size: 16px;
                        cursor: pointer;
                        display: inline-block;
                    }
                    body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    }
                    table {
                    border-collapse: collapse;
                    width: 100%;
                    }
                    th, td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    }
                    th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                    }
                </style>
                </head>
                <body>
                ${table.outerHTML}
                </body>
            </html>
            `);
            printWindow.document.close();

            printWindow.print();
        
  }

document.getElementById('pdfDownload').addEventListener('click', function() {
    // console.log("Working")
    const table = document.getElementById('123456');
    
    if (table) {
      generatePDF(table);
    }
  });

function downloadCSV(csvContent, fileName) {
    const link = document.createElement('a');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }          

function convertToCSV(table) {
    const rows = table.querySelectorAll('tr');
    const csv = [];
    
    for (const row of rows) {
      const rowData = [];
      const columns = row.querySelectorAll('td, th');
      
      for (const column of columns) {
        rowData.push(column.innerText);
      }
      
      csv.push(rowData.join(','));
    }
    
    return csv.join('\n');
  }


document.getElementById('downloadBtn').addEventListener('click', function() {
    const table = document.getElementById('123456');             
    if (table) {
      const csvContent = convertToCSV(table);
      downloadCSV(csvContent, 'AccountStatement.csv');
    }
  });