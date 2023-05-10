const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data
d3.json(url).then(function(data) {

    ///// ADDING ALL THE NAMES TO THE HTML FILE: /////

    // select the dropdown list using D3.js
    let dropdownMenu = d3.select("#selDataset");
    
    //for each item in data.names 
    for (i =0; i < data.names.length; i++) {

        //Create the option element
        let newOption = document.createElement("option");

        //Append the text and the value
        newOption.text = data.names[i];
        newOption.value = data.names[i];

        //Append this as a child function into the list
        dropdownMenu.node().appendChild(newOption);
    };

    ///// INITIALIZING THE WEBPAGE /////
    // Create an initialized webpage just using the first person in the list
    function init() {

        //Store the chosen initialized individual (940) as a variable. This will change when the user selects, but is set for the initialization.
        let selectedIndividual = data.names[0]

        // Searching for the specified name in the names array in the data file
        function selectName(names) {
        return names == selectedIndividual;
        }

        // Create a variable to store the name of the selected individual
        let individualName = data.names.filter(selectName)[0];
        
        // Finding the metadata of the person with the specified name id 
        function selectPerson(metadata) {
        return metadata.id == individualName;
        }
        let individualMetadata = data.metadata.filter(selectPerson);

         // Searching the samples array of dictionaries for the specified name id and returning just that dictionary
        function selectSamples(samples) {
            return samples.id == individualName;
        }
        //Returning the whole dictionary of sample information and console logging it, just to check
        let individualSamples = data.samples.filter(selectSamples);
        console.log(individualSamples);

        ///// COLLECTING DATA FOR BAR AND BUBBLE PLOTS /////

        // Returning only the array containing the array of otu_ids (hence the [0])
        let otuIdNums = individualSamples[0].otu_ids;
        //Adding the label "OTU" to the start of each id number for the bar chart
        let otuIds = otuIdNums.map((item) => `OTU ${item}`);
        
        //Selecting only the top ten for the bar chart plot
        //and reversing for plotly default
        let topTenOtuIds = otuIds.slice(0,10).reverse();
        
        // Do the same as above for the sample_values in the array
        let sampleValues = individualSamples[0].sample_values;
       
        //Selecting only the top ten for the bar chart plot and reversing
        let topTenSampleValues = sampleValues.slice(0,10).reverse();
        
        // Finally, do the same for the otu_labels in the array
        let otuLabels = individualSamples[0].otu_labels;
        
        //Selecting only the top ten for the bar chart plot and reversing
        let topTenOtuLabels = otuLabels.slice(0,10).reverse();
       
        ///// PLOT THE BAR CHART /////

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

        ///// PLOT THE BUBBLE CHART /////

        //Define all the trace information
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
        
        // Setting up the layout
        let bubbleLayout = {
            title: "All Microbes found in this person's belly button",
            xaxis: {title: "Mircrobe ID"},
            yaxis: {title: "Number of Samples of Microbe"}
        };

        // Render the plot to the div tag with id "bubble" since that's the name in the html file
        Plotly.newPlot("bubble", bubbleChartData, bubbleLayout);  

        ///// COLLECTING DATA FOR METADATA SECTION /////
        let id = individualMetadata[0].id;
        let ethnicity = individualMetadata[0].ethnicity;
        let gender = individualMetadata[0].gender;
        let age = individualMetadata[0].age;
        let location = individualMetadata[0].location;
        let bbtype = individualMetadata[0].bbtype;
        let weeklyWash = individualMetadata[0].wfreq;

        //APPENDING METADATA TO THE METADATA SECTION

        d3.select("#sample-metadata").html(`<b>id</b>: ${id} <br>
                                            <b>Ethnicity</b>: ${ethnicity} <br> 
                                            <b>Gender</b>: ${gender} <br> 
                                            <b>Age</b>: ${age} <br>
                                            <b>Location</b>: ${location} <br> 
                                            <b>Belly Button Type</b>: ${bbtype} <br>
                                            <b>Belly Button Wash Frequency</b>: ${weeklyWash}`);
        
        ///// BONUS: PLOTTING THE GAUGE PLOT /////

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

        };

        // When the Drop Down Menu (#selDataset) is changed, then run the function "updatePlotly"
        d3.selectAll("#selDataset").on("change", updatePlotly);

        // Defining the function updatePlotly
        function updatePlotly(){
        
        //Select the dropdownmenu
        let dropdownMenu = d3.select("#selDataset");
    
        //Store the chosen initialized individual as a variable.
        let selectedIndividual = dropdownMenu.property("value")

        // THE REMAINDER OF THIS CODE IS THE SAME AS ABOVE, EXCEPT IT RUNS FOR WHICHEVER NAME IS STORED AS "selectedIndividual"

        // Searching for a specific name in the names array in the data file
        function selectName(names) {
        return names == selectedIndividual;
        }

        // Create a variable to store the name of the selected individual
        let individualName = data.names.filter(selectName)[0];

        //Log it just to check
        console.log(individualName);

        // Finding the metadata of the person with the specified name id
        function selectPerson(metadata) {
        return metadata.id == individualName;
        }
        let individualMetadata = data.metadata.filter(selectPerson);

        // Searching the samples array of dictionaries for the specified name id
        function selectSamples(samples) {
            return samples.id == individualName;
        }
        //Returning the whole dictionary of sample information and console logging it
        let individualSamples = data.samples.filter(selectSamples);
        console.log(individualSamples);

        ///// COLLECTING DATA FOR BAR AND BUBBLE PLOTS /////

        // Returning only the array containing the array of otu_ids (hence the [0])
        let otuIdNums = individualSamples[0].otu_ids;
        //Adding the label "OTU" to the start of each id number for the bar chart
        let otuIds = otuIdNums.map((item) => `OTU ${item}`);
        
        //Selecting only the top ten for the bar chart plot
        //and reversing for plotly default
        let topTenOtuIds = otuIds.slice(0,10).reverse();
        
        // Do the same as above for the sample_values in the array
        let sampleValues = individualSamples[0].sample_values;
        
        //Selecting only the top ten for the bar chart plot and reversing
        let topTenSampleValues = sampleValues.slice(0,10).reverse();
        
        // Finally, do the same for the otu_labels in the array
        let otuLabels = individualSamples[0].otu_labels;
        
        //Selecting only the top ten for the bar chart plot and reversing
        let topTenOtuLabels = otuLabels.slice(0,10).reverse();
        

        ///// PLOT THE BAR CHART /////
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

        ///// PLOT THE BUBBLE CHART /////
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

        ///// COLLECTING DATA FOR METADATA SECTION /////
        let id = individualMetadata[0].id;
        let ethnicity = individualMetadata[0].ethnicity;
        let gender = individualMetadata[0].gender;
        let age = individualMetadata[0].age;
        let location = individualMetadata[0].location;
        let bbtype = individualMetadata[0].bbtype;
        let weeklyWash = individualMetadata[0].wfreq;

        ///// APPENDING METADATA TO THE METADATA SECTION /////

        d3.select("#sample-metadata").html(`<b>id:</b> ${id} <br>
                                            <b>Ethnicity:</b> ${ethnicity} <br>
                                            <b>Gender:</b> ${gender} <br>
                                            <b>Age:</b> ${age} <br>
                                            <b>Location:</b> ${location} <br> 
                                            <b>Belly Button Type:</b> ${bbtype} <br>
                                            <b>Belly Button Wash Frequency:</b> ${weeklyWash}`);


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

        };
    
    //Run the init function regardless of whether anything is clicked.
    init();

});

