import { useState } from "react";
import { type Milestone } from "@/lib/validators/schemas";
import { cn } from "@/lib/utils";

interface RoadmapVisualProps {
  milestones: Milestone[];
  onMilestoneClick?: (milestone: Milestone) => void;
}

const RoadmapVisual = ({ milestones, onMilestoneClick }: RoadmapVisualProps) => {
  const [hoveredMilestone, setHoveredMilestone] = useState<string | null>(null);

  // Group milestones by category
  const year1 = milestones.filter((m) => m.category === "1-year");
  const year5 = milestones.filter((m) => m.category === "5-year");
  const year10 = milestones.filter((m) => m.category === "10-year");

  // Calculate milestone positions along the path
  const getMilestonePositions = (
    items: Milestone[],
    startPercent: number,
    endPercent: number
  ) => {
    if (items.length === 0) return [];
    const step = (endPercent - startPercent) / (items.length + 1);
    return items.map((m, i) => ({
      milestone: m,
      percent: startPercent + step * (i + 1),
    }));
  };

  const year1Positions = getMilestonePositions(year1, 0, 0.33);
  const year5Positions = getMilestonePositions(year5, 0.33, 0.66);
  const year10Positions = getMilestonePositions(year10, 0.66, 1);
  const allPositions = [...year1Positions, ...year5Positions, ...year10Positions];

  // SVG path for winding road (bottom to top)
  const pathD = `
    M 200 580
    C 200 520, 350 480, 350 420
    C 350 360, 150 320, 150 260
    C 150 200, 350 160, 350 100
    C 350 60, 250 40, 250 20
  `;

  // Get point on path at percentage (0-1)
  const getPointOnPath = (percent: number): { x: number; y: number } => {
    // Approximate positions along the path
    const points = [
      { x: 200, y: 580 }, // 0% - Start
      { x: 275, y: 500 }, // 15%
      { x: 350, y: 420 }, // 33% - Year 1 marker
      { x: 250, y: 340 }, // 45%
      { x: 150, y: 260 }, // 55%
      { x: 250, y: 180 }, // 66% - Year 5 marker
      { x: 350, y: 100 }, // 80%
      { x: 300, y: 60 },  // 90%
      { x: 250, y: 20 },  // 100% - Year 10 / Vision
    ];

    const totalPoints = points.length - 1;
    const index = percent * totalPoints;
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.min(lowerIndex + 1, totalPoints);
    const t = index - lowerIndex;

    return {
      x: points[lowerIndex].x + (points[upperIndex].x - points[lowerIndex].x) * t,
      y: points[lowerIndex].y + (points[upperIndex].y - points[lowerIndex].y) * t,
    };
  };

  // Get color based on position (green -> gold -> bright gold)
  const getNodeColor = (percent: number) => {
    if (percent < 0.33) return "#22c55e"; // Green - Year 1
    if (percent < 0.66) return "#eab308"; // Yellow - Year 5
    return "#f59e0b"; // Amber/Gold - Year 10
  };

  return (
    <div className="relative w-full bg-gradient-to-t from-muted/50 to-background rounded-xl p-4 overflow-hidden">
      <svg
        viewBox="0 0 500 620"
        className="w-full h-auto max-h-[600px]"
        style={{ minHeight: "400px" }}
      >
        <defs>
          {/* Road gradient */}
          <linearGradient id="roadGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--muted))" />
            <stop offset="50%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
          </linearGradient>
          {/* Glow effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* The winding road - background */}
        <path
          d={pathD}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="40"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* The winding road - main */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#roadGradient)"
          strokeWidth="24"
          strokeLinecap="round"
        />

        {/* Road center line (dashed) */}
        <path
          d={pathD}
          fill="none"
          stroke="hsl(var(--background))"
          strokeWidth="2"
          strokeDasharray="8 12"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Year markers */}
        <g className="text-xs font-semibold">
          {/* Start marker */}
          <g transform="translate(200, 580)">
            <circle r="20" fill="hsl(var(--primary))" />
            <text y="5" textAnchor="middle" fill="white" fontSize="12">🚀</text>
          </g>
          <text x="260" y="590" fill="hsl(var(--foreground))" fontSize="14" fontWeight="600">
            START
          </text>

          {/* 1-Year marker */}
          <text x="400" y="420" fill="#22c55e" fontSize="13" fontWeight="600">
            YEAR 1
          </text>

          {/* 5-Year marker */}
          <text x="50" y="260" fill="#eab308" fontSize="13" fontWeight="600">
            YEAR 5
          </text>

          {/* 10-Year / Vision marker */}
          <g transform="translate(250, 20)">
            <text y="-10" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="16">
              🏆
            </text>
          </g>
          <text x="310" y="25" fill="#f59e0b" fontSize="13" fontWeight="600">
            YEAR 10
          </text>
        </g>

        {/* Milestone nodes */}
        {allPositions.map(({ milestone, percent }) => {
          const pos = getPointOnPath(percent);
          const color = getNodeColor(percent);
          const isHovered = hoveredMilestone === milestone.id;

          return (
            <g
              key={milestone.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              className="cursor-pointer transition-transform"
              onMouseEnter={() => setHoveredMilestone(milestone.id)}
              onMouseLeave={() => setHoveredMilestone(null)}
              onClick={() => onMilestoneClick?.(milestone)}
              style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${isHovered ? 1.2 : 1})` }}
            >
              {/* Outer glow when hovered */}
              {isHovered && (
                <circle r="24" fill={color} opacity="0.3" filter="url(#glow)" />
              )}

              {/* Node circle */}
              <circle
                r="14"
                fill={color}
                stroke="white"
                strokeWidth="3"
                className="drop-shadow-lg"
              />

              {/* Inner dot */}
              <circle r="5" fill="white" />

              {/* Tooltip on hover */}
              {isHovered && (
                <g>
                  <rect
                    x="-80"
                    y="-60"
                    width="160"
                    height="45"
                    rx="8"
                    fill="hsl(var(--popover))"
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    className="drop-shadow-xl"
                  />
                  <text
                    x="0"
                    y="-40"
                    textAnchor="middle"
                    fill="hsl(var(--popover-foreground))"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {milestone.title.length > 20
                      ? milestone.title.substring(0, 20) + "..."
                      : milestone.title}
                  </text>
                  {milestone.timeframe && (
                    <text
                      x="0"
                      y="-25"
                      textAnchor="middle"
                      fill="hsl(var(--muted-foreground))"
                      fontSize="10"
                    >
                      {milestone.timeframe}
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* Empty state message */}
        {allPositions.length === 0 && (
          <text
            x="250"
            y="300"
            textAnchor="middle"
            fill="hsl(var(--muted-foreground))"
            fontSize="14"
          >
            Add milestones to see them on your journey!
          </text>
        )}
      </svg>
    </div>
  );
};

export default RoadmapVisual;

