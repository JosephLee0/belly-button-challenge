let datasetSelect = d3.select("#selDataset");
let metadataSelector = d3.select("#sample-metadata");

//function to extract top 10 and reverse
function firstTen(arr) {
  return arr.slice(0, 10).reverse();
}

//to display the default bar plot
function plotBar(value, label, hovertext) {
  let data = [
    {
      x: firstTen(value),
      y: firstTen(
        label.map((ele) => {
          return "OTU " + ele;
        })
      ),
      type: "bar",
      orientation: "h",
      hovertemplate: firstTen(hovertext),
    },
  ];

  let layout = {
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU ID" },
    height: 600,
    width: 800,
  };

  Plotly.newPlot("bar", data, layout);
}

//to display the initial bubble chart
function plotBubble(value, ids, label) {
  let data = [
    {
      x: ids,
      y: value,
      mode: "markers",
      marker: {
        size: value,
        color: ids,
        colorscale: "Portland",
      },
      text: label,
    },
  ];

  let bubbleLayout = {
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Sample Values" },
    width: 1000,
  };
  Plotly.newPlot("bubble", data, bubbleLayout);
}

//to display MetaData
function metaData(data, id) {
  let currentData = data.find((ele) => {
    return ele.id == id;
  });
  metadataSelector.html(
    `id : ${currentData.id} </br>
  ethnicity : ${currentData.ethnicity} </br>
  gender : ${currentData.gender} </br>
  age : ${currentData.age} </br>
  location : ${currentData.location} </br>
  bbtype : ${currentData.bbtype} </br>
  wfreq : ${currentData.wfreq} </br>
  `
  );
}

//function to extract the current value in the dropdown option
function optionChanged(value) {
  return value;
}

//setting the API url
const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data
d3.json(url).then(function (data) {
  //assigning metadata
  let meta_data = data.metadata;
  //Assigning the data samples
  let sampleArray = data.samples;

  //initializing data object
  let dataObject = {};

  //appending the keys and the values
  sampleArray.forEach((element) => {
    dataObject[element.id] = {
      sample_values: element.sample_values,
      otu_ids: element.otu_ids,
      otu_labels: element.otu_labels,
    };
  });

  //setting the options in the html dropdown
  let content;
  for (const key of Object.keys(dataObject)) {
    content += `<option value=${key}>${key}</option>`;
    datasetSelect.html(content);
  }

  //plotting the default graph
  let firstPlot = dataObject["940"];
  plotBar(firstPlot.sample_values, firstPlot.otu_ids, firstPlot.otu_labels);
  plotBubble(firstPlot.sample_values, firstPlot.otu_ids, firstPlot.otu_labels);

  //displaying default Demographic info
  metaData(meta_data, 940);

  //restyling the plot on id chanage
  datasetSelect.on("change", function () {
    //extracting the current value in the dropdown
    let currentValue = datasetSelect.property("value");
    let data = dataObject[currentValue];

    //restyling the plot
    plotBar(data.sample_values, data.otu_ids, data.otu_labels);
    plotBubble(data.sample_values, data.otu_ids, data.otu_labels);

    //re-rendering the Demographic info
    metaData(meta_data, currentValue);
  });
});
