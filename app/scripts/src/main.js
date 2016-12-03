import * as d3 from 'd3'

import CountrySelectorManager from './country-selector-manager'

const numOfElements = 200

const data = d3.range(numOfElements).map((d) => d / numOfElements)

const cssClasses = {
    circleClass: 'country',
    countryTip: 'tip',
}

const margin = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
}

const width = 800 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

const root = d3.select('#container').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

let toggle = true
function toggleScale () {
    if (toggle)
        drawInLine()
    else
        drawInCircle()

    toggle = !toggle
}

drawInCircle()

function drawInCircle (radius = 0) {
    const positioningRingRadius = 180
    draw(data, createCircularXScale(positioningRingRadius + radius), createCircularYScale(positioningRingRadius + radius))
}

function drawInLine () {
    const SCALE_SEPARATION = 3.5
    draw(data, (d, i) => i * SCALE_SEPARATION, height - 30)
}

function createCircularXScale (radius) {
    const centerX = width / 2
    return (d, i) => centerX - Math.sin(d * 2 * Math.PI) * radius
}

function createCircularYScale (radius) {
    const centerY = height / 2
    return (d, i) => centerY - Math.cos(d * 2 * Math.PI) * radius
}

function draw (data, xScale, yScale) {
    const dataSelection = root.selectAll('circle')
        .data(data)

    const enterSelection = dataSelection.enter()

    enterSelection
        .append('circle')
        .attr('style', (d, i) => `fill:${d3.interpolateRainbow(i / numOfElements)}`)
        .transition(t)
        .attr('cx', xScale)
        .attr('cy', yScale)
        .attr('r', calculateRadius)
        .attr('class', cssClasses.circleClass)
        .attr('id', (d, i) => i)

    enterSelection
        .append('text')
        .text((d, i) => `${i} ${d}`)
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('class', (d, i) => `${cssClasses.countryTip} text-${i}`)

    const t = d3.transition().duration(750)

    dataSelection
        .transition(t)
        .attr('cx', xScale)
        .attr('cy', yScale)
        .attr('r', calculateRadius)
        .attr('class', cssClasses.circleClass)
        .attr('id', (d, i) => i)

}

function calculateRadius (d, i) {
    const r = 30
    return (i + 1) * (r / numOfElements)
}

const countryManager = new CountrySelectorManager(hideAllLabels, showLabel, cssClasses.circleClass)
countryManager.startHandlers()

function hideAllLabels () {
    d3.selectAll('.' + cssClasses.countryTip).classed('show', false)
}

function showLabel (element) {
    d3.selectAll('circle.country.chosen')
        .classed('chosen', false)
        .classed('fade-out', true)

    d3.select(element)
        .classed('chosen', true)
        .classed('fade-out', false)

    const el = d3.selectAll(`.text-${element.id}`)
    el.classed('show', true)
}

root.append('circle')
    .attr('cx', 10)
    .attr('cy', 10)
    .attr('r', 20)
    .on('click', toggleScale)
