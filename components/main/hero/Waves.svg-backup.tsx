'use client'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'

interface Point {
    x: number
    y: number
    wave: { x: number; y: number }
    cursor: {
        x: number
        y: number
        vx: number
        vy: number
    }
}

interface WavesProps {
    className?: string
    strokeColor?: string
    backgroundColor?: string
    pointerSize?: number
}

export function Waves({
    className = "",
    strokeColor = "#ffffff",  // White lines
    backgroundColor = "#000000",  // Black background
    pointerSize = 0.5
}: WavesProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const mouseRef = useRef({
        x: -10,
        y: 0,
        lx: 0,
        ly: 0,
        sx: 0,
        sy: 0,
        v: 0,
        vs: 0,
        a: 0,
        set: false,
    })
    const pathsRef = useRef<SVGPathElement[]>([])
    const linesRef = useRef<Point[][]>([])
    const noiseRef = useRef<((x: number, y: number) => number) | null>(null)
    const rafRef = useRef<number | null>(null)
    const boundingRef = useRef<DOMRect | null>(null)

    // Initialization
    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return

        // Initialize noise generator
        noiseRef.current = createNoise2D()

        // Initialize size and lines
        setSize()
        setLines()

        // Bind events
        window.addEventListener('resize', onResize)
        window.addEventListener('mousemove', onMouseMove)
        containerRef.current.addEventListener('touchmove', onTouchMove, { passive: false })

        // Start animation
        rafRef.current = requestAnimationFrame(tick)

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            window.removeEventListener('resize', onResize)
            window.removeEventListener('mousemove', onMouseMove)
            containerRef.current?.removeEventListener('touchmove', onTouchMove)
        }
    }, [])

    // Set SVG size
    const setSize = () => {
        if (!containerRef.current || !svgRef.current) return

        boundingRef.current = containerRef.current.getBoundingClientRect()
        const { width, height } = boundingRef.current

        svgRef.current.style.width = `${width}px`
        svgRef.current.style.height = `${height}px`
    }

    // Setup lines - create rug fiber effect
    const setLines = () => {
        if (!svgRef.current || !boundingRef.current) return

        const { width, height } = boundingRef.current
        linesRef.current = []

        // Clear existing paths
        pathsRef.current.forEach(path => {
            path.remove()
        })
        pathsRef.current = []

        // Optimized spacing for rug fiber effect
        const xGap = 10  // Balanced spacing for performance
        const yGap = 14  // Balanced spacing for performance

        const oWidth = width + 100
        const oHeight = height + 100

        const totalLines = Math.ceil(oWidth / xGap)
        const totalFibers = Math.ceil(oHeight / yGap)

        const xStart = (width - xGap * totalLines) / 2
        const yStart = (height - yGap * totalFibers) / 2

        // Create short fiber lines (like rug pile)
        for (let i = 0; i < totalLines; i++) {
            for (let j = 0; j < totalFibers; j++) {
                // Each fiber is a short line segment
                const baseX = xStart + xGap * i
                const baseY = yStart + yGap * j

                // Create points for each fiber
                const fiberLength = 4 + Math.random() * 3  // Longer, varied length
                const points: Point[] = []

                for (let k = 0; k < 4; k++) {
                    const point: Point = {
                        x: baseX + (Math.random() - 0.5) * 1,
                        y: baseY + k * (fiberLength / 2),
                        wave: { x: 0, y: 0 },
                        cursor: { x: 0, y: 0, vx: 0, vy: 0 },
                    }
                    points.push(point)
                }

                // Create SVG path for each fiber
                const path = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'path'
                )
                path.classList.add('fiber')
                path.setAttribute('fill', 'none')

                // Orange color variation for realistic rug feel (darker shade)
                const colorVariation = Math.floor(Math.random() * 20) - 10
                const r = Math.min(255, Math.max(0, 210 + colorVariation))
                const g = Math.min(255, Math.max(0, 80 + colorVariation))
                const b = Math.min(255, Math.max(0, 3 + colorVariation))

                path.setAttribute('stroke', `rgb(${r}, ${g}, ${b})`)
                path.setAttribute('stroke-width', '3.5')
                path.setAttribute('stroke-linecap', 'round')
                path.setAttribute('opacity', '0.85')

                svgRef.current.appendChild(path)
                pathsRef.current.push(path)
                linesRef.current.push(points)
            }
        }
    }

    // Resize handler
    const onResize = () => {
        setSize()
        setLines()
    }

    // Mouse handler
    const onMouseMove = (e: MouseEvent) => {
        updateMousePosition(e.pageX, e.pageY)
    }

    // Touch handler
    const onTouchMove = (e: TouchEvent) => {
        e.preventDefault()
        const touch = e.touches[0]
        updateMousePosition(touch.clientX, touch.clientY)
    }

    // Update mouse position
    const updateMousePosition = (x: number, y: number) => {
        if (!boundingRef.current) return

        const mouse = mouseRef.current
        mouse.x = x - boundingRef.current.left
        mouse.y = y - boundingRef.current.top + window.scrollY

        if (!mouse.set) {
            mouse.sx = mouse.x
            mouse.sy = mouse.y
            mouse.lx = mouse.x
            mouse.ly = mouse.y

            mouse.set = true
        }

        // Update CSS variables
        if (containerRef.current) {
            containerRef.current.style.setProperty('--x', `${mouse.sx}px`)
            containerRef.current.style.setProperty('--y', `${mouse.sy}px`)
        }
    }

    // Move points - rug fiber motion
    const movePoints = (time: number) => {
        const { current: lines } = linesRef
        const { current: mouse } = mouseRef
        const { current: noise } = noiseRef

        if (!noise) return

        lines.forEach((points) => {
            points.forEach((p: Point) => {
                // Subtle wave movement for natural fiber sway
                const move = noise(
                    (p.x + time * 0.005) * 0.002,
                    (p.y + time * 0.002) * 0.001
                ) * 5

                p.wave.x = Math.cos(move) * 3  // Very subtle horizontal sway
                p.wave.y = Math.sin(move) * 2  // Gentle vertical movement

                // Mouse effect - fibers respond to mouse like wind through rug
                const dx = p.x - mouse.sx
                const dy = p.y - mouse.sy
                const d = Math.hypot(dx, dy)
                const l = Math.max(120, mouse.vs)

                if (d < l) {
                    const s = 1 - d / l
                    const f = Math.cos(d * 0.002) * s

                    // Fibers bend away from mouse cursor
                    p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.0008
                    p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.0008
                }

                // Spring back to original position
                p.cursor.vx += (0 - p.cursor.x) * 0.02
                p.cursor.vy += (0 - p.cursor.y) * 0.02

                // Damping for realistic fiber behavior
                p.cursor.vx *= 0.92
                p.cursor.vy *= 0.92

                p.cursor.x += p.cursor.vx
                p.cursor.y += p.cursor.vy

                // Limit fiber bending
                p.cursor.x = Math.min(30, Math.max(-30, p.cursor.x))
                p.cursor.y = Math.min(30, Math.max(-30, p.cursor.y))
            })
        })
    }

    // Get moved point coordinates
    const moved = (point: Point, withCursorForce = true) => {
        const coords = {
            x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
            y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
        }

        return coords
    }

    // Draw lines - using line segments
    const drawLines = () => {
        const { current: lines } = linesRef
        const { current: paths } = pathsRef

        lines.forEach((points, lIndex) => {
            if (points.length < 2 || !paths[lIndex]) return;

            // First point
            const firstPoint = moved(points[0], false)
            let d = `M ${firstPoint.x} ${firstPoint.y}`

            // Connect points with lines
            for (let i = 1; i < points.length; i++) {
                const current = moved(points[i])
                d += `L ${current.x} ${current.y}`
            }

            paths[lIndex].setAttribute('d', d)
        })
    }

    // Animation logic
    const tick = (time: number) => {
        const { current: mouse } = mouseRef

        // Smooth mouse movement
        mouse.sx += (mouse.x - mouse.sx) * 0.1
        mouse.sy += (mouse.y - mouse.sy) * 0.1

        // Mouse velocity
        const dx = mouse.x - mouse.lx
        const dy = mouse.y - mouse.ly
        const d = Math.hypot(dx, dy)

        mouse.v = d
        mouse.vs += (d - mouse.vs) * 0.1
        mouse.vs = Math.min(100, mouse.vs)

        // Previous mouse position
        mouse.lx = mouse.x
        mouse.ly = mouse.y

        // Mouse angle
        mouse.a = Math.atan2(dy, dx)

        // Animation
        if (containerRef.current) {
            containerRef.current.style.setProperty('--x', `${mouse.sx}px`)
            containerRef.current.style.setProperty('--y', `${mouse.sy}px`)
        }

        movePoints(time)
        drawLines()

        rafRef.current = requestAnimationFrame(tick)
    }

    return (
        <div
            ref={containerRef}
            className={`waves-component relative overflow-hidden ${className}`}
            style={{
                backgroundColor,
                position: 'absolute',
                top: 0,
                left: 0,
                margin: 0,
                padding: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                '--x': '-0.5rem',
                '--y': '50%',
            } as React.CSSProperties}
        >
            <svg
                ref={svgRef}
                className="block w-full h-full js-svg"
                xmlns="http://www.w3.org/2000/svg"
            />
            <div
                className="pointer-dot"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${pointerSize}rem`,
                    height: `${pointerSize}rem`,
                    background: strokeColor,
                    borderRadius: '50%',
                    transform: 'translate3d(calc(var(--x) - 50%), calc(var(--y) - 50%), 0)',
                    willChange: 'transform',
                }}
            />
        </div>
    )
}
