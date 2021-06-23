const dataPromise = d3.json("data/samples.json");
console.log("Data Promise: ", dataPromise);

//Use the D3 library to read in samples.json

function buildPlot(sample) {
    d3.json("data/samples.json").then((data) => {

        var samples = data.samples;
        var resultsList = samples.filter(sampleobject => sampleobject.id == sample);
        var results = resultsList[0];
    
        var sample_values = results.sample_values;
        var otu_labels = results.otu_labels;
        var otu_ids = results.otu_ids;
        
        console.log(resultsList);


        var trace1 = {
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h" 

        };

        var barData = [trace1];

        var layout1 = {
            title: "Top 10 OTUs Found",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        var trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values,
                colorscale: 'YlGnBu'
            }
        };

        var layout2 = {
            height: 600,
            width: 1000,
            xaxis: {title: "OTU ID"}
        };

        bubbleData = [trace2];

        Plotly.newPlot("bar", barData, layout1);
        Plotly.newPlot("bubble", bubbleData, layout2);
    });
};

function buildMetadata(sample) {
    
    var MetaDataBox = d3.select("#sample-metadata")
    
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        var metaresultsList = metadata.filter(metadataobject => metadataobject.id == sample);
        var metaresults = metaresultsList[0];

        console.log(Object.keys(metaresults));

        MetaDataBox.html("");

        Object.keys(metaresults).forEach((key) => {
            var info = key + ': ' + metaresults[key];

            MetaDataBox
                .append('h5')
                .text(info);
        });
    });
}

// This function for dropdown selection
function init() {
    
    var dropdownMenu = d3.select("#selDataset");

    d3.json("data/samples.json").then((data) => {
        var sampleNames = data.names;
        
        sampleNames.forEach((sample) => {
            dropdownMenu
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Using first sample data to create initial charts
        var firstSample = sampleNames[0];
        buildPlot(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildPlot(newSample);
    buildMetadata(newSample);
  }

init();

