const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data
d3.json(url).then(function(data) {

    // Trial method - just taking the first list from the names array in the data file
    let individualName = data.names[0]
    console.log(data.names[0]);

    // Better method - searching for a specific name in the names array in the data file
    function selectName(names) {
        return names == "940";
    }
    // And printing it to the console - the [0] removes the name from the array of one
    let individualName2 = data.names.filter(selectName)[0];
    console.log(individualName2);

    // Finding the metadata of the person with the specified name id
    function selectPerson(metadata) {
        return metadata.id == individualName;
    }
    let individualMetadata = data.metadata.filter(selectPerson);
    // Printing it to the console just to check it
    console.log(individualMetadata);


    // Searching the samples array of dictionaries for the specified name id
    function selectSamples(samples) {
        return samples.id == individualName;
    }
    //Returning the whole dictionary of sample information and console logging it
    let individualSamples = data.samples.filter(selectSamples);
    console.log(individualSamples);

    // COLLECTING DATA FOR BAR AND BUBBLE PLOTS

    // Returning only the array containing the array of otu_ids (hence the [0])
    let otuIdNums = individualSamples[0].otu_ids;
    //Adding the label "OTU" to the start of each id number for the bar chart
    let otuIds = otuIdNums.map((item) => `OTU ${item}`);
    console.log(`OTU IDs: ${otuIds}`);

    //Selecting only the top ten for the bar chart plot
    //and reversing for plotly default
    let topTenOtuIds = otuIds.slice(0,10).reverse();
    console.log(`Top Ten OTU IDs: ${topTenOtuIds}`);

    // Do the same as above for the sample_values in the array
    let sampleValues = individualSamples[0].sample_values;
    console.log(`Count per ID: ${sampleValues}`);

    //Selecting only the top ten for the bar chart plot and reversing
    let topTenSampleValues = sampleValues.slice(0,10).reverse();
    console.log(`Top Ten Sample Values: ${topTenSampleValues}`);

    // Finally, do the same for the otu_labels in the array
    let otuLabels = individualSamples[0].otu_labels;
    console.log(`OTU Label: ${otuLabels}`);

    //Selecting only the top ten for the bar chart plot and reversing
    let topTenOtuLabels = otuLabels.slice(0,10).reverse();
    console.log(`Top Ten OTU Labels: ${topTenOtuLabels}`);


    // PLOT THE BAR CHART
    // Get the trace information ready for plotting
    let Trace1 = {
        x: topTenSampleValues,
        y: topTenOtuIds,
        type: "bar",
        text: topTenOtuLabels,
        orientation: 'h'
    };

    // Data array
    let barGraphData = [Trace1];

    // Apply titles to the layout
    let layout = {
        title: "Most common Microbes found in this person's belly button",
        xaxis: {title: "Number of Samples of Microbe"},
        yaxis: {title: "Microbe ID"}
    };

    // Render the plot to the div tag with id "bar" since that's the name in the html file
    Plotly.newPlot("bar", barGraphData, layout);  

    // PLOT THE BUBBLE CHART
    let Trace2 = {
        x: otuIdNums,
        y: sampleValues,
        mode: 'markers',
        text: otuLabels,
        marker: {
            color: otuIdNums,
            size: sampleValues,
            sizeref: 1.5
            }
        };

    // Data array
    let bubbleChartData = [Trace2];

    let bubbleLayout = {
        title: "All Microbes found in this person's belly button",
        xaxis: {title: "Mircrobe ID"},
        yaxis: {title: "Number of Samples of Microbe"}
    };

    // Render the plot to the div tag with id "bubble" since that's the name in the html file
    Plotly.newPlot("bubble", bubbleChartData, bubbleLayout);  

    // COLLECTING DATA FOR METADATA SECTION
    let id = individualMetadata[0].id;
    let ethnicity = individualMetadata[0].ethnicity;
    let gender = individualMetadata[0].gender;
    let age = individualMetadata[0].age;
    let location = individualMetadata[0].location;
    let bbtype = individualMetadata[0].bbtype;
    let weeklyWash = individualMetadata[0].wfreq;
    //APPENDING METADATA TO THE METADATA SECTION

    d3.select("#sample-metadata").text(`id: ${id} \n
                                        Ethnicity: ${ethnicity} \n 
                                        Gender: ${gender} \n 
                                        Age: ${age} \n 
                                        Location: ${location} \n 
                                        Belly Button Type: ${bbtype} \n
                                        Belly Button Wash Frequency: ${weeklyWash}`);
    

    var gaugeData = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: weeklyWash,
            title: { text: "Belly Button Washing Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                marker: { color: 'rgb(255,130,189)',
                    opacity:0.02    
                },
                steps: [
                  { range: [0, 1], color: "rgb(249, 244, 236)"},
                  { range: [1, 2], color: "rgb(245, 242, 229)" },
                  { range: [2, 3], color: "rgb(234, 231, 201)" },
                  { range: [3, 4], color: "rgb(229, 232, 177)" },
                  { range: [4, 5], color: "rgb(213, 230, 153)" },
                  { range: [5, 6], color: "rgb(183, 205, 143)" },
                  { range: [6, 7], color: "rgb(139, 192, 134)" },
                  { range: [7, 8], color: "rgb(137, 180, 141)" },
                  { range: [8, 9], color: "rgb(131, 181, 137)" }
                ]
            }
        }
    ];
    
    var layout3 = { width: 600, height: 500, margin: { t: 0, b: 0 }};
    Plotly.newPlot('gauge', gaugeData, layout3);

});

