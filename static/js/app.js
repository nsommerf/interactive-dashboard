//Use the D3 library to read in samples.json.
//console.log(JSON.stringify("../../data/samples.json"));
//d3.json("data/samples.json").then((samples) => {
  //  Create the Traces
//  console.log(samples);
// there are 153 samples
// for otu_ids - they are arrays.  There are corresponding sample_values and otu_labels
//});
// dataset already seems to be sorted by highest found to lowest by sample_values
var otuData = d3.json("data/samples.json");
// Get a reference to the table body
var meta = d3.select("#sample-metadata");

// Select the button
var form = d3.select("#selDataset");
//metaId = [];

function optionChanged(val) {
  console.log("new input value: " + val);
  buildPage(val);
};

function initSelect(initdata){
  console.log(initdata);
  var options = '';
  for ( var j = 0 ; j < initdata.length; j++) {
    //otuId.push(otuData.samples[j].id);
    //metaId.push(otuData.metadata[j].id);
    options += '<option value="' + initdata[j].id + '">' + initdata[j].id + '</option>';
  }
  form.html(options);
  //otuId.sort();
  //console.log(otuId);
  //console.log(metaId);
};


function buildTable(indata) {
    meta.html("")
    //var row = meta.append("tr");
    Object.entries(indata).forEach(([key, value]) => {
      var row = meta.append("tr");
      var cell = row.append("td");
      var str = key + " : " + value;
      cell.text(str);
    });
};

function buildTopTenPlot(sampleid) {
  // Trace1 for the Greek Data
  var otuy = [];
  var otu = sampleid.otu_ids.slice(0,10).reverse();
  for (var k=0; k< 10; k++) {
    otuy.push("OTU - " + otu[k]);
  }
  var trace1 = {
  //x: reversedData.map(object => object.sample_values),
  //y: reversedData.map(object => object.otu_ids),
  //text: reversedData.map(object => object.otu_labels),
    x: sampleid.sample_values.slice(0,10).reverse(),
    //y: sampleid.otu_ids.slice(0,10).reverse(),
    y:  otuy,
    text: sampleid.otu_labels.slice(0,10).reverse(),
    name: "Otu Top 10",
    type: "bar",
    orientation: "h"
  };

  // data
  var data = [trace1];

  // Apply the group bar mode to the layout
  var layout = {
    title: "Otu Top 10",
    height: 400,
    width: 600
  };

//console.log(samples.samples[0].otu_ids);

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar", data, layout);

};

function buildScatterPlot(sampleid) {
  var divSize = sampleid.sample_values[0];
  var sizeref = 2.0 * sampleid .sample_values[0]/ (80**2)
  var divColor = sampleid.otu_ids[0];
  var divColorLen = sampleid.otu_ids.length;
  otuColor = [];
 
  // picked 4 colors and adding based on otu
  for ( var i = 0 ; i < divColorLen; i++) {
    //otuId.push(samples.samples[i].id);
    if (sampleid.otu_ids[i] < 1000){
      otuColor.push('rgb(93, 164, 214)');
    }
    else if (sampleid.otu_ids[i] < 2000){
      otuColor.push('rgb(255, 144, 14)');
    }
    else if (sampleid.otu_ids[i] < 3000){
      otuColor.push('rgb(44, 160, 101)');
    }
    else {
      otuColor.push('rgb(255, 65, 54)');
    }
  }
  var trace2 = {
    y: sampleid.sample_values,
    x: sampleid.otu_ids,
    text: sampleid.otu_labels,
    mode: 'markers',
    marker: {
      color: otuColor,
      size: sampleid.sample_values,
      sizeref: sizeref,
      sizemode: 'area'
      //size: [50, 100, 150, 200]
    },
    name: "Otus"
  };

   // data
   var data2 = [trace2];

   var layout = {
     title: 'Bubble Chart',
     showlegend: false,
   };
 
   Plotly.newPlot("bubble", data2, layout);
 

};

function buildGuage(sampleid){
  console.log(sampleid);
  var data3 = [
    {
      type: "indicator",
      mode: "gauge+number",
      value: sampleid.wfreq,
      title: { text: "Wash Frequency", font: { size: 16 } },
      //delta: { reference: 9, increasing: { color: "RebeccaPurple" } },
      gauge: {
        axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 1], color: "lightgray" },
          { range: [1, 2], color: "lightgray" },
          { range: [2, 3], color: "lightgray" },
          { range: [3, 4], color: "lightgreen" },
          { range: [4, 5], color: "lightgreen" },
          { range: [5, 6], color: "lightgreen" },
          { range: [6, 7], color: "green" },
          { range: [7, 8], color: "green" },
          { range: [8, 9], color: "green" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 7
        }
      }
    }
  ];
  var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', data3, layout);
}

function buildPage(id){
  otuData.then((samples) => {
    console.log(samples.metadata)
    if(id == 0){
      // this is the initial page load
      // buildTop Ten Plot
      console.log("hitting init page")
      buildTopTenPlot(samples.samples[0]);
      //build scatter plot
      buildScatterPlot(samples.samples[0]);
      //build metadata
      buildTable(samples.metadata[0]);
      //Build select
      initSelect(samples.metadata);
      //build guage
      buildGuage(samples.metadata[0])
    }
    else{
      for ( var i = 0 ; i < samples.metadata.length; i++) {
        //if (samples.metadata[i].id === id){
        //  console.log("Building metadata");
        //  buildTable(samples.metadata[i]);
        //}
        if(samples.samples[i].id === id){
          console.log("building plots")
          console.log(samples.metadata[i]);
          console.log(samples.samples[i]);
          buildTable(samples.metadata[i]);
          buildGuage(samples.metadata[i]);
          buildTopTenPlot(samples.samples[i]);
          buildScatterPlot(samples.samples[i]);
        }
      }
    
    }
    
  });
};

buildPage(0);
//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
//Use sample_values as the values for the bar chart.
//Use otu_ids as the labels for the bar chart.
//Use otu_labels as the hovertext for the chart.

//Create a bubble chart that displays each sample.
//Use otu_ids for the x values.
//Use sample_values for the y values.
//Use sample_values for the marker size.
//Use otu_ids for the marker colors.
//Use otu_labels for the text values.


//Display the sample metadata, i.e., an individual's demographic information.


//Display each key-value pair from the metadata JSON object somewhere on the page.


//Update all of the plots any time that a new sample is selected.