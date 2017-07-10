/*
 * for commented source please see readme.md
 */

var width = 1080,
    height = 920,
    innerRadius = Math.min(width, height) * .41,
    outerRadius = innerRadius * 1.1;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate("+width/2+","+height/2+")");

console.log("Loading data...");

d3.csv('./Embeddings/relation_embeddings0.csv', function(err, data) {
    var matrix = [],
        countries = d3.keys(data[0]).slice(1);
        names_dictionary = []

        d3.csv('./Embeddings/relation_dictionary.csv', function(err, data) {
          data.forEach(function(row) {
            names_dictionary.push(row["uri"]);
          });
        });

    data.forEach(function(row) {
        var mrow = [];
        countries.forEach(function(c) {
            mrow.push(Number(row[c]));
        });
        matrix.push(mrow);
    });
    var chord = d3.layout.chord()
        .matrix(matrix)
        .padding(0.03)
        .sortSubgroups(d3.descending);

    var fill = d3.scale.category10();

    var g = svg.selectAll("g.group")
        .data(chord.groups)
      .enter().append("svg:g")
        .attr("class", "group");

   var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return fill(d.index); })
        .style("stroke", function(d) { return fill(d.index); })
        .attr("id", function(d, i) { return "group-" + d.index });;

    var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ];

    g.append("svg:text")
        .attr("x", 1)
        .attr("class", "country")
        .attr("dy", 18)
      .append("svg:textPath")
        .attr("xlink:href", function(d) { return "#group-" + d.index; })
        .text(function(d) {
          names_dictionary.forEach(function(x) {
            console.log(x);
          });
          return "Meh"; //names_dictionary[d.index];
          /*
          var i = countries[d.index].indexOf('#');
					var l = countries[d.index].length;
          if (arr.indexOf(countries[d.index].substring(i+1,l)) >= 0) {
            return countries[d.index].substring(i+1, l);
          }
          return "F-" + d.index;
          */
        });

    function chordColor(d) {
        return fill(d.source.value > d.target.value ?
            d.source.index : d.target.index);
    }

    svg.append("g")
        .attr("class", "chord")
      .selectAll("path")
        .data(chord.chords)
      .enter().append("path")
        .attr("d", d3.svg.chord().radius(innerRadius))
        .style("fill", chordColor)
        .style("opacity", 1);

    function fade(opacity) {
        return function(g, i) {
            svg.selectAll(".chord path")
               .filter(function(d) {
                    return d.source.index != i &&
                           d.target.index != i;
                })
               .transition()
               .style("opacity", opacity);

               font_weight = "not_bold"
            svg.selectAll("text")
              .filter(function(d) {
                return d.index == i;
              })
              .style("font-size", "12px")
              .style("font-weight", "bold");

            svg.selectAll("path[id=group-"+i+"]")
              .style("stroke-width", "1px")
        };
    }
    g.on("mouseover", fade(0.1))
     .on("mouseout", fade(1));
});
