/////////////////////// Excel //////////////////////

document.getElementById('excelFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(reader.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonContent = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        let table = '<table border="1">';
        jsonContent.forEach(row => {
            table += '<tr>';
            row.forEach(cell => {
                table += `<td>${cell}</td>`;
            });
            table += '</tr>';
        });
        table += '</table>';

        document.getElementById('excelContent').innerHTML = table;
    };
    reader.readAsArrayBuffer(file);
});


//////////// PDF ////////

document.getElementById('pdfFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const typedArray = new Uint8Array(reader.result);
        pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
            // Fetch the first page
            pdf.getPage(1).then(function(page) {
                const scale = 1.5;
                const viewport = page.getViewport({ scale: scale });

                // Set canvas size to match the PDF size
                const canvas = document.getElementById('pdfViewer');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render the PDF page into the canvas
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);
            });
        });
    };
    reader.readAsArrayBuffer(file);
});
