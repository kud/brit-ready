// Renders a character grid into crisp pixel rectangles. Each char maps to a
// colour (or transparent). Authoring art as text rows keeps it editable.

export interface PixelSpriteProps {
  rows: string[];
  palette: Record<string, string>;
  /** Logical pixel size in CSS px. */
  scale?: number;
  className?: string;
  title?: string;
}

export const PixelSprite = ({
  rows,
  palette,
  scale = 6,
  className,
  title,
}: PixelSpriteProps) => {
  const width = Math.max(...rows.map((r) => r.length));
  const height = rows.length;
  const rects: React.ReactNode[] = [];

  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x += 1) {
      const colour = palette[row[x]];
      if (!colour) continue;
      rects.push(
        <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={colour} />,
      );
    }
  });

  return (
    <svg
      className={className}
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {rects}
    </svg>
  );
};
