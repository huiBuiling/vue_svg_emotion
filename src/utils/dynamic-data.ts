import {
  AvatarType,
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

/** @internal */
type Data = Readonly<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in `${AvatarType}`]: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key in string]: () => Promise<any>
  }
}>

const svgData: Data = {
  [AvatarType.Face]: {
    [FaceShape.Base]: () => import(`../assets/widgets/face/base.svg?raw`),
  },

  [AvatarType.Ear]: {
    [EarShape.Attached]: () => import(`../assets/widgets/ear/attached.svg?raw`),
    [EarShape.Detached]: () => import(`../assets/widgets/ear/detached.svg?raw`),
  },

  [AvatarType.Eyes]: {
    [EyesShape.Ellipse]: () => import(`../assets/widgets/eyes/ellipse.svg?raw`),
    [EyesShape.Eyeshadow]: () =>
      import(`../assets/widgets/eyes/eyeshadow.svg?raw`),
    [EyesShape.Round]: () => import(`../assets/widgets/eyes/round.svg?raw`),
    [EyesShape.Smiling]: () => import(`../assets/widgets/eyes/smiling.svg?raw`),
  },

  [AvatarType.Beard]: {
    [BeardShape.Scruff]: () => import(`../assets/widgets/beard/scruff.svg?raw`),
  },

  [AvatarType.Clothes]: {
    [ClothesShape.Collared]: () =>
      import(`../assets/widgets/clothes/collared.svg?raw`),
    [ClothesShape.Crew]: () => import(`../assets/widgets/clothes/crew.svg?raw`),
    [ClothesShape.Open]: () => import(`../assets/widgets/clothes/open.svg?raw`),
  },

  [AvatarType.Earrings]: {
    [EarringsShape.Hoop]: () =>
      import(`../assets/widgets/earrings/hoop.svg?raw`),
    [EarringsShape.Stud]: () =>
      import(`../assets/widgets/earrings/stud.svg?raw`),
    [EarringsShape.Irregular]: () =>
      import(`../assets/widgets/earrings/irregular.svg?raw`),
  },

  [AvatarType.Eyebrows]: {
    [EyebrowsShape.Down]: () =>
      import(`../assets/widgets/eyebrows/down.svg?raw`),
    [EyebrowsShape.Eyelashesdown]: () =>
      import(`../assets/widgets/eyebrows/eyelashesdown.svg?raw`),
    [EyebrowsShape.Eyelashesup]: () =>
      import(`../assets/widgets/eyebrows/eyelashesup.svg?raw`),
    [EyebrowsShape.Up]: () => import(`../assets/widgets/eyebrows/up.svg?raw`),
  },

  [AvatarType.Glasses]: {
    [GlassesShape.Round]: () =>
      import(`../assets/widgets/glasses/round.svg?raw`),
    [GlassesShape.Square]: () =>
      import(`../assets/widgets/glasses/square.svg?raw`),
  },

  [AvatarType.Mouth]: {
    [MouthShape.Frown]: () => import(`../assets/widgets/mouth/frown.svg?raw`),
    [MouthShape.Laughing]: () =>
      import(`../assets/widgets/mouth/laughing.svg?raw`),
    [MouthShape.Nervous]: () =>
      import(`../assets/widgets/mouth/nervous.svg?raw`),
    [MouthShape.Pucker]: () => import(`../assets/widgets/mouth/pucker.svg?raw`),
    [MouthShape.Sad]: () => import(`../assets/widgets/mouth/sad.svg?raw`),
    [MouthShape.Smile]: () => import(`../assets/widgets/mouth/smile.svg?raw`),
    [MouthShape.Smirk]: () => import(`../assets/widgets/mouth/smirk.svg?raw`),
    [MouthShape.Surprised]: () =>
      import(`../assets/widgets/mouth/surprised.svg?raw`),
  },

  [AvatarType.Nose]: {
    [NoseShape.Curve]: () => import(`../assets/widgets/nose/curve.svg?raw`),
    [NoseShape.Pointed]: () => import(`../assets/widgets/nose/pointed.svg?raw`),
    [NoseShape.Round]: () => import(`../assets/widgets/nose/round.svg?raw`),
  },

  [AvatarType.Tops]: {
    [TopsShape.Beanie]: () => import(`../assets/widgets/tops/beanie.svg?raw`),
    [TopsShape.Clean]: () => import(`../assets/widgets/tops/clean.svg?raw`),
    [TopsShape.Danny]: () => import(`../assets/widgets/tops/danny.svg?raw`),
    [TopsShape.Fonze]: () => import(`../assets/widgets/tops/fonze.svg?raw`),
    [TopsShape.Funny]: () => import(`../assets/widgets/tops/funny.svg?raw`),
    [TopsShape.Pixie]: () => import(`../assets/widgets/tops/pixie.svg?raw`),
    [TopsShape.Punk]: () => import(`../assets/widgets/tops/punk.svg?raw`),
    [TopsShape.Turban]: () => import(`../assets/widgets/tops/turban.svg?raw`),
    [TopsShape.Wave]: () => import(`../assets/widgets/tops/wave.svg?raw`),
  },
}

export { svgData }
