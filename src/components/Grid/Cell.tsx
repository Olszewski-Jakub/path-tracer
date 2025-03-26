import React, { memo } from 'react';
import { Cell as CellType, CellPosition } from '../../types';

/**
 * React functional component representing a cell in the grid.
 *
 * @param {CellProps} props - The properties passed to the component.
 * @param {CellType} props.cell - The cell data including its position and type.
 * @param {function} props.onMouseDown - Function to handle mouse down event on the cell.
 * @param {function} props.onMouseEnter - Function to handle mouse enter event on the cell.
 * @param {function} props.onMouseUp - Function to handle mouse up event on the cell.
 * @param {boolean} [props.isDark=false] - Optional flag to indicate if the dark theme is enabled.
 * @returns {JSX.Element} The rendered cell component.
 */
interface CellProps {
  cell: CellType;
  onMouseDown: (position: CellPosition) => void;
  onMouseEnter: (position: CellPosition) => void;
  onMouseUp: () => void;
  isDark?: boolean;
}

const Cell: React.FC<CellProps> = ({
                                     cell,
                                     onMouseDown,
                                     onMouseEnter,
                                     onMouseUp,
                                     isDark = false
                                   }) => {
  const { position, type } = cell;

  /**
   * Determines the background color of the cell based on its type and theme.
   *
   * @returns {string} The CSS class for the cell's background color.
   */
  const getCellColor = (): string => {
    switch (type) {
      case 'start':
        return 'bg-green-500';
      case 'end':
        return 'bg-red-500';
      case 'wall':
        return isDark ? 'bg-gray-300' : 'bg-gray-800';
      case 'visited':
        return isDark ? 'bg-blue-500 bg-opacity-70' : 'bg-blue-400';
      case 'path':
        return 'bg-yellow-400';
      case 'current':
        return 'bg-purple-500';
      case 'frontier':
        return isDark ? 'bg-cyan-500 bg-opacity-70' : 'bg-cyan-400';
      default:
        return isDark
            ? 'bg-gray-700 hover:bg-gray-600'
            : 'bg-white hover:bg-gray-100';
    }
  };

  /**
   * Determines the border color of the cell based on the theme.
   *
   * @returns {string} The CSS class for the cell's border color.
   */
  const getBorderColor = (): string => {
    return isDark
        ? 'border-gray-600'
        : 'border-gray-200';
  };

  /**
   * Gets tooltip text for the cell based on its type.
   *
   * @returns {string} The tooltip text.
   */
  const getTooltipText = (): string => {
    switch (type) {
      case 'start':
        return 'Start Node';
      case 'end':
        return 'End Node';
      case 'wall':
        return 'Wall';
      case 'visited':
        return `Visited (Distance: ${cell.distance === Infinity ? '∞' : cell.distance})`;
      case 'path':
        return 'Path';
      case 'current':
        return 'Current Node';
      case 'frontier':
        return `Frontier (f=${cell.fScore === Infinity ? '∞' : cell.fScore.toFixed(1)}, g=${cell.gScore === Infinity ? '∞' : cell.gScore})`;
      default:
        return 'Empty';
    }
  };

  return (
      <div
          className={`h-6 w-6 border ${getBorderColor()} ${getCellColor()} transition-colors duration-150`}
          onMouseDown={() => onMouseDown(position)}
          onMouseEnter={() => onMouseEnter(position)}
          onMouseUp={onMouseUp}
          title={getTooltipText()}
      >
        {type === 'start' && <span className="text-white text-xs flex items-center justify-center h-full">S</span>}
        {type === 'end' && <span className="text-white text-xs flex items-center justify-center h-full">E</span>}
      </div>
  );
};

// Fixed memo comparison function to properly handle position changes
export default memo(Cell, (prevProps, nextProps) => {
  // Check if the cell type changed
  if (prevProps.cell.type !== nextProps.cell.type) {
    return false;
  }

  // Check if the position changed (important for drag functionality)
  if (prevProps.cell.position.row !== nextProps.cell.position.row ||
      prevProps.cell.position.col !== nextProps.cell.position.col) {
    return false;
  }

  // Check if the theme changed
  if (prevProps.isDark !== nextProps.isDark) {
    return false;
  }

  // If none of the above changed, the component doesn't need to re-render
  return true;
});