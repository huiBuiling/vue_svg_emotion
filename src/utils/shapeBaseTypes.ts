import type {
  BeardShape,
  ClothesShape,
  EarringsShape,
  EarShape,
  EyebrowsShape,
  EyesShape,
  FaceShape,
  GlassesShape,
  MouthShape,
  NoseShape,
  TopsShape,
} from './shapeEnum'
import { BgShape, Gender } from './shapeEnum'

export const NONE = 'none'
export type None = typeof NONE

// 每个部位包含属性
interface Widget<Shape> {
  // shape: Shape | None
  shape: string | None
  zIndex?: number
  fillColor?: string
  strokeColor?: string
}

// 头像属性
export type AvatarWidgets = {
  face: Widget<FaceShape>
  tops: Widget<TopsShape>
  ear: Widget<EarShape>
  earrings: Widget<EarringsShape>
  eyebrows: Widget<EyebrowsShape>
  glasses: Widget<GlassesShape>
  eyes: Widget<EyesShape>
  nose: Widget<NoseShape>
  mouth: Widget<MouthShape>
  beard: Widget<BeardShape>
  clothes: Widget<ClothesShape>
}

export interface AvatarOption {
  // gender?: Gender

  // wrapperShape?: `${BgShape}`

  // background: {
  //   color: string
  // }

  widgets: Partial<AvatarWidgets>
}
