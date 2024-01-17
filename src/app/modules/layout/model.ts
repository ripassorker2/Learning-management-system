import { Schema, model } from 'mongoose';
import {
   IBannerImage,
   ICategotry,
   IFaqItem,
   ILayout,
   LayoutModel,
} from './interface';

const faqSchema = new Schema<IFaqItem>({
   question: {
      type: String,
   },
   answer: {
      type: String,
   },
});

const categorySchema = new Schema<ICategotry>({
   title: {
      type: String,
   },
});
const bannerSchema = new Schema<IBannerImage>({
   public_id: {
      type: String,
   },
   url: {
      type: String,
   },
});

const layoutSchema = new Schema<ILayout>({
   type: {
      type: String,
   },
   categories: [categorySchema],
   faq: [faqSchema],
   banner: {
      image: bannerSchema,
      title: String,
      subtitle: String,
   },
});

export const Layout = model<ILayout, LayoutModel>('Layout', layoutSchema);
