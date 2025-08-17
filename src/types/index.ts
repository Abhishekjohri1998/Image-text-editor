export interface TextLayer {
  id: string,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fontSize: number,
  fontFamily: string,
  fontWeight: string,
  color: string,
  opacity: number,
  rotation: number,
  textAlign: 'left' | 'center' | 'right',
  zIndex: number
}

export interface CanvasSize {
  width: number,
  height: number
}
