'use client'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'

interface Fiber {
    baseX: number
    baseY: number
    angle: number
    length: number
    colorIndex: number
    segments: FiberSegment[]
}

interface FiberSegment {
    x: number
    y: number
    offsetX: number
    offsetY: number
    weight: number          // 0 = root (anchored), 1 = tip (freely moves)
    wave: { x: number; y: number }
    cursor: { x: number; y: number; vx: number; vy: number }
}

interface WavesProps {
    className?: string
    strokeColor?: string
    backgroundColor?: string
    pointerSize?: number
}

// Convert hex to rgb
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 232, g: 93, b: 4 }
}

// Generate color variations based on strokeColor
const generateColors = (strokeColor: string): string[] => {
    const { r, g, b } = hexToRgb(strokeColor)
    return [
        `rgba(${r}, ${g}, ${b}, 0.9)`,
        `rgba(${r}, ${g}, ${b}, 0.88)`,
        `rgba(${r}, ${g}, ${b}, 0.86)`,
        `rgba(${r}, ${g}, ${b}, 0.85)`,
        `rgba(${r}, ${g}, ${b}, 0.84)`,
        `rgba(${r}, ${g}, ${b}, 0.83)`,
        `rgba(${r}, ${g}, ${b}, 0.82)`,
    ]
}

class SpatialGrid {
    private cellSize: number
    private grid: Map<string, number[]>

    constructor(cellSize: number) {
        this.cellSize = cellSize
        this.grid = new Map()
    }

    clear() { this.grid.clear() }

    add(index: number, x: number, y: number) {
        const key = `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`
        if (!this.grid.has(key)) this.grid.set(key, [])
        this.grid.get(key)!.push(index)
    }

    getNearby(x: number, y: number, radius: number): number[] {
        const result: number[] = []
        const minCX = Math.floor((x - radius) / this.cellSize)
        const maxCX = Math.floor((x + radius) / this.cellSize)
        const minCY = Math.floor((y - radius) / this.cellSize)
        const maxCY = Math.floor((y + radius) / this.cellSize)
        for (let cx = minCX; cx <= maxCX; cx++) {
            for (let cy = minCY; cy <= maxCY; cy++) {
                const indices = this.grid.get(`${cx},${cy}`)
                if (indices) result.push(...indices)
            }
        }
        return result
    }
}

