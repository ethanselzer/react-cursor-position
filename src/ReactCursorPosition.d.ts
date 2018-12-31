import React, { ReactPropTypes } from 'react';

interface DetectedEnvironment {
  isMouseDetected: boolean;
  isTouchDetected: boolean;
}

interface ElementDimensions {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

interface CursorPositionGeneratedProps {
  detectedEnvironment: DetectedEnvironment;
  elementDimensions: ElementDimensions;
  isActive: boolean;
  isPositionOutside: boolean;
  position: Position;
}

interface CursorPositionOptionsProps {
  // TODO: Make these more specific
  activationInteractionMouse?: string;
  activationInteractionTouch?: string;
  children: (CursorPositionOutputProps) => React.ReactElement<any> | null;
  className?: string;
  hoverDelayInMs?: number;
  isEnabled?: boolean;
  mapChildProps?: (CursorPositionGeneratedProps) => object;
  onActivationChanged?: ({isActive: boolean}) => void;
  onDetectedEnvironmentChanged?: (DetectedEnvironment) => void;
  onPositionChanged?: (CursorPositionGeneratedProps) => void;
  pressDurationInMs?: number;
  pressMoveThreshold?: number;
  shouldDecorateChildren?: boolean;
  shouldStopTouchMovePropagation?: boolean;
  style?: object;
  tapDurationInMs?: number;
  tapMoveThreshold?: number;
}

export interface CursorPositionOutputProps extends CursorPositionGeneratedProps {
  [property:string]: any;
}

export interface CursorPositionInputProps extends CursorPositionOptionsProps {
  [property:string]: any;
}

declare class ReactCursorPosition extends React.Component<CursorPositionInputProps, any> {
}

export default ReactCursorPosition;
