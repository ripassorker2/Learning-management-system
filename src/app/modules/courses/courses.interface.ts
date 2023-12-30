import { Document, Model } from 'mongoose';

export type IComment = {
   user: object;
   comment: string;
   commentReplies?: IComment[];
} & Document;

export type IReview = {
   user: object;
   rating: number;
   comment: string;
   commentReplies: IComment[];
} & Document;

export type ILink = {
   title: string;
   url: string;
} & Document;

export type ICourseData = {
   title: string;
   description: string;
   videoUrl: string;
   videoThumbnail: object;
   videoSection: string;
   videoLength: number;
   videoPlayer: string;
   links: ILink[];
   suggestions: string;
   question: IComment[];
} & Document;

export type ICourses = {
   name: string;
   description: string;
   price: number;
   estimatedPrice: number;
   thumbnail: object;
   tags: string;
   level: string;
   demoUrl: string;
   benefits: { title: string[] };
   prerequisites: { title: string[] };
   reviews: IReview[];
   courseData: ICourseData[];
   ratings?: number;
   purchase?: number;
} & Document;

export type CoureseModel = Model<ICourses, Record<string, unknown>>;
