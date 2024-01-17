import { Document, Model } from 'mongoose';

export type IFaqItem = {
   question: string;
   answer: string;
} & Document;

export type ICategotry = {
   title: string;
} & Document;

export type IBannerImage = {
   public_id: string;
   url: string;
} & Document;

export type ILayout = {
   type: string;
   categories: ICategotry[];
   faq: IFaqItem[];
   banner: {
      image: IBannerImage;
      title: string;
      subtitle: string;
   };
} & Document;

export type LayoutModel = Model<ILayout>;
