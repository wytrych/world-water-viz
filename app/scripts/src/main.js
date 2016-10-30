import * as d3 from 'd3'

import CountrySelectorManager from './country-selector-manager'

const numOfElements = 200

const data = d3.range(numOfElements).map((d) => d / numOfElements)

const cssClasses = {
    circleClass: 'country',
    countryTip: 'tip',
};

const SCALE_SEPARATION = 3.5;

const margin = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
}

const width = 800 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

const centerX = width / 2
const centerY = height / 2

const positioningRingRadius = 180
const textGap = 50
const singleCircleRadius = function (d, i) {
    return 2 + i * (5 / numOfElements)
}

const xScale = (radius) =>
    (d, i) => centerX - Math.sin(d * 2 * Math.PI) * radius
const yScale = (radius) =>
    (d, i) => centerY - Math.cos(d * 2 * Math.PI) * radius

const root = d3.select('#container').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

const draw = function (data, xScale, yScale) {
    const t = d3.transition().duration(750)
    console.log(data);
    const enterSelection = root.selectAll('circle')
        .data(data)

    const realEnter = enterSelection.enter()

    realEnter
        .append('circle')
        .attr('style', (d, i) => `fill:${d3.interpolateRainbow(i / numOfElements)}`)
        .transition(t)
        .attr('cx', xScale)
        .attr('cy', yScale)
        .attr('r', singleCircleRadius)
        .attr('class', cssClasses.circleClass)
        .attr('id', (d, i) => i)

    realEnter
        .append('text')
        .text('Some text')
        .attr('x', xScale)
        .attr('y', yScale)
        .attr('class', (d, i) => `${cssClasses.countryTip} text-${i}`)

    enterSelection
        .transition(t)
        .attr('cx', xScale)
        .attr('cy', yScale)
        .attr('r', singleCircleRadius)
        .attr('class', cssClasses.circleClass)
        .attr('id', (d, i) => i)

    enterSelection
        .append('text')
        .text('Some text')
        .attr('x', xScale)
        .attr('y', yScale)
        .attr('class', (d, i) => `${cssClasses.countryTip} text-${i}`)
}

const drawStuff = function (radius = 0) {
    draw(data, xScale(positioningRingRadius + radius), yScale(positioningRingRadius + radius))
}

drawStuff()

let toggle = true;
const toggleScale = function () {
    if (toggle)
        draw(data, (d, i) => i * SCALE_SEPARATION, height - 30)
    else
        drawStuff()

    toggle = !toggle
}

const hideAllLabels = function () {
    d3.selectAll('.' + cssClasses.countryTip).classed('show', false)
}

const showLabel = function (id) {
    console.log(id);
    const el = d3.selectAll(`.text-${id}`)
    console.log(el.node());
    el.classed('show', true)
}

const countryManager = new CountrySelectorManager(hideAllLabels, showLabel, cssClasses.circleClass)
countryManager.startHandlers()

root.append('circle')
    .attr('cx', 10)
    .attr('cy', 10)
    .attr('r', 20)
    .on('click', toggleScale)
