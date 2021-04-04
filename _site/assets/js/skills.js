function drawSkillsBar()
{
    var svg = d3.select('svg.skillgraph');
    var container = svg.node().parentNode; 

    var col = document.querySelector('.col-lg-5');
    var style = getComputedStyle(col);
	    
    var leftPad = parseInt(style.paddingLeft);
    var rightPad = parseInt(style.paddingRight);
    var radius = (leftPad+rightPad)/6;
	
    var width = parseInt(container.getBoundingClientRect().width) - leftPad - rightPad;

    /* Use this to compute rem size */
    var subsection = document.querySelector('.section-scroll');
    style = getComputedStyle(subsection);	
    var remInPx = parseInt(style.scrollMarginTop)/5;
    var barHeight = 3 * remInPx;
	    
    var h3 = document.querySelector('.font-secondary');
    style = getComputedStyle(h3);
    var font = style.fontFamily;

    var x = d3.scaleLinear()
    	.range([0, width]);

    svg.attr("width", width);
    
    d3.csv("/assets/skills.csv", function(error, data) {
	if (error) throw error;

	var height = data.length * barHeight;

        var y = d3.scaleBand()
		.range([0, height])
	        .padding(0.2);

	svg.attr("height", height);

        data.forEach(function(d) {
	    d.points = parseInt(d.points);
	});
	
	var max = d3.max(data, function(d) { return d.points; });
	x.domain([0, max]);
	y.domain(data.map(function(d) { return d.skill; }));

	var colors = ["#d62728", "#bbbc21", "#2ca02c"];
        var col = d3.scaleLinear();
	col.domain(d3.ticks(0, max, colors.length))
	    .range(colors);
	console.log(d3.ticks(0, max, colors.length));

	var bar = svg.selectAll("g")
    		    .data(data)
    		    .enter().append("g")
    		    .attr("transform", (d, i) => `translate(${x(0)}, ${y(d.skill)})`);
        var rect = bar.append("rect")
    		    .attr("width", function(d) { return x(d.points); })
    		    .attr("height", y.bandwidth())
    		    .attr("rx", radius)
    		    .attr("ry", radius) 
    		    .attr("fill", function(d) {
    			if(d.skill == "Max") {
    			    return "url(#grad1)";
    			} else {
    			    return col(d.points);
    			}
    		    });
        var text = bar.append("text")
    		    .attr("x", function(d) { return (x(d.points) - 
	    				    parseInt(d.skill.length) * remInPx)/2;})
    		    .attr("y", function(d) { return y.bandwidth()/1.4; })
    		    .attr("fill", "white")
    		    .attr("font-family", font)
    		    .attr("font-size", 25)
    		    .text(function(d) { if(d.skill != "Max")
    				    return d.skill;
    				});
		    }
	);
}

function drawWordCloud()
{
    var word_count = {"STL" : 5,
		    "vim" : 5,
		    "Design Patterns": 3,
		    "valgrind": 3,
		    "C++14": 3,
		    "OpenCV": 2,
		    "bulletphysics": 2,
		    "PhysX": 2,
		    "boost": 2,
		    "Compilers": 1,
		    "CUDA": 1,
		    "qt4": 2,
		    "Ogre3D": 1,
		    "Irrlicht": 1,
		    "G3D": 1,
		    "cocos2dx": 1,
		    "Android" : 1};

    var svg_location = "svg.cloud";
    var svg = d3.select('svg.skillgraph');

    var height = svg.node().clientHeight;
    var width = svg.node().clientWidth;

    var fill = d3.schemeCategory10;

    var word_entries = d3.entries(word_count);

    var xScale = d3.scaleLinear()
		.domain([0, d3.max(word_entries, function(d) {
		    return d.value;
		})])
		.range([10,100]);

    d3.layout.cloud().size([width, height])
	    .timeInterval(20)
	    .words(word_entries)
	    .fontSize(function(d) { return xScale(+d.value); })
	    .text(function(d) { return d.key; })
	    .rotate(function() { return ~~(Math.random() * 2) * 90; })
	    .font("Impact")
	    .on("end", draw)
	    .start();
    function draw(words) 
    {
	d3.select(svg_location)
	    .attr("width", width)
	    .attr("height", height)
	    .append("g")
	    .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
	    .selectAll("text")
	    .data(words)
	    .enter().append("text")
	    .style("font-size", function(d) { return xScale(d.value) + "px"; })
	    .style("font-family", "Impact")
	    .style("fill", function(d, i) {
			    if(i >= fill.length) {
				i = i % fill.length;
			    }
			    return fill[i]; })
	    .attr("text-anchor", "middle")
	    .attr("transform", function(d) {
		return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
	    })
	    .text(function(d) { return d.key; });
    }
}
