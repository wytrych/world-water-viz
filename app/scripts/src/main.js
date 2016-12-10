import * as d3 from 'd3'

import CountrySelectorManager from './country-selector-manager'

const numOfElements = 200

const data = d3.range(numOfElements).map((d) => d / numOfElements)

const cssClasses = {
    circleClass: 'country',
    countryTip: 'tip',
    circlePhantom: 'mask'

}

const margin = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
}

const width = 800 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

const MAX_CIRCLE_RADIUS = 30

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
    function rotate (d, i) {
        return -360 * (i / numOfElements)
    }

    const positioningRingRadius = 180
    draw(
        data,
        createCircularXScale(positioningRingRadius + radius),
        createCircularYScale(positioningRingRadius + radius),
        rotate,
    )
}

function drawInLine () {
    function rotate () {
        return 0
    }

    const SCALE_SEPARATION = 3.5
    draw(
        data,
        (d, i) => i * SCALE_SEPARATION,
        () => height - 30,
        rotate,
    )
}

function createCircularXScale (radius) {
    const centerX = width / 2
    return (d, i) => centerX - Math.sin(d * 2 * Math.PI) * radius
}

function createCircularYScale (radius) {
    const centerY = height / 2
    return (d, i) => centerY - Math.cos(d * 2 * Math.PI) * radius
}

function draw (data, xScale, yScale, rotateFn) {
    const t = d3.transition().duration(750)

    const dataSelection = root.selectAll('circle')
        .data(data)

    const enterSelection = dataSelection.enter()

    const masksSelection = root.selectAll('rect')
        .data(data)

    const masksEnterSelection = masksSelection.enter()

    enterSelection
        .append('circle')
        .attr('style', (d, i) => `fill:${d3.interpolateRainbow(i / numOfElements)}`)
        .transition(t)
        .attr('cx', xScale)
        .attr('cy', yScale)
        .attr('r', calculateRadius)
        .attr('class', cssClasses.circleClass)
        .attr('id', (d, i) => `country-${i}`)

    const RECT_HEIGHT = 55
    const RECT_WIDTH = 5

    masksEnterSelection
        .append('rect')
        .transition(t)
        .attr('x', (d, i) => xScale(d, i) - RECT_WIDTH / 2)
        .attr('y', (d, i) => yScale(d, i) - RECT_HEIGHT / 2)
        .attr('transform', (d, i) => `rotate(${rotateFn(d, i)} ${xScale(d, i)} ${yScale(d, i)})`)
        .attr('width', RECT_WIDTH)
        .attr('height', RECT_HEIGHT)
        .attr('class', cssClasses.circlePhantom)
        .attr('data-target', (d, i) => i)

    enterSelection
        .append('text')
        .text((d, i) => `${i} ${d}`)
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('class', (d, i) => `${cssClasses.countryTip} text-${i}`)

    dataSelection
        .transition(t)
        .attr('cx', xScale)
        .attr('cy', yScale)
        .attr('r', calculateRadius)
        .attr('class', cssClasses.circleClass)
        .attr('id', (d, i) => `country-${i}`)

    masksSelection
        .transition(t)
        .attr('x', (d, i) => xScale(d, i) - RECT_WIDTH / 2)
        .attr('y', (d, i) => yScale(d, i) - RECT_HEIGHT / 2)
        .attr('transform', (d, i) => `rotate(${rotateFn(d, i)} ${xScale(d, i)} ${yScale(d, i)})`)
        .attr('width', RECT_WIDTH)
        .attr('height', RECT_HEIGHT)
        .attr('class', cssClasses.circlePhantom)
        .attr('data-target', (d, i) => i)

}

function calculateRadius (d, i) {
    return (i + 1) * (MAX_CIRCLE_RADIUS / numOfElements)
}

const countryManager = new CountrySelectorManager(hideAllLabels, showLabel, cssClasses.circlePhantom)
countryManager.startHandlers()

function hideAllLabels () {
    d3.selectAll('.' + cssClasses.countryTip).classed('show', false)
}

function showLabel (element) {
    const targetId = element.getAttribute('data-target')
    const el = d3.selectAll(`.text-${targetId}`)
    el.classed('show', true)

    d3.selectAll('circle.country.chosen')
        .classed('chosen', false)
        .classed('fade-out', true)

    d3.select(`#country-${targetId}`)
        .classed('chosen', true)
        .classed('fade-out', false)
}

root.append('circle')
    .attr('cx', 10)
    .attr('cy', 10)
    .attr('r', 20)
    .on('click', toggleScale)
