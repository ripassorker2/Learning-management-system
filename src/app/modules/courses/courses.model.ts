import { Schema, model } from 'mongoose';
import {
   CoureseModel,
   IComment,
   ICourseData,
   ICourses,
   ILink,
   IReview,
} from './courses.interface';

const commentSchema = new Schema<IComment>({
   user: {
      type: Object,
      required: true,
   },
   comment: {
      type: String,
      required: true,
   },
   commentReplies: [Object],
});

const reviewSchema = new Schema<IReview>({
   user: {
      type: Object,
      required: true,
   },
   rating: {
      type: Number,
      default: 0,
      required: true,
   },
   comment: {
      type: String,
      required: true,
   },
   commentReplies: [Object],
});
const linkSchema = new Schema<ILink>({
   title: {
      type: String,
      required: true,
   },
   url: {
      type: String,
      required: true,
   },
});
const courseDataSchema = new Schema<ICourseData>({
   title: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      required: true,
   },
   videoUrl: {
      type: String,
      required: true,
   },
   videoThumbnail: {
      type: Object,
      required: true,
   },
   videoSection: {
      type: String,
      required: true,
   },
   videoLength: {
      type: Number,
      required: true,
   },
   videoPlayer: {
      type: String,
      required: true,
   },
   links: {
      type: [linkSchema],
      required: true,
   },
   suggestions: {
      type: String,
      required: true,
   },
   question: {
      type: [commentSchema],
      required: true,
   },
});

const courseSchema = new Schema<ICourses>({
   name: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      required: true,
   },
   price: {
      type: Number,
      required: true,
   },
   estimatedPrice: {
      type: Number,
   },
   thumbnail: {
      public_id: {
         type: String,
         required: true,
      },
      url: {
         type: String,
         required: true,
      },
   },
   tags: {
      type: String,
      required: true,
   },
   level: {
      type: String,
      required: true,
   },
   demoUrl: {
      type: String,
      required: true,
   },
   benefits: [{ title: String }],
   prerequisites: [{ title: String }],

   reviews: [reviewSchema],
   courseData: {
      type: [courseDataSchema],
      required: true,
   },
   ratings: {
      type: Number,
      default: 0,
   },
   purchase: {
      type: Number,
      default: 0,
   },
});

export const Course = model<ICourses, CoureseModel>(' Course', courseSchema);
