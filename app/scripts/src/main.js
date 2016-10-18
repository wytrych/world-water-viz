import * as d3 from 'd3'

const numOfElements = 20

const data = d3.range(numOfElements).map((d) => d / numOfElements)

const margin = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
}

const width = 500 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

const centerX = width / 2;
const centerY = height / 2;

const positioningCircleRadius = 150;
const textGap = 50;
const singleCircleRadius = 20;

const xScale = (radius) =>
    (d, i) => centerX + Math.sin(d * 2 * Math.PI) * radius
const yScale = (radius) =>
    (d, i) => centerY + Math.cos(d * 2 * Math.PI) * radius

const root = d3.select('#container').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

const enterSelection = root.selectAll('circle')
    .data(data)
    .enter()

enterSelection
    .append('circle')
        .attr('cx', xScale(positioningCircleRadius))
        .attr('cy', yScale(positioningCircleRadius))
        .attr('r', singleCircleRadius)
        .attr('id', (d, i) => i)
        .on('mouseover', function (d, i) {
            d3.select(`.text-${i}`).classed('show', true);
        })
        .on('mouseout', function (d, i) {
            d3.select(`.text-${i}`).classed('show', false);
        })

enterSelection
    .append('text')
    .text('Some text')
    .attr('x', xScale(positioningCircleRadius + textGap))
    .attr('y', yScale(positioningCircleRadius + textGap))
    .attr('class', (d, i) => `text-${i}`)