export function Waves({
    className = "",
    strokeColor = "#ffffff",
    backgroundColor = "#000000",
    pointerSize = 0.5
}: WavesProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: -999, y: -999, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false, dx: 0, dy: 0 })
    const fibersRef = useRef<Fiber[]>([])
    const noiseRef = useRef<((x: number, y: number) => number) | null>(null)
    const rafRef = useRef<number | null>(null)
    const boundingRef = useRef<DOMRect | null>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
    const dprRef = useRef<number>(1)
    const spatialGridRef = useRef<SpatialGrid>(new SpatialGrid(120))
    const colorBatchesRef = useRef<number[][]>([])
    const colorsRef = useRef<string[]>(generateColors(strokeColor))

    // Update colors when strokeColor changes
    React.useEffect(() => {
        colorsRef.current = generateColors(strokeColor)
        // Regenerate fibers with new colors
        if (boundingRef.current) {
            setFibers()
        }
    }, [strokeColor])

    const setSize = () => {
        if (!containerRef.current || !canvasRef.current) return
        boundingRef.current = containerRef.current.getBoundingClientRect()
        const { width, height } = boundingRef.current
        const dpr = dprRef.current
        canvasRef.current.width = width * dpr
        canvasRef.current.height = height * dpr
        canvasRef.current.style.width = `${width}px`
        canvasRef.current.style.height = `${height}px`
        if (ctxRef.current) ctxRef.current.scale(dpr, dpr)
    }

    const setFibers = () => {
        if (!boundingRef.current) return
        const { width, height } = boundingRef.current
        fibersRef.current = []

        const xGap = 11          // 가로 간격: 촘촘한 털
        const yGap = 14          // 세로 간격
        const SEGMENTS = 6       // 세그먼트 수: 더 부드러운 곡선
        const oWidth = width + 100
        const oHeight = height + 100
        const totalLines = Math.ceil(oWidth / xGap)
        const totalFibers = Math.ceil(oHeight / yGap)
        const xStart = (width - xGap * totalLines) / 2
        const yStart = (height - yGap * totalFibers) / 2

        const grid = spatialGridRef.current
        grid.clear()

        const colors = colorsRef.current
        const batches: number[][] = colors.map(() => [])

        for (let i = 0; i < totalLines; i++) {
            for (let j = 0; j < totalFibers; j++) {
                const baseX = xStart + xGap * i
                const baseY = yStart + yGap * j

                // 털 길이: yGap보다 길어서 겹쳐 보여야 풍성함
                const length = 18 + Math.random() * 10
                // 자연스러운 누운 방향 (약간 랜덤)
                const angle = (Math.random() - 0.5) * 0.35
                const colorIndex = Math.floor(Math.random() * colors.length)

                const segments: FiberSegment[] = []
                for (let k = 0; k < SEGMENTS; k++) {
                    // weight: 0 = 뿌리 (고정), 1 = 끝 (자유롭게 이동)
                    const weight = k / (SEGMENTS - 1)
                    segments.push({
                        x: baseX,
                        y: baseY,
                        offsetX: Math.sin(angle) * (length / (SEGMENTS - 1)) * k,
                        offsetY: Math.cos(angle) * (length / (SEGMENTS - 1)) * k,
                        weight,
                        wave: { x: 0, y: 0 },
                        cursor: { x: 0, y: 0, vx: 0, vy: 0 },
                    })
                }

                const fiberIndex = fibersRef.current.length
                fibersRef.current.push({ baseX, baseY, angle, length, colorIndex, segments })

                grid.add(fiberIndex, baseX, baseY)
                batches[colorIndex].push(fiberIndex)
            }
        }

        colorBatchesRef.current = batches
    }

    const onResize = () => { setSize(); setFibers() }
    const onMouseMove = (e: MouseEvent) => updateMousePosition(e.pageX, e.pageY)
    const onTouchMove = (e: TouchEvent) => {
        e.preventDefault()
        const t = e.touches[0]
        updateMousePosition(t.clientX, t.clientY)
    }

    const updateMousePosition = (x: number, y: number) => {
        if (!boundingRef.current) return
        const mouse = mouseRef.current
        mouse.x = x - boundingRef.current.left
        mouse.y = y - boundingRef.current.top + window.scrollY
        if (!mouse.set) {
            mouse.sx = mouse.x; mouse.sy = mouse.y
            mouse.lx = mouse.x; mouse.ly = mouse.y
            mouse.set = true
        }
        if (containerRef.current) {
            containerRef.current.style.setProperty('--x', `${mouse.sx}px`)
            containerRef.current.style.setProperty('--y', `${mouse.sy}px`)
        }
    }

    const movePoints = (time: number) => {
        const fibers = fibersRef.current
        const mouse = mouseRef.current
        const noise = noiseRef.current
        if (!noise) return

        const influenceRadius = Math.max(100, mouse.vs * 1.2)

        // 실제 마우스 위치로 그리드 조회 (스무딩 위치 말고)
        // → 이동 방향 앞의 털들도 정확히 감지
        const nearbySet = mouse.set
            ? new Set(spatialGridRef.current.getNearby(mouse.x, mouse.y, influenceRadius))
            : new Set<number>()

        fibers.forEach((fiber, fiberIndex) => {
            const isNearby = nearbySet.has(fiberIndex)
            fiber.segments.forEach((seg) => {
                const px = seg.x + seg.offsetX
                const py = seg.y + seg.offsetY
                const w = seg.weight  // 0=뿌리, 1=끝

                // 잔잔한 주변 흔들림 (뿌리에선 거의 없음, 끝에서만 살짝)
                const move = noise(
                    (px + time * 0.003) * 0.0025,
                    (py + time * 0.0015) * 0.0015
                ) * 2
                seg.wave.x = Math.cos(move + fiber.angle) * 0.8 * w
                seg.wave.y = Math.sin(move) * 0.5 * w

                // 마우스 힘: cos/sin 각도 분해 대신 델타값 직접 사용
                // → 오른쪽/왼쪽/위/아래 모든 방향 동일하게 작동
                if (isNearby && w > 0) {
                    const fdx = px - mouse.x
                    const fdy = py - mouse.y
                    const d = Math.hypot(fdx, fdy)
                    if (d < influenceRadius) {
                        const s = 1 - d / influenceRadius
                        const f = s * s
                        seg.cursor.vx += mouse.dx * f * 0.28
                        seg.cursor.vy += mouse.dy * f * 0.28
                    }
                }

                // 스프링 복원
                seg.cursor.vx += (0 - seg.cursor.x) * 0.045
                seg.cursor.vy += (0 - seg.cursor.y) * 0.045

                // 댐핑
                seg.cursor.vx *= 0.76
                seg.cursor.vy *= 0.76

                seg.cursor.x += seg.cursor.vx
                seg.cursor.y += seg.cursor.vy

                // 최대 변위 제한
                const maxDisplace = 25 * w
                seg.cursor.x = Math.min(maxDisplace, Math.max(-maxDisplace, seg.cursor.x))
                seg.cursor.y = Math.min(maxDisplace, Math.max(-maxDisplace, seg.cursor.y))
            })
        })
    }

    const getFinalPos = (seg: FiberSegment, withCursor = true) => ({
        x: seg.x + seg.offsetX + seg.wave.x + (withCursor ? seg.cursor.x * seg.weight : 0),
        y: seg.y + seg.offsetY + seg.wave.y + (withCursor ? seg.cursor.y * seg.weight : 0),
    })

    const drawFibers = () => {
        const ctx = ctxRef.current
        if (!ctx || !boundingRef.current) return
        const { width, height } = boundingRef.current
        const fibers = fibersRef.current

        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, width, height)

        // 얇은 선: 털처럼 보이려면 1~1.5px
        ctx.lineWidth = 1.3
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        const colors = colorsRef.current
        colorBatchesRef.current.forEach((indices, colorIndex) => {
            if (indices.length === 0) return
            ctx.strokeStyle = colors[colorIndex]
            ctx.beginPath()

            indices.forEach((fiberIndex) => {
                const fiber = fibers[fiberIndex]
                if (fiber.segments.length < 2) return
                // 뿌리 세그먼트는 cursor 영향 없음 (고정)
                const first = getFinalPos(fiber.segments[0], false)
                ctx.moveTo(first.x, first.y)
                for (let i = 1; i < fiber.segments.length; i++) {
                    const p = getFinalPos(fiber.segments[i])
                    ctx.lineTo(p.x, p.y)
                }
            })

            ctx.stroke()
        })
    }

    const tick = (time: number) => {
        const mouse = mouseRef.current
        mouse.sx += (mouse.x - mouse.sx) * 0.15
        mouse.sy += (mouse.y - mouse.sy) * 0.15

        const dx = mouse.x - mouse.lx
        const dy = mouse.y - mouse.ly
        mouse.dx = dx   // 직접 델타 저장 (부호 보존: 오른쪽=양수, 왼쪽=음수)
        mouse.dy = dy
        mouse.v = Math.hypot(dx, dy)
        mouse.vs += (mouse.v - mouse.vs) * 0.15
        mouse.vs = Math.min(80, mouse.vs)
        mouse.lx = mouse.x
        mouse.ly = mouse.y
        mouse.a = Math.atan2(dy, dx)

        if (containerRef.current) {
            containerRef.current.style.setProperty('--x', `${mouse.sx}px`)
            containerRef.current.style.setProperty('--y', `${mouse.sy}px`)
        }

        movePoints(time)
        drawFibers()
        rafRef.current = requestAnimationFrame(tick)
    }

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return
        const container = containerRef.current
        const canvas = canvasRef.current

        const ctx = canvas.getContext('2d', { alpha: false })
        if (!ctx) return

        ctxRef.current = ctx
        dprRef.current = Math.min(window.devicePixelRatio || 1, 2)
        noiseRef.current = createNoise2D()

        setSize()
        setFibers()

        window.addEventListener('resize', onResize)
        window.addEventListener('mousemove', onMouseMove)
        container.addEventListener('touchmove', onTouchMove, { passive: false })
        rafRef.current = requestAnimationFrame(tick)

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            window.removeEventListener('resize', onResize)
            window.removeEventListener('mousemove', onMouseMove)
            container.removeEventListener('touchmove', onTouchMove)
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className={`waves-component relative overflow-hidden ${className}`}
            style={{
                backgroundColor,
                position: 'absolute',
                top: 0, left: 0,
                margin: 0, padding: 0,
                width: '100%', height: '100%',
                overflow: 'hidden',
                zIndex: 0,
                '--x': '-0.5rem',
                '--y': '50%',
            } as React.CSSProperties}
        >
            <canvas ref={canvasRef} className="block w-full h-full" />
            <div
                className="pointer-dot"
                style={{
                    position: 'absolute',
                    top: 0, left: 0,
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
