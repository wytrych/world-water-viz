import * as d3 from 'd3'

const numOfElements = 40

const data = d3.range(numOfElements).map((d) => d / numOfElements)

const margin = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
}

const width = 500 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

const xScale = (d, i) => width / 2 + Math.sin(d * 2 * Math.PI) * 130
const yScale = (d, i) => height / 2 + Math.cos(d * 2 * Math.PI) * 130

const root = d3.select('#container').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)


root.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
        .attr('cx', xScale)
        .attr('cy', yScale)
        .attr('r', 10)
