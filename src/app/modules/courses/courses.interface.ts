import { Document, Model } from 'mongoose';
import { IUser } from '../user/user.interface';

export type IComment = {
   user: Partial<IUser>;
   question: string;
   questionReplies?: IComment[];
} & Document;

export type IReview = {
   user: Partial<IUser>;
   rating: number;
   comment: string;
   commentReplies?: IComment[];
} & Document;

export type ILink = {
   title: string;
   url: string;
} & Document;

export type ICourseData = {
   title: string;
   description: string;
   videoUrl: string;
   videoSection: string;
   videoLength: number;
   videoPlayer: string;
   links: ILink[];
   suggestions: string;
   questions: IComment[];
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

export type IQuestionData = {
   courseId: string;
   contentId: string;
   question: string;
};
export type IReplyData = {
   courseId: string;
   contentId: string;
   questionId: string;
   answer: string;
};

export type IReviewData = {
   courseId: string;
   review: string;
   rating: number;
};
export type IReplyReviewData = {
   courseId: string;
   reviewId: string;
   comment: number;
};
