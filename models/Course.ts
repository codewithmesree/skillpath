import mongoose from 'mongoose';

const MaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['video', 'ppt', 'slides', 'notes', 'quiz'], 
    required: true 
  },
  url: { type: String }, // File data URL, download link, or embed URL
  fileName: { type: String },
  fileSize: { type: String },
  content: { type: String }, // For written notes / markdown summary
  duration: { type: String }, // For video length (e.g. 12:45)
  // Quiz specific fields if stored as material
  quizQuestion: { type: String },
  quizOptions: [{ type: String }],
  quizCorrectAnswer: { type: Number },
  quizExplanation: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String },
  duration: { type: String },
  notes: { type: String },
  pptUrl: { type: String },
  slidesUrl: { type: String },
  materials: [MaterialSchema],
});

const QuizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // index of option
  explanation: { type: String },
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  lessons: [LessonSchema],
  quizzes: [QuizSchema],
  materials: [MaterialSchema],
  rating: { type: Number, default: 4.5 },
  enrollmentsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  thumbnail: { type: String },
}, { timestamps: true });

if (process.env.NODE_ENV !== 'production' && mongoose.models.Course) {
  delete (mongoose.models as any).Course;
}

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
