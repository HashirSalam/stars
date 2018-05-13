(function(window, document, undefined) {


  
    ctx = document.getElementById('canvas').getContext('2d');

    //FOR DRAWING STARS
    // image = document.getElementById('source');
    // image2 = document.getElementById('source2');
    // image3 = document.getElementById('source3');
    // Chart.pluginService.register({
    //     afterUpdate: function(chart) {
    //         for(i=0;i<myData.datasets.length;i++)
    //         {
    //         chart.config.data.datasets[i]._meta[0].data[0]._model.pointStyle = image;
    //         }
          
    //     }
    // });





    labels = '';
    datax = 0;
    datay = 0;
    datar = 0;
    val = 0;
    time = 0;
    color = '';
    myData = {
        datasets: [
            //   {
            //     label: 'Bubble 1',
            //     data: [
            //       {
            //         x: 3,
            //         y: 5,
            //         r: 10
            //       }
            //     ],
            //     backgroundColor:"blue",
            //     hoverBackgroundColor: "red"
            //   },
            //   {
            //      label: 'Bubble 2',
            //      data: [
            //        {
            //          x: 13,
            //          y: 25,
            //          r: 20
            //        }
            //      ],
            //      backgroundColor:"green",
            //      hoverBackgroundColor: "red"
            //    }
        ]
    };

    
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }



    $('#submit').on("click", function(e) {
        e.preventDefault();

        if(document.forms['frm'].upload.value === "")
        {
          alert("Please choose a file");
        }

        $('#files').parse({
            config: {
                delimiter: "auto",
                complete: buildTable,
            },
            before: function(file, inputElem) {
                // console.log("Parsing file...", file);
            },
            error: function(err, file) {
                // console.log("ERROR:", err, file);
            },
            complete: function() {
                //console.log("Done with all files");
            }
        });
    });


    function buildTable(results) {
        var markup = "<table class='table table-hover'>";
        var data = results.data;
        for (i = 0; i < data.length; i++) {
            markup += "<tr>";
            var row = data[i];
            var cells = row.join(",").split(",");

            for (j = 0; j < cells.length; j++) {
                markup += "<td>";
                markup += cells[j];
                labels = cells[0];
                datax = parseInt(cells[1]);
                datay = parseInt(cells[2]);
                color = getRandomColor(); //parseInt(cells[3]);
                val = parseInt(cells[4]);
                time = parseInt(cells[5]);
                ////////////////////////////////////////
                markup += "</th>";
            }
            markup += "</tr>";
            myObj = {    //my object data which is pushed in dataset one by one
                "label": cells[0],
                "data": [{
                    x: datax,
                    y: datay,
                    r: val
                }],
                backgroundColor: color,
                hoverBackgroundColor: "red",
                datatime : time,
                datatcolor : color
              
            };
            if (myObj.label != "id" && myObj.label != '' ) {   //Filtering the header and garbage data if any
                //console.log(myObj);
                // if (typeof myLiveChart == "undefined") {
                //     myData.datasets.push(myObj); //if no charts exists
                // }
                // else {
                //     myLiveChart.data.labels.pop();
                //     myLiveChart.data.datasets.forEach((dataset) => {
                //         dataset.data.pop();
                //     });
                // if(myData.datasets.length == 0)
                // {
                //     myData.datasets.push(myObj);
                // }
                // else
                // {
                //     for(i=0;i<myData.datasets.length;i++)
                //     {
                //         myData.datasets.pop();
                //     }
                    myData.datasets.push(myObj);
               // }
                // }      
            }
        }
        markup += "</table>";
        $("#table").html(markup);

        ////////////////////////////////////////////////////
         options = {
            type: 'bubble',
            data: myData,

        }
       
        console.log(myData);
        originalData = jQuery.extend(true,{},myData); //Hard Copy (backup data in original)
    
        if (typeof myLiveChart == "undefined") {
        
            myLiveChart = new Chart(ctx, options); //Draws the graph
            
            //void ctx.drawImage(image, dx, dy, dWidth, dHeight);
           

           
         }
         else
         {
            updateChart(myLiveChart);
         }
       


    }

    $('#changeColor').on("click", function(e) {
        e.preventDefault();

        if (document.forms['frm'].upload.value === "") {
            alert ("No Data Loaded. Import a CSV file first.");
            return false;
         }



        for(i=0;i<myData.datasets.length;i++)
        {
            myData.datasets[i].backgroundColor = getRandomColor();
        }
       
        updateChart(myLiveChart);

    });    

    $('#exportImg').on("click", function(e) {
        e.preventDefault();

        if (document.forms['frm'].upload.value === "") {
            alert ("No Data Loaded. Import a CSV file first.");
            return false;
         }
        // var canvas = document.getElementById("canvas");
        // var image = canvas.toDataURL("image/gif").replace("image/gif", "image/octet-stream");
        // window.location.href = image;

        var canvasElement = document.getElementById("canvas");

        var MIME_TYPE = "image/gif";
    
        var imgURL = canvasElement.toDataURL(MIME_TYPE);
    
        var dlLink = document.createElement('a');
        dlLink.download = "Output.gif";
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
    
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
        
     
    });

   

    $('#exportCSV').on("click", function(e) {
        e.preventDefault();
        if (document.forms['frm'].upload.value === "") {
            alert ("No Data Loaded. Import a CSV file first.");
            return false;
         }
        
        var exportdata = [];
        

        for(i=0;i<myData.datasets.length;i++)
        {
            var tuple = [];
            tuple.push(myData.datasets[i].label); 
            tuple.push(myData.datasets[i].data[0].x); 
            tuple.push(myData.datasets[i].data[0].y); 
            tuple.push(myData.datasets[i].data[0].r); 
            tuple.push(myData.datasets[i].datatcolor);
            tuple.push(myData.datasets[i].datatime); 
           
            exportdata.push(tuple);
            
        }
        

        console.log(exportdata);
        var csv = Papa.unparse({            
            fields: ["id","x","y","value","color","time",],
            data: exportdata
        });
  
        var fileTitle = "Output";
        var exportedFilenmae = fileTitle + '.csv' || 'Output.csv';
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, exportedFilenmae);
        } 
        else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFilenmae);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
 
     
    });



    //////////////////////////////////////Menu////////////////////////////////////////////////   
    function updateChart(chart) {
        // chart.data.labels.pop();
        // chart.data.datasets.forEach((dataset) => {
        //     dataset.data.pop();
        // });
        chart.update();
    }
   
    function deleteChart(chart) {
        chart.data.labels.pop();
        chart.data.datasets.forEach((dataset) => {
            dataset.data.pop();
        });
        chart.update();
    }


    // function addData(chart, label, data) {
    //     chart.data.labels.push(label);
    //     chart.data.datasets.forEach((dataset) => {
    //         dataset.data.push(data);
    //     });
    //     chart.update();
    // }
   
   
   
    $('#xsetx').on("click", function(e) {
        e.preventDefault();
        
        //removeData(myLiveChart);

        //addData(myLiveChart,"new",originalData.datasets);


        for(i=0;i<myData.datasets.length;i++)
        {
           myData.datasets[i].data[0].x = originalData.datasets[i].data[0].x;
           //myData.datasets[i].data[0].y = originalData.datasets[i].data[0].y;
           //myData.datasets[i].data[0].r = originalData.datasets[i].data[0].r;

        }
        updateChart(myLiveChart);
        //new Chart(ctx, options); //Draws the graph

     
    });

    $('#xsety').on("click", function(e) {
        e.preventDefault();

        if (document.forms['frm'].upload.value === "") {
            alert ("No Data Loaded. Import a CSV file first.");
            return false;
         }
        
        for(i=0;i<myData.datasets.length;i++)
        {
            myData.datasets[i].data[0].x =  originalData.datasets[i].data[0].y;

            
        }

        updateChart(myLiveChart);
        
  
        
     
    });

    $('#xsetv').on("click", function(e) {
        e.preventDefault();

        if (document.forms['frm'].upload.value === "") {
            alert ("No Data Loaded. Import a CSV file first.");
            return false;
         }
        
        for(i=0;i<myData.datasets.length;i++)
        {
            myData.datasets[i].data[0].x =  originalData.datasets[i].data[0].r;

        }

        updateChart(myLiveChart);
        
        
     
    });

    $('#ysetx').on("click", function(e) {
        e.preventDefault();
        if (document.forms['frm'].upload.value === "") {
            alert ("No Data Loaded. Import a CSV file first.");
            return false;
         }
        
        for(i=0;i<myData.datasets.length;i++)
        {
    
            myData.datasets[i].data[0].y = originalData.datasets[i].data[0].x;
        
            
        }

        updateChart(myLiveChart);
        
     
    });

    $('#ysety').on("click", function(e) {
        e.preventDefault();

        if (document.forms['frm'].upload.value === "") {
            alert ("No Data Loaded. Import a CSV file first.");
            return false;
         }
        
        for(i=0;i<myData.datasets.length;i++)
        {
            myData.datasets[i].data[0].y = originalData.datasets[i].data[0].y;
        }

        
        updateChart(myLiveChart);
        
     
    });

    $('#ysetv').on("click", function(e) {
        e.preventDefault();

        if (document.forms['frm'].upload.value === "") {
            alert ("No Data Loaded. Import a CSV file first.");
            return false;
         }
        
        for(i=0;i<myData.datasets.length;i++)
        {
            myData.datasets[i].data[0].y = myData.datasets[i].data[0].r;
        }

        
        updateChart(myLiveChart);
        
     
    });

    $('#vsetx').on("click", function(e) {
        e.preventDefault();
        if (document.forms['frm'].upload.value === "") {
            alert ("No Data Loaded. Import a CSV file first.");
            return false;
         }
        
        for(i=0;i<myData.datasets.length;i++)
        {
            myData.datasets[i].data[0].r = myData.datasets[i].data[0].x;
        }

        
        updateChart(myLiveChart);
        
     
    });

    $('#vsety').on("click", function(e) {
        e.preventDefault();

        if (document.forms['frm'].upload.value === "") {
            alert ("No Data Loaded. Import a CSV file first.");
            return false;
         }
        
        for(i=0;i<myData.datasets.length;i++)
        {
            myData.datasets[i].data[0].r = originalData.datasets[i].data[0].y;
        }

        
        updateChart(myLiveChart);
        
     
    });

    $('#vsetv').on("click", function(e) {
        e.preventDefault();

        if (document.forms['frm'].upload.value === "") {
            alert ("No Data Loaded. Import a CSV file first.");
            return false;
         }
        
        for(i=0;i<myData.datasets.length;i++)
        {
            myData.datasets[i].data[0].r = originalData.datasets[i].data[0].r;
        }

        
        updateChart(myLiveChart);
        
     
    });

    $('#xsett').on("click", function(e) {
        e.preventDefault();

        if (document.forms['frm'].upload.value === "") {
            alert ("No Data Loaded. Import a CSV file first.");
            return false;
         }
        
        for(i=0;i<myData.datasets.length;i++)
        {
            myData.datasets[i].data[0].x = originalData.datasets[i].datatime;
        }

        updateChart(myLiveChart);
    
    });

    $('#ysett').on("click", function(e) {
        e.preventDefault();

        if (document.forms['frm'].upload.value === "") {
            alert ("No Data Loaded. Import a CSV file first.");
            return false;
         }
        
        for(i=0;i<myData.datasets.length;i++)
        {
            myData.datasets[i].data[0].y = originalData.datasets[i].datatime;
        }

        updateChart(myLiveChart);
    });




})(window, document)