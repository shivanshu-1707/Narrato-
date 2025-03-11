interface SlideNode {
  "p:txBody"?: {
    "a:p"?: {
      "a:r"?: {
        "a:t"?: string[];
      }[];
    }[];
  }[];
}

interface SlideTree {
  "p:sp"?: SlideNode[];
}

interface SlideContent {
  "p:sld"?: {
    "p:cSld"?: {
      "p:spTree"?: SlideTree[];
    }[];
  };
}

type TextItem = {
  str: string;
  transform: number[];
  width: number;
  height: number;
  dir: string;
  fontName: string;
};

type Slide ={
  slide:number,
  text:string, 
} 

export type{SlideContent, SlideNode, SlideTree, TextItem, Slide};