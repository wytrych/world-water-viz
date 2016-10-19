import * as d3 from 'd3'

const numOfElements = 20

const data = d3.range(numOfElements).map((d) => d / numOfElements)

const cssClasses = {
    circleClass: 'country',
    countryTip: 'tip'
};

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

const positioningRingRadius = 150;
const textGap = 50;
const singleCircleRadius = 20;

let stopScroll = false;

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
        .attr('cx', xScale(positioningRingRadius))
        .attr('cy', yScale(positioningRingRadius))
        .attr('r', singleCircleRadius)
        .attr('class', cssClasses.circleClass)
        .attr('id', (d, i) => i)

enterSelection
    .append('text')
    .text('Some text')
    .attr('x', xScale(positioningRingRadius + textGap))
    .attr('y', yScale(positioningRingRadius + textGap))
    .attr('class', (d, i) => `${cssClasses.countryTip} text-${i}`)

const findElement = function (event) {
    const x = event.touches[0].clientX
    const y = event.touches[0].clientY

    const element = document.elementFromPoint(x, y)

    return {
        id: element.id,
        isCountryCircle: element.classList.contains(cssClasses.circleClass)
    }
}

window.addEventListener('touchstart', (e) => {
    const element = findElement(e)
    if (element.isCountryCircle)
        stopScroll = true
})

window.addEventListener('touchend', () => {
    stopScroll = false
})

window.addEventListener('touchmove', (e) => {
    if (stopScroll)
        e.preventDefault()

    const element = findElement(e)

    if (element.isCountryCircle) {
        const id = element.id
        d3.select(`.text-${id}`).classed('show', true)
    } else {
        d3.selectAll('.' + cssClasses.countryTip).classed('show', false)
    }
});
