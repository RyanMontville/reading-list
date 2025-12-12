import * as d3 from 'd3';
import type { ItemGroupCount } from "../models.js";

//Define chart dimensions
const WIDTH = 400;
const HEIGHT = 400;
const MARGIN = 10;
const RADIUS = Math.min(WIDTH, HEIGHT) / 2 - MARGIN;

export function createPieChart(selectorId: string, data: ItemGroupCount[]): void {
  //Select the container and create the SVG element
  const svg = d3.select(`#${selectorId}`)
    .append('svg')
      .attr('width', WIDTH)
      .attr('height', HEIGHT)
    .append('g')
      .attr('transform', `translate(${WIDTH / 2}, ${HEIGHT / 2})`);

  //Create the Pie Generator
  const pie = d3.pie<ItemGroupCount>()
    .value(d => d.count)
    .sort(null);
  //Convert the data into arc objects
  const arcData = pie(data);
  //Create the Arc Generator
  const arc = d3.arc<d3.PieArcDatum<ItemGroupCount>>()
    .innerRadius(0)
    .outerRadius(RADIUS);

  //Draw the Slices
  svg.selectAll('path')
    .data(arcData)
    .join('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color)
}