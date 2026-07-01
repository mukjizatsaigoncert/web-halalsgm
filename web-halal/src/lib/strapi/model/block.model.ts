export enum StrapiBlockComponent {
  Media = "shared.media",
  Quote = "shared.quote",
  RichText = "shared.rich-text",
  Slider = "shared.slider",
}

export type StrapiBlock = {
  __component: string;
  id: string;
  [key: string]: any;
};

export type StrapiBlockMedia = {
  __component: StrapiBlockComponent.Media;
  id: string;
  file: {
    url: string;
  };
};

export type StrapiBlockQuote = {
  __component: StrapiBlockComponent.Quote;
  id: string;
  title: string;
  body: string;
};

export type StrapiBlockRichText = {
  __component: StrapiBlockComponent.RichText;
  id: string;
  body: string;
};

export type StrapiBlockSlider = {
  __component: StrapiBlockComponent.Slider;
  id: string;
  files: {
    url: string;
  }[];
};
