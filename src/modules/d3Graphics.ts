import * as d3 from 'd3';
import type { ItemGroupCount } from "../models.js";

export function createPieChart(selectorId: string, data: ItemGroupCount[]): void {
  //Define chart dimensions
  const pieWidth = 400;
  const pieHeight = 400;
  const pieMargin = 10;
  const pieRadius = Math.min(pieWidth, pieHeight) / 2 - pieMargin;
  //Select the container and create the SVG element
  const svg = d3.select(`#${selectorId}`)
    .append('svg')
    .attr('width', pieWidth)
    .attr('height', pieHeight)
    .append('g')
    .attr('transform', `translate(${pieWidth / 2}, ${pieHeight / 2})`);

  //Create the Pie Generator
  const pie = d3.pie<ItemGroupCount>()
    .value(d => d.count)
    .sort(null);
  //Convert the data into arc objects
  const arcData = pie(data);
  //Create the Arc Generator
  const arc = d3.arc<d3.PieArcDatum<ItemGroupCount>>()
    .innerRadius(0)
    .outerRadius(pieRadius);

  //Draw the Slices
  svg.selectAll('path')
    .data(arcData)
    .join('path')
    .attr('d', arc)
    .attr('fill', (d) => d.data.color)
}

export function createLineGraph(selectorId: string, data: ItemGroupCount[]) {
  //Define chart dimensions
  const lineWidth = 800;
  const lineHeight = 500;
  const lineMargin = { top: 20, right: 30, bottom: 60, left: 70 };
  const lineDrawingWidth = lineWidth - lineMargin.left - lineMargin.right;
  const lineDrawingHeight = lineHeight - lineMargin.top - lineMargin.bottom;
  const parseDate = d3.timeParse("%B %Y");
  const timeFormatter = d3.timeFormat("%b %y") as (
    d: Date | d3.NumberValue
  ) => string;

  //Initialize SVG
  const svg = d3.select(`#${selectorId}`)
    .append('svg')
    .attr('width', lineWidth)
    .attr('height', lineHeight)
    .append('g')
    .attr('transform', `translate(${lineMargin.left}, ${lineMargin.top})`);
  //Data Preparation
  const preparedData = data.map(d => ({
    date: parseDate(d.itemKey),
    count: d.count,
    color: d.color,
    itemKey: d.itemKey
  })).filter(d => d.date !== null) as { date: Date, count: number, color: string, itemKey: string }[];
  //Sort the data by date to ensure the line is drawn correctly
  preparedData.sort((a, b) => a.date.getTime() - b.date.getTime());
  //X-Scale: Time Scale for the Date/Time axis
  const xScale = d3.scaleTime()
    .domain(d3.extent(preparedData, d => d.date) as [Date, Date])
    .range([0, lineDrawingWidth]);
  //Y-Scale: Linear Scale for the Count axis
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(preparedData, d => d.count) || 10])
    .range([lineDrawingHeight, 0]);
  //X-Axis
  svg.append('g')
  svg.append('g')
    .attr('transform', `translate(0, ${lineDrawingHeight})`)
    .call(d3.axisBottom(xScale).tickFormat(timeFormatter));
  //Y-Axis
  svg.append('g')
    .call(d3.axisLeft(yScale));
  //Add Y-Axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - lineMargin.left)
    .attr("x", 0 - (lineDrawingHeight / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Books Read")

  //Define the Line Generator function
  const lineGenerator = d3.line<{ date: Date, count: number }>()
    .x(d => xScale(d.date))
    .y(d => yScale(d.count));
  //Draw the actual path element
  svg.append('path')
    .datum(preparedData)
    .attr('fill', 'none')
    .attr('stroke', preparedData[0]?.color || '#1f77b4')
    .attr('stroke-width', 3)
    .attr('d', lineGenerator);
    const tooltip = d3.select(`#${selectorId}`)
    .append("div")
    .attr("class", "tooltip");
  //Draw Circles
  svg.selectAll(".dot")
    .data(preparedData)
    .join("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.date))
    .attr("cy", d => yScale(d.count))
    .attr("r", 5)
    .attr("fill", "#fff")
    .attr("stroke", preparedData[0]?.color || '#1f77b4')
    .attr("stroke-width", 2)
    .style("opacity", 0.9)
    //Add Event Handlers
    .on("mouseover", function(event, d) {
        //Show the tooltip and highlight the circle
        event.preventDefault();
        d3.select(this)
            .attr("r", 8)
            .style("fill", d.color || '#1f77b4');

        tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
            
        tooltip.html(`
            <strong>${d.itemKey}</strong><br/>
            Books: ${d.count}
        `);
    })
    .on("mousemove", function(event) {
        tooltip.style("left", (event.pageX + 10) + "px")
               .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseleave", function() {
        d3.select(this)
            .attr("r", 5)
            .style("fill", "#fff");
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });
}