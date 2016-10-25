import throttle from 'lodash/throttle'

export class CountrySelectorManager {

    constructor (clearLabels, showLabel, circleClass) {
        this.stopScroll = false
        this.moveEventThrottle = 20
        this.clearLabels = clearLabels
        this.showLabel = showLabel
        this.circleClass = circleClass
    }

    startHandlers () {
        this.touchstartHandler()
        this.touchendHandler()
        this.touchmoveHandler()
        this.mousemoveHandler()
    }

    touchstartHandler () {
        window.addEventListener('touchstart', (e) => {
            const element = this.findTouchElement(e)
            if (element.isCountryCircle)
                this.stopScroll = true
        })
    }

    touchendHandler () {
        window.addEventListener('touchend', () => {
            this.stopScroll = false
        })
    }

    touchmoveHandler () {
        window.addEventListener('touchmove', (e) => {
            if (this.stopScroll)
                e.preventDefault()

            const element = this.findTouchElement(e)
            this.toggleTextVisibility(element)
        })
    }

    mousemoveHandler () {
        window.addEventListener('mousemove', throttle((event) => {
            const element = this.findMouseElement(event)
            this.toggleTextVisibility(element)
        }, this.moveEventThrottle))
    }

    findMouseElement (event) {
        return this.findElement(event);
    }

    findTouchElement (event) {
        return this.findElement(event.touches[0])
    }

    findElement (event) {
        const x = event.clientX
        const y = event.clientY

        return this.calculateElement(x, y)
    }

    calculateElement (x, y) {
        const element = document.elementFromPoint(x, y)

        return {
            id: element.id,
            isCountryCircle: element.classList.contains(this.circleClass),
        }
    }

    toggleTextVisibility (element) {
        this.clearLabels()

        if (element.isCountryCircle)
            this.showLabel(element.id)
    }
}

export default CountrySelectorManager;
